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
var ConsumerOrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerOrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConsumerOrderService = ConsumerOrderService_1 = class ConsumerOrderService {
    prisma;
    logger = new common_1.Logger(ConsumerOrderService_1.name);
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
        this.logger.log(`[CREATE] Starting - pangkalanId: ${pangkalanId}`);
        this.logger.log(`[CREATE] DTO received: ${JSON.stringify(dto)}`);
        try {
            if (!dto.consumer_id && !dto.consumer_name) {
                this.logger.warn('[CREATE] Validation failed - no consumer_id or consumer_name');
                throw new common_1.BadRequestException('Harus mengisi consumer_id atau consumer_name');
            }
            if (dto.consumer_id) {
                this.logger.log(`[CREATE] Verifying consumer_id: ${dto.consumer_id}`);
                const consumer = await this.prisma.consumers.findFirst({
                    where: { id: dto.consumer_id, pangkalan_id: pangkalanId },
                });
                if (!consumer) {
                    this.logger.warn('[CREATE] Consumer not found or not owned');
                    throw new common_1.NotFoundException('Pelanggan tidak ditemukan');
                }
                this.logger.log(`[CREATE] Consumer verified: ${consumer.name}`);
            }
            const now = new Date();
            const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
            const timePart = now.toISOString().slice(11, 16).replace(/:/g, '');
            const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const orderCode = `PORD-${datePart}-${timePart}-${randomPart}`;
            this.logger.log(`[CREATE] Generated order code: ${orderCode}`);
            const totalAmount = dto.qty * dto.price_per_unit;
            this.logger.log(`[CREATE] Total amount: ${totalAmount}`);
            const COST_PRICES = {
                'kg3': 16000, 'kg5': 52000, 'kg12': 142000, 'kg50': 590000,
                '3kg': 16000, '5kg': 52000, '12kg': 142000, '50kg': 590000,
            };
            const costPrice = COST_PRICES[dto.lpg_type] || 16000;
            const createData = {
                code: orderCode,
                pangkalan_id: pangkalanId,
                consumer_id: dto.consumer_id || null,
                consumer_name: dto.consumer_name || null,
                lpg_type: dto.lpg_type,
                qty: dto.qty,
                price_per_unit: dto.price_per_unit,
                cost_price: costPrice,
                total_amount: totalAmount,
                payment_status: dto.payment_status || 'LUNAS',
                note: dto.note || null,
            };
            this.logger.log(`[CREATE] Prisma create data: ${JSON.stringify(createData)}`);
            const order = await this.prisma.consumer_orders.create({
                data: createData,
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
            this.logger.log(`[CREATE] Order created - ID: ${order.id}`);
            try {
                const existingStock = await this.prisma.pangkalan_stocks.findFirst({
                    where: {
                        pangkalan_id: pangkalanId,
                        lpg_type: dto.lpg_type,
                    },
                });
                if (existingStock) {
                    const newQty = existingStock.qty - dto.qty;
                    await this.prisma.pangkalan_stocks.update({
                        where: { id: existingStock.id },
                        data: {
                            qty: newQty < 0 ? 0 : newQty,
                            updated_at: new Date(),
                        },
                    });
                    this.logger.log(`[CREATE] Stock deducted: ${existingStock.qty} -> ${newQty} for ${dto.lpg_type}`);
                }
                else {
                    this.logger.warn(`[CREATE] No stock record found for ${dto.lpg_type} - skipping deduction`);
                }
                await this.prisma.pangkalan_stock_movements.create({
                    data: {
                        pangkalan_id: pangkalanId,
                        lpg_type: dto.lpg_type,
                        movement_type: 'OUT',
                        qty: dto.qty,
                        source: 'SALE',
                        reference_id: order.id,
                        note: `Penjualan ${orderCode} - ${dto.consumer_name || 'Walk-in'}`,
                    },
                });
                this.logger.log(`[CREATE] Stock movement recorded`);
            }
            catch (stockError) {
                this.logger.error(`[CREATE] Stock deduction error: ${stockError.message}`);
            }
            this.logger.log(`[CREATE] Success - order ID: ${order.id}`);
            return order;
        }
        catch (error) {
            this.logger.error(`[CREATE] Error: ${error.message}`);
            this.logger.error(`[CREATE] Stack: ${error.stack}`);
            throw error;
        }
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
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateFilter.sale_date = {
                gte: today,
                lt: tomorrow,
            };
        }
        const COST_PRICES = {
            'kg3': 16000,
            'kg5': 52000,
            'kg12': 142000,
            'kg50': 590000,
        };
        const orders = await this.prisma.consumer_orders.findMany({
            where: { pangkalan_id: pangkalanId, ...dateFilter },
            select: {
                qty: true,
                lpg_type: true,
                price_per_unit: true,
                total_amount: true,
            },
        });
        let totalQty = 0;
        let totalRevenue = 0;
        let totalModal = 0;
        for (const order of orders) {
            totalQty += order.qty;
            totalRevenue += Number(order.total_amount);
            const costPrice = COST_PRICES[order.lpg_type] || 16000;
            totalModal += order.qty * costPrice;
        }
        const marginKotor = totalRevenue - totalModal;
        const expenseFilter = { pangkalan_id: pangkalanId };
        if (todayOnly) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            expenseFilter.expense_date = {
                gte: today,
                lt: tomorrow,
            };
        }
        const expenseSum = await this.prisma.expenses.aggregate({
            where: expenseFilter,
            _sum: { amount: true },
        });
        const totalPengeluaran = Number(expenseSum._sum.amount || 0);
        const labaBersih = marginKotor - totalPengeluaran;
        return {
            total_orders: orders.length,
            total_qty: totalQty,
            total_revenue: totalRevenue,
            total_modal: totalModal,
            margin_kotor: marginKotor,
            total_pengeluaran: totalPengeluaran,
            laba_bersih: labaBersih,
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
    async getChartData(pangkalanId) {
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const orders = await this.prisma.consumer_orders.findMany({
                where: {
                    pangkalan_id: pangkalanId,
                    sale_date: {
                        gte: date,
                        lt: nextDay,
                    },
                },
                select: {
                    qty: true,
                    lpg_type: true,
                    total_amount: true,
                },
            });
            const COST_PRICES = {
                'kg3': 16000,
                'kg5': 52000,
                'kg12': 142000,
                'kg50': 590000,
            };
            let penjualan = 0;
            let modal = 0;
            for (const order of orders) {
                penjualan += Number(order.total_amount);
                const costPrice = COST_PRICES[order.lpg_type] || 16000;
                modal += order.qty * costPrice;
            }
            const expenseSum = await this.prisma.expenses.aggregate({
                where: {
                    pangkalan_id: pangkalanId,
                    expense_date: {
                        gte: date,
                        lt: nextDay,
                    },
                },
                _sum: { amount: true },
            });
            const pengeluaran = Number(expenseSum._sum.amount || 0);
            const marginKotor = penjualan - modal;
            const laba = marginKotor - pengeluaran;
            result.push({
                day: dayNames[date.getDay()],
                date: date.toISOString().split('T')[0],
                penjualan,
                modal,
                pengeluaran,
                laba,
            });
        }
        return result;
    }
};
exports.ConsumerOrderService = ConsumerOrderService;
exports.ConsumerOrderService = ConsumerOrderService = ConsumerOrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsumerOrderService);
//# sourceMappingURL=consumer-order.service.js.map