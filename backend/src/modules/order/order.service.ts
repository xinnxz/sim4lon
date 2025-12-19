import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto';
import { status_pesanan, lpg_type } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private activityService: ActivityService,
    ) { }

    async findAll(
        page = 1,
        limit = 10,
        status?: status_pesanan,
        pangkalanId?: string,
        driverId?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: any = { deleted_at: null };
        if (status) where.current_status = status;
        if (pangkalanId) where.pangkalan_id = pangkalanId;
        if (driverId) where.driver_id = driverId;

        const [orders, total] = await Promise.all([
            this.prisma.orders.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    pangkalans: {
                        select: { id: true, code: true, name: true, region: true, address: true, phone: true },
                    },
                    drivers: {
                        select: { id: true, code: true, name: true, phone: true },
                    },
                    order_items: true,
                    order_payment_details: true,
                },
            }),
            this.prisma.orders.count({ where }),
        ]);

        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const order = await this.prisma.orders.findFirst({
            where: { id, deleted_at: null },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
                order_payment_details: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
                invoices: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order tidak ditemukan');
        }

        return order;
    }

    async create(dto: CreateOrderDto) {

        /**
         * PENJELASAN MAPPING lpg_type:
         * 
         * Prisma enum lpg_type menggunakan @map directive:
         * - kg3  @map("3kg")   → Di TypeScript kita pakai "kg3", di database jadi "3kg"
         * - kg12 @map("12kg")  → Di TypeScript kita pakai "kg12", di database jadi "12kg"
         * - kg50 @map("50kg")  → Di TypeScript kita pakai "kg50", di database jadi "50kg"
         * 
         * Frontend bisa mengirim berbagai format: "3kg", "12kg", "kg3", "kg12", "3", "12", dll
         * Expand mapping untuk handle semua kemungkinan
         */
        const mapStringToLpgType = (strType: string): lpg_type => {
            // Normalize: lowercase and trim
            const normalized = strType.toLowerCase().trim();

            // Direct mappings (handle both formats: "3kg" and "kg3")
            const mapping: Record<string, lpg_type> = {
                // Standard format (from frontend)
                '3kg': 'kg3' as lpg_type,
                '12kg': 'kg12' as lpg_type,
                '50kg': 'kg50' as lpg_type,
                // Reversed format (if sent as kg prefix)
                'kg3': 'kg3' as lpg_type,
                'kg12': 'kg12' as lpg_type,
                'kg50': 'kg50' as lpg_type,
                // Numbers only
                '3': 'kg3' as lpg_type,
                '12': 'kg12' as lpg_type,
                '50': 'kg50' as lpg_type,
                // With decimal points
                '3.0': 'kg3' as lpg_type,
                '3.00': 'kg3' as lpg_type,
                '12.0': 'kg12' as lpg_type,
                '12.00': 'kg12' as lpg_type,
                '50.0': 'kg50' as lpg_type,
                '50.00': 'kg50' as lpg_type,
            };

            const result = mapping[normalized];
            if (result) {
                return result;
            }

            // Extract number from string (e.g., "Elpiji 12kg" -> 12)
            const numberMatch = normalized.match(/(\d+(?:\.\d+)?)/);
            if (numberMatch) {
                const size = parseFloat(numberMatch[1]);
                // Map to closest enum based on size
                if (size <= 5) return 'kg3' as lpg_type;
                if (size <= 30) return 'kg12' as lpg_type;
                return 'kg50' as lpg_type;
            }

            // Default to kg12 if can't determine (most common)
            console.warn(`Unable to map lpg_type: ${strType}, defaulting to kg12`);
            return 'kg12' as lpg_type;
        };

        // Generate order code (ORD-0001, ORD-0002, etc.)
        const orderCount = await this.prisma.orders.count();
        const orderCode = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

        // Calculate subtotal, tax, and total
        // PPN 12% hanya untuk item NON_SUBSIDI
        const PPN_RATE = 0.12;  // 12%

        let subtotal = 0;
        let totalTax = 0;

        const orderItemsData = dto.items.map((item) => {
            const itemSubtotal = item.price_per_unit * item.qty;
            const isTaxable = item.is_taxable ?? false;  // Default false (subsidi)
            const itemTax = isTaxable ? Math.round(itemSubtotal * PPN_RATE) : 0;

            subtotal += itemSubtotal;
            totalTax += itemTax;

            return {
                lpg_type: mapStringToLpgType(item.lpg_type),
                label: item.label,
                price_per_unit: item.price_per_unit,
                qty: item.qty,
                sub_total: itemSubtotal,
                is_taxable: isTaxable,
                tax_amount: itemTax,
            };
        });

        const totalAmount = subtotal + totalTax;

        const order = await this.prisma.orders.create({
            data: {
                code: orderCode,
                pangkalan_id: dto.pangkalan_id,
                driver_id: dto.driver_id,
                note: dto.note,
                subtotal: subtotal,
                tax_amount: totalTax,
                total_amount: totalAmount,
                current_status: 'DRAFT',
                order_items: {
                    create: orderItemsData,
                },
                timeline_tracks: {
                    create: {
                        status: 'DRAFT',
                        description: 'Order dibuat',
                    },
                },
            },
            include: {
                pangkalans: true,
                order_items: true,
                timeline_tracks: true,
            },
        });

        // STOCK DEDUCTION: Kurangi stok saat order dibuat
        // Gunakan dto.items untuk akses lpg_product_id (untuk dynamic products)
        for (let i = 0; i < dto.items.length; i++) {
            const dtoItem = dto.items[i];
            const orderItem = order.order_items[i];

            await this.prisma.stock_histories.create({
                data: {
                    lpg_type: orderItem.lpg_type,
                    lpg_product_id: dtoItem.lpg_product_id || null,  // Dynamic product ID
                    movement_type: 'KELUAR',
                    qty: orderItem.qty,
                    note: `Order ${order.code} - ${orderItem.label || orderItem.lpg_type}`,
                },
            });
        }

        // ACTIVITY LOG: Catat aktivitas pesanan baru
        const totalQty = order.order_items.reduce((sum, item) => sum + item.qty, 0);
        const pangkalanName = order.pangkalans?.name || 'Unknown';

        await this.activityService.create({
            type: 'order_created',
            title: 'Pesanan Baru Dibuat',
            description: `Pesanan untuk ${pangkalanName} - ${totalQty} tabung`,
            order_id: order.id,
            pangkalan_name: pangkalanName,
            detail_numeric: totalQty,
            icon_name: 'ShoppingCart',
            order_status: 'DRAFT',
        });

        return order;
    }

    async update(id: string, dto: UpdateOrderDto) {
        const existingOrder = await this.findOne(id);

        // Destructure items from dto, rest is basic fields
        const { items, ...orderData } = dto;

        // If items are provided, recalculate totals and update items
        if (items && items.length > 0) {
            const PPN_RATE = 0.12;
            let subtotal = 0;
            let totalTax = 0;

            // Map lpg_type helper (same as create)
            const mapStringToLpgType = (strType: string): any => {
                const normalized = strType.toLowerCase().trim();
                const mapping: Record<string, string> = {
                    '3kg': 'kg3', '12kg': 'kg12', '50kg': 'kg50',
                    'kg3': 'kg3', 'kg12': 'kg12', 'kg50': 'kg50',
                    '3': 'kg3', '12': 'kg12', '50': 'kg50',
                };
                return mapping[normalized] || 'kg12';
            };

            const orderItemsData = items.map((item) => {
                const itemSubtotal = item.price_per_unit * item.qty;
                const isTaxable = item.is_taxable ?? false;
                const itemTax = isTaxable ? Math.round(itemSubtotal * PPN_RATE) : 0;

                subtotal += itemSubtotal;
                totalTax += itemTax;

                return {
                    order_id: id,
                    lpg_type: mapStringToLpgType(item.lpg_type),
                    label: item.label,
                    price_per_unit: item.price_per_unit,
                    qty: item.qty,
                    sub_total: itemSubtotal,
                    is_taxable: isTaxable,
                    tax_amount: itemTax,
                };
            });

            const totalAmount = subtotal + totalTax;

            // Delete old items, create new items, update order (sequential)
            await this.prisma.order_items.deleteMany({ where: { order_id: id } });
            await this.prisma.order_items.createMany({ data: orderItemsData });
            await this.prisma.orders.update({
                where: { id },
                data: {
                    pangkalan_id: orderData.pangkalan_id,
                    driver_id: orderData.driver_id,
                    note: orderData.note,
                    subtotal: subtotal,
                    tax_amount: totalTax,
                    total_amount: totalAmount,
                    updated_at: new Date(),
                },
            });
        } else {
            // No items update, just update basic fields
            await this.prisma.orders.update({
                where: { id },
                data: {
                    pangkalan_id: orderData.pangkalan_id,
                    driver_id: orderData.driver_id,
                    note: orderData.note,
                    current_status: orderData.current_status,
                    updated_at: new Date(),
                },
            });
        }

        // Return updated order with all relations
        return this.findOne(id);
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.findOne(id);

        // Validate status transition
        this.validateStatusTransition(order.current_status, dto.status);

        const updated = await this.prisma.orders.update({
            where: { id },
            data: {
                current_status: dto.status,
                updated_at: new Date(),
                timeline_tracks: {
                    create: {
                        status: dto.status,
                        description: dto.description,
                        note: dto.note,
                    },
                },
            },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });

        // STOCK RESTORATION: Kembalikan stok jika order dibatalkan
        if (dto.status === 'BATAL') {
            // Lookup original stock_histories untuk order ini dan gunakan lpg_product_id yang sama
            const orderNote = `Order ${updated.code}`;

            for (const item of updated.order_items) {
                // Find original KELUAR record to get lpg_product_id
                const originalStock = await this.prisma.stock_histories.findFirst({
                    where: {
                        note: { contains: orderNote },
                        lpg_type: item.lpg_type,
                        movement_type: 'KELUAR'
                    }
                });

                await this.prisma.stock_histories.create({
                    data: {
                        lpg_type: item.lpg_type,
                        lpg_product_id: originalStock?.lpg_product_id || null,  // Copy from original
                        movement_type: 'MASUK',  // MASUK = stock kembali
                        qty: item.qty,
                        note: `Batal Order ${updated.code} - ${item.label || item.lpg_type}`,
                    },
                });
            }
        }

        // PANGKALAN STOCK SYNC: Tambah stok pangkalan saat order selesai
        // Best practice: otomatis update inventory pangkalan ketika pesanan dari agen sudah SELESAI
        if (dto.status === 'SELESAI') {
            // Sum total qty for penyaluran
            const totalQtyForPenyaluran = updated.order_items.reduce(
                (sum, item) => sum + (item.lpg_type === 'kg3' ? item.qty : 0),
                0
            );

            for (const item of updated.order_items) {
                // Upsert pangkalan_stocks (buat jika belum ada, update jika sudah)
                await this.prisma.pangkalan_stocks.upsert({
                    where: {
                        pangkalan_id_lpg_type: {
                            pangkalan_id: updated.pangkalan_id,
                            lpg_type: item.lpg_type,
                        }
                    },
                    create: {
                        pangkalan_id: updated.pangkalan_id,
                        lpg_type: item.lpg_type,
                        qty: item.qty,
                    },
                    update: {
                        qty: { increment: item.qty },
                        updated_at: new Date(),
                    },
                });

                // Catat riwayat pergerakan stok pangkalan
                await this.prisma.pangkalan_stock_movements.create({
                    data: {
                        pangkalan_id: updated.pangkalan_id,
                        lpg_type: item.lpg_type,
                        movement_type: 'IN',
                        qty: item.qty,
                        source: 'ORDER',
                        reference_id: updated.id,
                        note: `Stok masuk dari Order ${updated.code} - ${item.label || item.lpg_type}`,
                    },
                });
            }

            // PERTAMINA SYNC: Update penyaluran_harian for each lpg_type
            // Penyaluran = distribusi dari agen ke pangkalan - now supports ALL lpg types
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const item of updated.order_items) {
                await this.prisma.penyaluran_harian.upsert({
                    where: {
                        pangkalan_id_tanggal_lpg_type: {
                            pangkalan_id: updated.pangkalan_id,
                            tanggal: today,
                            lpg_type: item.lpg_type,
                        }
                    },
                    create: {
                        pangkalan_id: updated.pangkalan_id,
                        tanggal: today,
                        lpg_type: item.lpg_type,
                        jumlah: item.qty,
                        kondisi: 'NORMAL',
                        tipe_pembayaran: 'CASHLESS',
                    },
                    update: {
                        jumlah: { increment: item.qty },
                        updated_at: new Date(),
                    },
                });
            }
        }

        // ACTIVITY LOG: Catat perubahan status
        const pangkalanName = updated.pangkalans?.name || 'Unknown';
        const totalQty = updated.order_items.reduce((sum, item) => sum + item.qty, 0);

        let activityType = 'order_status_updated';
        let activityTitle = 'Status Pesanan Diperbarui';
        let activityIcon = 'RefreshCw';

        if (dto.status === 'SELESAI') {
            activityType = 'order_completed';
            activityTitle = 'Pesanan Selesai';
            activityIcon = 'CheckCircle';
        } else if (dto.status === 'BATAL') {
            activityType = 'order_cancelled';
            activityTitle = 'Pesanan Dibatalkan';
            activityIcon = 'XCircle';
        } else if (dto.status === 'DIKIRIM') {
            activityType = 'order_delivered';
            activityTitle = 'Pesanan Dikirim';
            activityIcon = 'Truck';
        }

        await this.activityService.create({
            type: activityType,
            title: activityTitle,
            description: `${pangkalanName} - ${totalQty} tabung (${updated.code})`,
            order_id: updated.id,
            pangkalan_name: pangkalanName,
            detail_numeric: totalQty,
            icon_name: activityIcon,
            order_status: dto.status,
        });

        return updated;
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.orders.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        return { message: 'Order berhasil dihapus' };
    }

    private validateStatusTransition(
        currentStatus: status_pesanan,
        newStatus: status_pesanan,
    ) {
        const validTransitions: Record<status_pesanan, status_pesanan[]> = {
            DRAFT: ['MENUNGGU_PEMBAYARAN', 'BATAL'],
            MENUNGGU_PEMBAYARAN: ['DIPROSES', 'BATAL'],
            DIPROSES: ['SIAP_KIRIM', 'DIKIRIM', 'BATAL'],
            SIAP_KIRIM: ['DIKIRIM', 'BATAL'],
            DIKIRIM: ['SELESAI', 'BATAL'],
            SELESAI: [],
            BATAL: [],
        };

        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new BadRequestException(
                `Tidak dapat mengubah status dari ${currentStatus} ke ${newStatus}`,
            );
        }
    }

    /**
     * Get order statistics by status
     * @param todayOnly - If true, only count today's orders
     */
    async getStats(todayOnly: boolean = false) {
        const where: any = { deleted_at: null };

        // If todayOnly, filter by created_at >= start of today
        if (todayOnly) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            where.created_at = { gte: today };
        }

        // Count by each status
        const [
            total,
            menungguPembayaran,
            diproses,
            siapKirim,
            dikirim,
            selesai,
            batal,
        ] = await Promise.all([
            this.prisma.orders.count({ where }),
            this.prisma.orders.count({ where: { ...where, current_status: 'MENUNGGU_PEMBAYARAN' } }),
            this.prisma.orders.count({ where: { ...where, current_status: 'DIPROSES' } }),
            this.prisma.orders.count({ where: { ...where, current_status: 'SIAP_KIRIM' } }),
            this.prisma.orders.count({ where: { ...where, current_status: 'DIKIRIM' } }),
            this.prisma.orders.count({ where: { ...where, current_status: 'SELESAI' } }),
            this.prisma.orders.count({ where: { ...where, current_status: 'BATAL' } }),
        ]);

        return {
            total,
            menunggu_pembayaran: menungguPembayaran,
            diproses,
            siap_kirim: siapKirim,
            dikirim,
            selesai,
            batal,
            today_only: todayOnly,
        };
    }
}

