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
    async getPangkalanReport(startDate, endDate) {
        const pangkalans = await this.prisma.pangkalans.findMany({
            where: {
                is_active: true,
                deleted_at: null,
            },
            include: {
                orders: {
                    where: {
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                        current_status: 'SELESAI',
                        deleted_at: null,
                    },
                    include: {
                        order_items: true,
                    },
                },
                consumer_orders: {
                    where: {
                        sale_date: {
                            gte: startDate,
                            lte: endDate,
                        },
                        lpg_type: 'kg3',
                    },
                },
                consumers: {
                    where: {
                        is_active: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        const pangkalanStats = pangkalans.map(p => {
            const subsidiOrders = p.orders.filter(o => o.order_items.some(item => item.lpg_type === 'kg3'));
            const subsidiTabung = subsidiOrders.reduce((sum, o) => sum + o.order_items.filter(item => item.lpg_type === 'kg3').reduce((s, i) => s + i.qty, 0), 0);
            const consumerOrderCount = p.consumer_orders.length;
            const consumerTabung = p.consumer_orders.reduce((sum, o) => sum + o.qty, 0);
            const consumerRevenue = p.consumer_orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            const uniqueConsumerIds = new Set(p.consumer_orders.filter(o => o.consumer_id).map(o => o.consumer_id));
            return {
                id: p.id,
                code: p.code,
                name: p.name,
                address: p.address,
                region: p.region || '-',
                pic_name: p.pic_name || '-',
                phone: p.phone || '-',
                alokasi_bulanan: p.alokasi_bulanan,
                total_orders_from_agen: subsidiOrders.length,
                total_tabung_from_agen: subsidiTabung,
                total_consumer_orders: consumerOrderCount,
                total_tabung_to_consumers: consumerTabung,
                total_revenue: consumerRevenue,
                total_registered_consumers: p.consumers.length,
                active_consumers: uniqueConsumerIds.size,
            };
        });
        pangkalanStats.sort((a, b) => b.total_tabung_to_consumers - a.total_tabung_to_consumers);
        const summary = {
            total_pangkalan: pangkalans.length,
            total_orders_subsidi: pangkalanStats.reduce((sum, p) => sum + p.total_consumer_orders, 0),
            total_tabung_subsidi: pangkalanStats.reduce((sum, p) => sum + p.total_tabung_to_consumers, 0),
            total_revenue: pangkalanStats.reduce((sum, p) => sum + p.total_revenue, 0),
            total_consumers: pangkalanStats.reduce((sum, p) => sum + p.total_registered_consumers, 0),
            active_consumers: pangkalanStats.reduce((sum, p) => sum + p.active_consumers, 0),
            top_pangkalan: pangkalanStats[0]?.name || '-',
        };
        return {
            summary,
            data: pangkalanStats,
            period: {
                start: startDate,
                end: endDate,
            },
        };
    }
    async getSubsidiConsumers(pangkalanId, startDate, endDate) {
        const pangkalan = await this.prisma.pangkalans.findUnique({
            where: { id: pangkalanId },
            select: { id: true, code: true, name: true },
        });
        if (!pangkalan) {
            return { error: 'Pangkalan not found' };
        }
        const consumerOrders = await this.prisma.consumer_orders.findMany({
            where: {
                pangkalan_id: pangkalanId,
                lpg_type: 'kg3',
                sale_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                consumers: true,
            },
            orderBy: { sale_date: 'desc' },
        });
        const consumerMap = new Map();
        for (const order of consumerOrders) {
            const consumerId = order.consumer_id || 'WALK_IN';
            const consumerName = order.consumers?.name || order.consumer_name || 'Walk-in Customer';
            if (!consumerMap.has(consumerId)) {
                consumerMap.set(consumerId, {
                    id: consumerId,
                    name: consumerName,
                    nik: order.consumers?.nik || null,
                    kk: order.consumers?.kk || null,
                    phone: order.consumers?.phone || null,
                    address: order.consumers?.address || null,
                    consumer_type: order.consumers?.consumer_type || 'WALK_IN',
                    total_purchases: 0,
                    total_tabung: 0,
                    last_purchase: order.sale_date,
                    purchases: [],
                });
            }
            const consumer = consumerMap.get(consumerId);
            consumer.total_purchases += 1;
            consumer.total_tabung += order.qty;
            consumer.purchases.push({
                date: order.sale_date,
                qty: order.qty,
                amount: Number(order.total_amount),
            });
            if (order.sale_date > consumer.last_purchase) {
                consumer.last_purchase = order.sale_date;
            }
        }
        const consumers = Array.from(consumerMap.values());
        consumers.sort((a, b) => b.total_tabung - a.total_tabung);
        const summary = {
            pangkalan_id: pangkalan.id,
            pangkalan_code: pangkalan.code,
            pangkalan_name: pangkalan.name,
            total_consumers: consumers.length,
            registered_consumers: consumers.filter(c => c.id !== 'WALK_IN').length,
            walk_in_count: consumers.filter(c => c.id === 'WALK_IN').length ? 1 : 0,
            total_transactions: consumerOrders.length,
            total_tabung: consumers.reduce((sum, c) => sum + c.total_tabung, 0),
        };
        return {
            summary,
            data: consumers,
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