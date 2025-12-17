import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsumerOrderDto, UpdateConsumerOrderDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * ConsumerOrderService
 * 
 * Service untuk mengelola penjualan LPG dari pangkalan ke konsumen.
 * 
 * PENJELASAN:
 * - consumer_order adalah pesanan dari konsumen ke pangkalan
 * - Berbeda dengan "orders" yang merupakan pesanan dari pangkalan ke agen
 * - Mendukung walk-in customer (consumer_name) dan registered consumer (consumer_id)
 * - Multi-tenant: setiap pangkalan hanya bisa akses data miliknya
 */
@Injectable()
export class ConsumerOrderService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all consumer orders for a pangkalan
     */
    async findAll(
        pangkalanId: string,
        page = 1,
        limit = 10,
        options?: {
            startDate?: string;
            endDate?: string;
            paymentStatus?: string;
            consumerId?: string;
        },
    ) {
        const skip = (page - 1) * limit;

        const where: any = {
            pangkalan_id: pangkalanId,
        };

        // Date filter
        if (options?.startDate || options?.endDate) {
            where.sale_date = {};
            if (options.startDate) {
                where.sale_date.gte = new Date(options.startDate);
            }
            if (options.endDate) {
                where.sale_date.lte = new Date(options.endDate);
            }
        }

        // Payment status filter
        if (options?.paymentStatus) {
            where.payment_status = options.paymentStatus;
        }

        // Consumer filter
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

    /**
     * Get single consumer order by ID
     */
    async findOne(id: string, pangkalanId: string) {
        const order = await this.prisma.consumer_orders.findFirst({
            where: { id },
            include: {
                consumers: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Pesanan tidak ditemukan');
        }

        // Check ownership
        if (order.pangkalan_id !== pangkalanId) {
            throw new ForbiddenException('Anda tidak memiliki akses ke data ini');
        }

        return order;
    }

    /**
     * Create new consumer order (record a sale)
     */
    async create(pangkalanId: string, dto: CreateConsumerOrderDto) {
        // Validate: must have either consumer_id or consumer_name
        if (!dto.consumer_id && !dto.consumer_name) {
            throw new BadRequestException('Harus mengisi consumer_id atau consumer_name');
        }

        // If consumer_id provided, verify ownership
        if (dto.consumer_id) {
            const consumer = await this.prisma.consumers.findFirst({
                where: { id: dto.consumer_id, pangkalan_id: pangkalanId },
            });
            if (!consumer) {
                throw new NotFoundException('Pelanggan tidak ditemukan');
            }
        }

        // Generate order code
        const orderCount = await this.prisma.consumer_orders.count({
            where: { pangkalan_id: pangkalanId },
        });
        const orderCode = `PORD-${String(orderCount + 1).padStart(4, '0')}`;

        // Calculate total
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

    /**
     * Update consumer order
     */
    async update(id: string, pangkalanId: string, dto: UpdateConsumerOrderDto) {
        // Verify ownership
        await this.findOne(id, pangkalanId);

        // If consumer_id updated, verify ownership
        if (dto.consumer_id) {
            const consumer = await this.prisma.consumers.findFirst({
                where: { id: dto.consumer_id, pangkalan_id: pangkalanId },
            });
            if (!consumer) {
                throw new NotFoundException('Pelanggan tidak ditemukan');
            }
        }

        // Recalculate total if qty or price changed
        const existing = await this.prisma.consumer_orders.findUnique({
            where: { id },
        });

        const qty = dto.qty ?? existing!.qty;
        const pricePerUnit = dto.price_per_unit ?? Number(existing!.price_per_unit);
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

    /**
     * Delete consumer order
     */
    async remove(id: string, pangkalanId: string) {
        // Verify ownership
        await this.findOne(id, pangkalanId);

        await this.prisma.consumer_orders.delete({
            where: { id },
        });

        return { message: 'Pesanan berhasil dihapus' };
    }

    /**
     * Get sales stats for dashboard
     */
    async getStats(pangkalanId: string, todayOnly = false) {
        // Build date filter
        const dateFilter: any = {};
        if (todayOnly) {
            // Use fixed timezone offset for WIB (UTC+7)
            const now = new Date();
            // Get start of today in WIB timezone
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            dateFilter.sale_date = {
                gte: today,
                lt: tomorrow,
            };
        }

        // Fixed cost prices per LPG type (harga beli dari agen)
        const COST_PRICES: Record<string, number> = {
            'kg3': 16000,
            'kg5': 52000,
            'kg12': 142000,
            'kg50': 590000,
        };

        // Get all orders for the period to calculate modal
        const orders = await this.prisma.consumer_orders.findMany({
            where: { pangkalan_id: pangkalanId, ...dateFilter },
            select: {
                qty: true,
                lpg_type: true,
                price_per_unit: true,
                total_amount: true,
            },
        });

        // Calculate totals
        let totalQty = 0;
        let totalRevenue = 0;
        let totalModal = 0;
        for (const order of orders) {
            totalQty += order.qty;
            totalRevenue += Number(order.total_amount);
            // Use fixed cost price based on LPG type
            const costPrice = COST_PRICES[order.lpg_type] || 16000;
            totalModal += order.qty * costPrice;
        }

        const marginKotor = totalRevenue - totalModal;

        // Get expenses for the period
        const expenseFilter: any = { pangkalan_id: pangkalanId };
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

        // All orders are LUNAS (no hutang/debt feature)
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

    /**
     * Get recent sales for dashboard
     */
    async getRecentSales(pangkalanId: string, limit = 5) {
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

    /**
     * Get chart data for 7 days trend with penjualan, modal, pengeluaran, laba
     */
    async getChartData(pangkalanId: string) {
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result: Array<{
            day: string;
            date: string;
            penjualan: number;
            modal: number;
            pengeluaran: number;
            laba: number;
        }> = [];

        // Get data for last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            // Get all orders for this day
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

            // Fixed cost prices for modal calculation
            const COST_PRICES: Record<string, number> = {
                'kg3': 16000,
                'kg5': 52000,
                'kg12': 142000,
                'kg50': 590000,
            };

            // Calculate totals
            let penjualan = 0;
            let modal = 0;
            for (const order of orders) {
                penjualan += Number(order.total_amount);
                const costPrice = COST_PRICES[order.lpg_type] || 16000;
                modal += order.qty * costPrice;
            }

            // Get expenses for this day
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
}
