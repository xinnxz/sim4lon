/**
 * Reports Service
 * 
 * PENJELASAN:
 * Service untuk generate laporan:
 * 1. Laporan Penjualan (Sales)
 * 2. Laporan Pembayaran (Payments)
 * 3. Laporan Pemakaian Stok (Stock Movement)
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Laporan Penjualan
     */
    async getSalesReport(startDate: Date, endDate: Date) {
        // Get orders within date range
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
                    include: {
                        // No direct relation to lpg_products in order_items
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });

        // Calculate summary
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Count orders by status
        const statusCounts = orders.reduce((acc, o) => {
            acc[o.current_status] = (acc[o.current_status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Format data for table
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

    /**
     * Laporan Pembayaran
     */
    async getPaymentsReport(startDate: Date, endDate: Date) {
        // Get payment records within date range
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

        // Calculate summary
        const totalPayments = payments.length;
        const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

        // Group by payment method
        const methodBreakdown = payments.reduce((acc, p) => {
            const method = p.method || 'UNKNOWN';
            if (!acc[method]) acc[method] = { count: 0, amount: 0 };
            acc[method].count++;
            acc[method].amount += Number(p.amount);
            return acc;
        }, {} as Record<string, { count: number; amount: number }>);

        // Format data for table
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

    /**
     * Laporan Pemakaian Stok
     */
    async getStockMovementReport(startDate: Date, endDate: Date, productId?: string) {
        // Build where clause
        const where: any = {
            created_at: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (productId) {
            where.lpg_product_id = productId;
        }

        // Get stock movements
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

        // Calculate summary - need to get all movements for balance calculation
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
            } else {
                totalOut = m._sum.qty || 0;
            }
        }

        // Period movements
        const periodMovements = movements.reduce((acc, m) => {
            if (m.movement_type === 'MASUK') {
                acc.in += m.qty;
            } else {
                acc.out += m.qty;
            }
            return acc;
        }, { in: 0, out: 0 });

        // Format data for table
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
}
