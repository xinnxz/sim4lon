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
exports.ConsumerOrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConsumerOrderService = class ConsumerOrderService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(pangkalanId, page = 1, limit = 10, options) {
        const skip = (page - 1) * limit;
        const where = {
            pangkalan_id: pangkalanId,
        };
        if (options?.startDate || options?.endDate) {
            where.sale_date = {};
            if (options.startDate) {
                where.sale_date.gte = new Date(options.startDate);
            }
            if (options.endDate) {
                where.sale_date.lte = new Date(options.endDate);
            }
        }
        if (options?.paymentStatus) {
            where.payment_status = options.paymentStatus;
        }
        if (options?.consumerId) {
            where.consumer_id = options.consumerId;
        }
        const [orders, total] = await Promise.all([
            this.prisma.consumer_orders.findMany({
                where,
                skip,
                take: limit,
                orderBy: { sale_date: 'desc' },
                include: {
                    consumers: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                        },
                    },
                },
            }),
            this.prisma.consumer_orders.count({ where }),
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
    async findOne(id, pangkalanId) {
        const order = await this.prisma.consumer_orders.findFirst({
            where: { id },
            include: {
                consumers: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (order.pangkalan_id !== pangkalanId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke data ini');
        }
        return order;
    }
    async create(pangkalanId, dto) {
        if (!dto.consumer_id && !dto.consumer_name) {
            throw new common_1.BadRequestException('Harus mengisi consumer_id atau consumer_name');
        }
        if (dto.consumer_id) {
            const consumer = await this.prisma.consumers.findFirst({
                where: { id: dto.consumer_id, pangkalan_id: pangkalanId },
            });
            if (!consumer) {
                throw new common_1.NotFoundException('Pelanggan tidak ditemukan');
            }
        }
        const orderCount = await this.prisma.consumer_orders.count({
            where: { pangkalan_id: pangkalanId },
        });
        const orderCode = `PORD-${String(orderCount + 1).padStart(4, '0')}`;
        const totalAmount = dto.qty * dto.price_per_unit;
        const order = await this.prisma.consumer_orders.create({
            data: {
                code: orderCode,
                pangkalan_id: pangkalanId,
                consumer_id: dto.consumer_id,
                consumer_name: dto.consumer_name,
                lpg_type: dto.lpg_type,
                qty: dto.qty,
                price_per_unit: dto.price_per_unit,
                total_amount: totalAmount,
                payment_status: dto.payment_status || 'LUNAS',
                note: dto.note,
            },
            include: {
                consumers: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        });
        return order;
    }
    async update(id, pangkalanId, dto) {
        await this.findOne(id, pangkalanId);
        if (dto.consumer_id) {
            const consumer = await this.prisma.consumers.findFirst({
                where: { id: dto.consumer_id, pangkalan_id: pangkalanId },
            });
            if (!consumer) {
                throw new common_1.NotFoundException('Pelanggan tidak ditemukan');
            }
        }
        const existing = await this.prisma.consumer_orders.findUnique({
            where: { id },
        });
        const qty = dto.qty ?? existing.qty;
        const pricePerUnit = dto.price_per_unit ?? Number(existing.price_per_unit);
        const totalAmount = qty * pricePerUnit;
        const order = await this.prisma.consumer_orders.update({
            where: { id },
            data: {
                consumer_id: dto.consumer_id,
                consumer_name: dto.consumer_name,
                qty: dto.qty,
                price_per_unit: dto.price_per_unit,
                total_amount: totalAmount,
                payment_status: dto.payment_status,
                note: dto.note,
                updated_at: new Date(),
            },
            include: {
                consumers: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        });
        return order;
    }
    async remove(id, pangkalanId) {
        await this.findOne(id, pangkalanId);
        await this.prisma.consumer_orders.delete({
            where: { id },
        });
        return { message: 'Pesanan berhasil dihapus' };
    }
    async getStats(pangkalanId, todayOnly = false) {
        const dateFilter = {};
        if (todayOnly) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateFilter.sale_date = {
                gte: today,
                lt: tomorrow,
            };
        }
        const [totalOrders, totalQty, totalRevenue, unpaidCount, unpaidTotal] = await Promise.all([
            this.prisma.consumer_orders.count({
                where: { pangkalan_id: pangkalanId, ...dateFilter },
            }),
            this.prisma.consumer_orders.aggregate({
                where: { pangkalan_id: pangkalanId, ...dateFilter },
                _sum: { qty: true },
            }),
            this.prisma.consumer_orders.aggregate({
                where: { pangkalan_id: pangkalanId, ...dateFilter },
                _sum: { total_amount: true },
            }),
            this.prisma.consumer_orders.count({
                where: { pangkalan_id: pangkalanId, payment_status: 'HUTANG' },
            }),
            this.prisma.consumer_orders.aggregate({
                where: { pangkalan_id: pangkalanId, payment_status: 'HUTANG' },
                _sum: { total_amount: true },
            }),
        ]);
        return {
            total_orders: totalOrders,
            total_qty: totalQty._sum.qty || 0,
            total_revenue: Number(totalRevenue._sum.total_amount || 0),
            unpaid_count: unpaidCount,
            unpaid_total: Number(unpaidTotal._sum.total_amount || 0),
        };
    }
    async getRecentSales(pangkalanId, limit = 5) {
        const orders = await this.prisma.consumer_orders.findMany({
            where: { pangkalan_id: pangkalanId },
            take: limit,
            orderBy: { sale_date: 'desc' },
            include: {
                consumers: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return orders;
    }
};
exports.ConsumerOrderService = ConsumerOrderService;
exports.ConsumerOrderService = ConsumerOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsumerOrderService);
//# sourceMappingURL=consumer-order.service.js.map