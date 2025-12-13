import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto';
import { status_pesanan, lpg_type } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

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

        return order;
    }

    async update(id: string, dto: UpdateOrderDto) {
        await this.findOne(id);

        const order = await this.prisma.orders.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
            include: {
                pangkalans: {
                    select: { id: true, code: true, name: true, region: true, address: true, phone: true },
                },
                drivers: {
                    select: { id: true, code: true, name: true, phone: true },
                },
                order_items: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });

        return order;
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
            DIPROSES: ['SIAP_KIRIM', 'BATAL'],
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
}
