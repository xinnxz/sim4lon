"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
const activity_service_1 = require("../activity/activity.service");
let OrderService = class OrderService {
    prisma;
    activityService;
    constructor(prisma, activityService) {
        this.prisma = prisma;
        this.activityService = activityService;
    }
    async findAll(page = 1, limit = 10, status, pangkalanId, driverId, sortBy = 'created_at', sortOrder = 'desc') {
        const skip = (page - 1) * limit;
        const where = { deleted_at: null };
        if (status)
            where.current_status = status;
        if (pangkalanId)
            where.pangkalan_id = pangkalanId;
        if (driverId)
            where.driver_id = driverId;
        let orderBy;
        if (sortBy === 'pangkalan_name') {
            orderBy = { pangkalans: { name: sortOrder } };
        }
        else {
            orderBy = { [sortBy]: sortOrder };
        }
        const [orders, total] = await Promise.all([
            this.prisma.orders.findMany({
                where,
                skip,
                take: limit,
                orderBy,
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Order tidak ditemukan');
        }
        return order;
    }
    async create(dto) {
        if (!dto.items || dto.items.length === 0) {
            throw new common_1.BadRequestException('Silakan tambahkan minimal satu item LPG');
        }
        const total3kgOrdered = dto.items
            .filter(item => {
            const normalized = item.lpg_type.toLowerCase().trim();
            return normalized === '3kg' || normalized === 'kg3' || normalized === '3';
        })
            .reduce((sum, item) => sum + item.qty, 0);
        if (total3kgOrdered > 0) {
            const pangkalan = await this.prisma.pangkalans.findUnique({
                where: { id: dto.pangkalan_id },
                select: {
                    id: true,
                    name: true,
                    alokasi_bulanan: true,
                    is_active: true,
                },
            });
            if (!pangkalan) {
                throw new common_1.BadRequestException('Pangkalan tidak ditemukan');
            }
            if (!pangkalan.is_active) {
                throw new common_1.BadRequestException('Pangkalan tidak aktif. Tidak dapat membuat pesanan.');
            }
            const now = new Date();
            const wibOffset = 7 * 60;
            const wibTime = new Date(now.getTime() + (wibOffset * 60 * 1000));
            const monthStart = new Date(Date.UTC(wibTime.getUTCFullYear(), wibTime.getUTCMonth(), 1, 0, 0, 0, 0));
            const monthEnd = new Date(Date.UTC(wibTime.getUTCFullYear(), wibTime.getUTCMonth() + 1, 0, 23, 59, 59, 999));
            const ordersThisMonth = await this.prisma.order_items.aggregate({
                where: {
                    lpg_type: 'kg3',
                    orders: {
                        pangkalan_id: dto.pangkalan_id,
                        created_at: { gte: monthStart, lte: monthEnd },
                        current_status: { not: 'BATAL' },
                        deleted_at: null,
                    },
                },
                _sum: { qty: true },
            });
            const penyaluranThisMonth = await this.prisma.penyaluran_harian.aggregate({
                where: {
                    pangkalan_id: dto.pangkalan_id,
                    lpg_type: 'kg3',
                    tanggal: { gte: monthStart, lte: monthEnd },
                },
                _sum: {
                    jumlah_normal: true,
                    jumlah_fakultatif: true,
                },
            });
            const totalOrderedThisMonth = ordersThisMonth._sum.qty || 0;
            const totalPenyaluran = (penyaluranThisMonth._sum.jumlah_normal || 0) +
                (penyaluranThisMonth._sum.jumlah_fakultatif || 0);
            const currentUsed = Math.max(totalOrderedThisMonth, totalPenyaluran);
            const remainingAllocation = pangkalan.alokasi_bulanan - currentUsed;
            if (total3kgOrdered > remainingAllocation) {
                throw new common_1.BadRequestException(`Melebihi alokasi bulanan! ` +
                    `Alokasi: ${pangkalan.alokasi_bulanan} tabung, ` +
                    `Sudah terpakai: ${currentUsed} tabung, ` +
                    `Sisa: ${remainingAllocation} tabung, ` +
                    `Diminta: ${total3kgOrdered} tabung.`);
            }
        }
        const mapStringToLpgType = (strType) => {
            const normalized = strType.toLowerCase().trim();
            const mapping = {
                'gr220': 'gr220',
                '220gr': 'gr220',
                '0.22kg': 'gr220',
                '0.22': 'gr220',
                '3kg': 'kg3',
                'kg3': 'kg3',
                '3': 'kg3',
                '3.0': 'kg3',
                'kg5': 'kg5',
                '5.5kg': 'kg5',
                '5.5': 'kg5',
                '5kg': 'kg5',
                '5': 'kg5',
                '12kg': 'kg12',
                'kg12': 'kg12',
                '12': 'kg12',
                '12.0': 'kg12',
                '50kg': 'kg50',
                'kg50': 'kg50',
                '50': 'kg50',
                '50.0': 'kg50',
            };
            const result = mapping[normalized];
            if (result) {
                return result;
            }
            const numberMatch = normalized.match(/(\d+(?:\.\d+)?)/);
            if (numberMatch) {
                const size = parseFloat(numberMatch[1]);
                if (size < 1)
                    return 'gr220';
                if (size <= 4)
                    return 'kg3';
                if (size <= 8)
                    return 'kg5';
                if (size <= 30)
                    return 'kg12';
                return 'kg50';
            }
            return 'kg3';
        };
        for (const item of dto.items) {
            if (item.lpg_product_id) {
                const product = await this.prisma.lpg_products.findUnique({
                    where: { id: item.lpg_product_id },
                    select: { name: true }
                });
                const stockIn = await this.prisma.stock_histories.aggregate({
                    where: { lpg_product_id: item.lpg_product_id, movement_type: 'MASUK' },
                    _sum: { qty: true }
                });
                const stockOut = await this.prisma.stock_histories.aggregate({
                    where: { lpg_product_id: item.lpg_product_id, movement_type: 'KELUAR' },
                    _sum: { qty: true }
                });
                const currentStock = (stockIn._sum.qty || 0) - (stockOut._sum.qty || 0);
                if (product && item.qty > currentStock) {
                    throw new common_1.BadRequestException(`Stok ${product.name} tidak mencukupi! Tersedia: ${currentStock}, Diminta: ${item.qty}`);
                }
            }
        }
        const orderCount = await this.prisma.orders.count();
        const orderCode = `ORD-${String(orderCount + 1).padStart(4, '0')}`;
        const PPN_RATE = 0.12;
        let subtotal = 0;
        let totalTax = 0;
        const orderItemsData = dto.items.map((item) => {
            const itemSubtotal = item.price_per_unit * item.qty;
            const isTaxable = item.is_taxable ?? false;
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
        for (let i = 0; i < dto.items.length; i++) {
            const dtoItem = dto.items[i];
            const orderItem = order.order_items[i];
            await this.prisma.stock_histories.create({
                data: {
                    lpg_type: orderItem.lpg_type,
                    lpg_product_id: dtoItem.lpg_product_id || null,
                    movement_type: 'KELUAR',
                    qty: orderItem.qty,
                    note: `Order ${order.code} - ${orderItem.label || orderItem.lpg_type}`,
                },
            });
        }
        const totalQty = order.order_items.reduce((sum, item) => sum + item.qty, 0);
        const pangkalanName = order.pangkalans?.name || 'Unknown';
        const productBreakdown = order.order_items.map(item => `${item.label || item.lpg_type} (${item.qty})`).join(', ');
        await this.activityService.create({
            type: 'order_created',
            title: 'Pesanan Baru Dibuat',
            description: `${pangkalanName} - ${productBreakdown} - Rp ${totalAmount.toLocaleString('id-ID')}`,
            order_id: order.id,
            pangkalan_name: pangkalanName,
            detail_numeric: totalQty,
            icon_name: 'ShoppingCart',
            order_status: 'DRAFT',
        });
        return order;
    }
    async update(id, dto) {
        const existingOrder = await this.findOne(id);
        const { items, ...orderData } = dto;
        if (items && items.length > 0) {
            const PPN_RATE = 0.12;
            let subtotal = 0;
            let totalTax = 0;
            const mapStringToLpgType = (strType) => {
                const normalized = strType.toLowerCase().trim();
                const mapping = {
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
        }
        else {
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
        return this.findOne(id);
    }
    async updateStatus(id, dto) {
        const order = await this.findOne(id);
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
        if (dto.status === 'DIPROSES' && dto.payment_method) {
            await this.prisma.order_payment_details.upsert({
                where: { order_id: id },
                create: {
                    order_id: id,
                    is_paid: true,
                    is_dp: false,
                    payment_method: dto.payment_method,
                    amount_paid: updated.total_amount,
                    payment_date: new Date(),
                },
                update: {
                    is_paid: true,
                    payment_method: dto.payment_method,
                    amount_paid: updated.total_amount,
                    payment_date: new Date(),
                    updated_at: new Date(),
                },
            });
        }
        if (dto.status === 'BATAL') {
            const orderNote = `Order ${updated.code}`;
            for (const item of updated.order_items) {
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
                        lpg_product_id: originalStock?.lpg_product_id || null,
                        movement_type: 'MASUK',
                        qty: item.qty,
                        note: `Batal Order ${updated.code} - ${item.label || item.lpg_type}`,
                    },
                });
            }
            await this.prisma.order_payment_details.updateMany({
                where: { order_id: id, is_paid: true },
                data: {
                    is_paid: false,
                    updated_at: new Date(),
                },
            });
        }
        if (dto.status === 'SELESAI') {
            const totalQtyForPenyaluran = updated.order_items.reduce((sum, item) => sum + (item.lpg_type === 'kg3' ? item.qty : 0), 0);
            const stockUpserts = updated.order_items.map(item => this.prisma.pangkalan_stocks.upsert({
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
            }));
            const stockMovements = updated.order_items.map(item => this.prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: updated.pangkalan_id,
                    lpg_type: item.lpg_type,
                    movement_type: 'IN',
                    qty: item.qty,
                    source: 'ORDER',
                    reference_id: updated.id,
                    note: `Stok masuk dari Order ${updated.code} - ${item.label || item.lpg_type}`,
                },
            }));
            await Promise.all([...stockUpserts, ...stockMovements]);
            const now = new Date();
            const wibOffset = 7 * 60;
            const wibTime = new Date(now.getTime() + (wibOffset * 60 * 1000));
            const wibDateOnly = new Date(Date.UTC(wibTime.getUTCFullYear(), wibTime.getUTCMonth(), wibTime.getUTCDate(), 0, 0, 0, 0));
            for (const item of updated.order_items) {
                try {
                    const existing = await this.prisma.penyaluran_harian.findFirst({
                        where: {
                            pangkalan_id: updated.pangkalan_id,
                            tanggal: wibDateOnly,
                            lpg_type: item.lpg_type,
                        }
                    });
                    if (existing) {
                        await this.prisma.penyaluran_harian.update({
                            where: { id: existing.id },
                            data: {
                                jumlah_normal: existing.jumlah_normal + item.qty,
                                updated_at: new Date(),
                            },
                        });
                    }
                    else {
                        await this.prisma.penyaluran_harian.create({
                            data: {
                                pangkalan_id: updated.pangkalan_id,
                                tanggal: wibDateOnly,
                                lpg_type: item.lpg_type,
                                jumlah_normal: item.qty,
                                jumlah_fakultatif: 0,
                                tipe_pembayaran: 'CASHLESS',
                            },
                        });
                    }
                }
                catch (err) {
                }
            }
        }
        if (dto.status !== 'SELESAI' && dto.status !== 'BATAL') {
            return updated;
        }
        const pangkalanName = updated.pangkalans?.name || 'Unknown';
        const totalQty = updated.order_items.reduce((sum, item) => sum + item.qty, 0);
        const totalAmount = Number(updated.total_amount) || 0;
        const productBreakdown = updated.order_items.map(item => `${item.label || item.lpg_type} (${item.qty})`).join(', ');
        let activityType = 'order_completed';
        let activityTitle = 'Pesanan Selesai';
        let activityIcon = 'CheckCircle';
        if (dto.status === 'BATAL') {
            activityType = 'order_cancelled';
            activityTitle = 'Pesanan Dibatalkan';
            activityIcon = 'XCircle';
        }
        await this.activityService.create({
            type: activityType,
            title: activityTitle,
            description: `${pangkalanName} - ${productBreakdown} - Rp ${totalAmount.toLocaleString('id-ID')}`,
            order_id: updated.id,
            pangkalan_name: pangkalanName,
            detail_numeric: totalQty,
            icon_name: activityIcon,
            order_status: dto.status,
        });
        if (dto.status === 'SELESAI') {
            await this.activityService.create({
                type: 'stock_out',
                title: 'Stok Keluar',
                description: `Pengiriman ke ${pangkalanName} - ${productBreakdown}`,
                order_id: updated.id,
                pangkalan_name: pangkalanName,
                detail_numeric: totalQty,
                icon_name: 'PackageMinus',
            });
        }
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.orders.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return { message: 'Order berhasil dihapus' };
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            DRAFT: ['MENUNGGU_PEMBAYARAN', 'BATAL'],
            MENUNGGU_PEMBAYARAN: ['DIPROSES', 'BATAL'],
            DIPROSES: ['SIAP_KIRIM', 'DIKIRIM', 'BATAL'],
            SIAP_KIRIM: ['DIKIRIM', 'BATAL'],
            DIKIRIM: ['SELESAI', 'BATAL'],
            SELESAI: [],
            BATAL: [],
        };
        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new common_1.BadRequestException(`Tidak dapat mengubah status dari ${currentStatus} ke ${newStatus}`);
        }
    }
    async getStats(todayOnly = false) {
        const where = { deleted_at: null };
        if (todayOnly) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            where.created_at = { gte: today };
        }
        const [total, menungguPembayaran, diproses, siapKirim, dikirim, selesai, batal,] = await Promise.all([
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        activity_service_1.ActivityService])
], OrderService);
//# sourceMappingURL=order.service.js.map