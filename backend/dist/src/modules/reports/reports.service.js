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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesReport(startDate, endDate) {
        const orders = await this.prisma.orders.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
                deleted_at: null,
            },
            include: {
                pangkalans: {
                    select: { name: true, code: true },
                },
                order_items: {
                    include: {},
                },
            },
            orderBy: { created_at: 'desc' },
        });
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const statusCounts = orders.reduce((acc, o) => {
            acc[o.current_status] = (acc[o.current_status] || 0) + 1;
            return acc;
        }, {});
        const data = orders.map(order => ({
            id: order.id,
            date: order.created_at,
            code: order.code,
            pangkalan: order.pangkalans?.name || '-',
            pangkalan_code: order.pangkalans?.code || '-',
            subtotal: Number(order.subtotal),
            tax: Number(order.tax_amount),
            total: Number(order.total_amount),
            status: order.current_status,
            items: order.order_items.map(item => ({
                type: item.lpg_type,
                label: item.label,
                qty: item.qty,
                price: Number(item.price_per_unit),
                subtotal: Number(item.sub_total),
            })),
        }));
        return {
            summary: {
                total_orders: totalOrders,
                total_revenue: totalRevenue,
                average_order: averageOrder,
                status_breakdown: statusCounts,
            },
            data,
            period: {
                start: startDate,
                end: endDate,
            },
        };
    }
    async getPaymentsReport(startDate, endDate) {
        const payments = await this.prisma.payment_records.findMany({
            where: {
                payment_time: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                orders: {
                    select: {
                        code: true,
                        pangkalans: {
                            select: { name: true, code: true },
                        },
                    },
                },
                invoices: {
                    select: { invoice_number: true },
                },
                users: {
                    select: { name: true },
                },
            },
            orderBy: { payment_time: 'desc' },
        });
        const totalPayments = payments.length;
        const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const methodBreakdown = payments.reduce((acc, p) => {
            const method = p.method || 'UNKNOWN';
            if (!acc[method])
                acc[method] = { count: 0, amount: 0 };
            acc[method].count++;
            acc[method].amount += Number(p.amount);
            return acc;
        }, {});
        const data = payments.map(payment => ({
            id: payment.id,
            date: payment.payment_time,
            invoice_number: payment.invoices?.invoice_number || '-',
            order_code: payment.orders?.code || '-',
            pangkalan: payment.orders?.pangkalans?.name || '-',
            amount: Number(payment.amount),
            method: payment.method,
            note: payment.note,
            recorded_by: payment.users?.name || '-',
        }));
        return {
            summary: {
                total_payments: totalPayments,
                total_amount: totalAmount,
                average_payment: totalPayments > 0 ? totalAmount / totalPayments : 0,
                method_breakdown: methodBreakdown,
            },
            data,
            period: {
                start: startDate,
                end: endDate,
            },
        };
    }
    async getStockMovementReport(startDate, endDate, productId) {
        const where = {
            created_at: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (productId) {
            where.lpg_product_id = productId;
        }
        const movements = await this.prisma.stock_histories.findMany({
            where,
            include: {
                users: {
                    select: { name: true },
                },
                lpg_product: {
                    select: { name: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        const allMovements = await this.prisma.stock_histories.groupBy({
            by: ['movement_type'],
            where: productId ? { lpg_product_id: productId } : {},
            _sum: { qty: true },
        });
        let totalIn = 0;
        let totalOut = 0;
        for (const m of allMovements) {
            if (m.movement_type === 'MASUK') {
                totalIn = m._sum.qty || 0;
            }
            else {
                totalOut = m._sum.qty || 0;
            }
        }
        const periodMovements = movements.reduce((acc, m) => {
            if (m.movement_type === 'MASUK') {
                acc.in += m.qty;
            }
            else {
                acc.out += m.qty;
            }
            return acc;
        }, { in: 0, out: 0 });
        const data = movements.map(movement => ({
            id: movement.id,
            date: movement.created_at,
            product: movement.lpg_product?.name || movement.lpg_type || '-',
            type: movement.movement_type,
            qty: movement.qty,
            note: movement.note,
            recorded_by: movement.users?.name || '-',
        }));
        return {
            summary: {
                total_in: periodMovements.in,
                total_out: periodMovements.out,
                net_change: periodMovements.in - periodMovements.out,
                current_balance: totalIn - totalOut,
                movement_count: movements.length,
            },
            data,
            period: {
                start: startDate,
                end: endDate,
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map