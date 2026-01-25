import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsumerOrderDto, UpdateConsumerOrderDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';
import { todayWIB, nowWIB } from '../../common/utils/timezone.util';

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
    private readonly logger = new Logger(ConsumerOrderService.name);

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
        this.logger.log(`[CREATE] Starting - pangkalanId: ${pangkalanId}`);
        this.logger.log(`[CREATE] DTO received: ${JSON.stringify(dto)}`);

        try {
            // Validate: must have either consumer_id or consumer_name
            if (!dto.consumer_id && !dto.consumer_name) {
                this.logger.warn('[CREATE] Validation failed - no consumer_id or consumer_name');
                throw new BadRequestException('Harus mengisi consumer_id atau consumer_name');
            }

            // If consumer_id provided, verify ownership
            if (dto.consumer_id) {
                this.logger.log(`[CREATE] Verifying consumer_id: ${dto.consumer_id}`);
                const consumer = await this.prisma.consumers.findFirst({
                    where: { id: dto.consumer_id, pangkalan_id: pangkalanId },
                });
                if (!consumer) {
                    this.logger.warn('[CREATE] Consumer not found or not owned');
                    throw new NotFoundException('Pelanggan tidak ditemukan');
                }
                this.logger.log(`[CREATE] Consumer verified: ${consumer.name}`);
            }

            // Generate order code with timestamp for guaranteed uniqueness
            // Format: PORD-YYMMDD-HHMM-XXX (date + time + random)
            const now = new Date();
            const datePart = now.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
            const timePart = now.toISOString().slice(11, 16).replace(/:/g, ''); // HHMM
            const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const orderCode = `PORD-${datePart}-${timePart}-${randomPart}`;
            this.logger.log(`[CREATE] Generated order code: ${orderCode}`);

            // Calculate total
            const totalAmount = dto.qty * dto.price_per_unit;
            this.logger.log(`[CREATE] Total amount: ${totalAmount}`);

            // HPP (Harga Pokok Pembelian) per type
            const COST_PRICES: Record<string, number> = {
                'kg3': 16000, 'kg5': 52000, 'kg12': 142000, 'kg50': 590000,
                '3kg': 16000, '5kg': 52000, '12kg': 142000, '50kg': 590000,
            };
            const costPrice = COST_PRICES[dto.lpg_type as string] || 16000;

            // Prepare data
            const createData = {
                code: orderCode,
                pangkalan_id: pangkalanId,
                consumer_id: dto.consumer_id || null,
                consumer_name: dto.consumer_name || null,
                lpg_type: dto.lpg_type,
                qty: dto.qty,
                price_per_unit: dto.price_per_unit,
                cost_price: costPrice, // HPP per unit
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

            // ============================================
            // STOCK DEDUCTION - Best Practice
            // Kurangi stok setelah penjualan berhasil dicatat
            // ============================================
            try {
                // 1. Find or create stock record for this LPG type
                const existingStock = await this.prisma.pangkalan_stocks.findFirst({
                    where: {
                        pangkalan_id: pangkalanId,
                        lpg_type: dto.lpg_type,
                    },
                });

                if (existingStock) {
                    // Deduct stock
                    const newQty = existingStock.qty - dto.qty;
                    await this.prisma.pangkalan_stocks.update({
                        where: { id: existingStock.id },
                        data: {
                            qty: newQty < 0 ? 0 : newQty, // Prevent negative stock
                            updated_at: new Date(),
                        },
                    });
                    this.logger.log(`[CREATE] Stock deducted: ${existingStock.qty} -> ${newQty} for ${dto.lpg_type}`);
                } else {
                    this.logger.warn(`[CREATE] No stock record found for ${dto.lpg_type} - skipping deduction`);
                }

                // 2. Create stock movement record for audit trail
                await this.prisma.pangkalan_stock_movements.create({
                    data: {
                        pangkalan_id: pangkalanId,
                        lpg_type: dto.lpg_type,
                        movement_type: 'OUT',
                        qty: dto.qty,
                        source: 'SALE', // Reference type: SALE, PURCHASE, ADJUSTMENT
                        reference_id: order.id,
                        note: `Penjualan ${orderCode} - ${dto.consumer_name || 'Walk-in'}`,
                    },
                });
                this.logger.log(`[CREATE] Stock movement recorded`);

            } catch (stockError) {
                // Log error but don't fail the order
                this.logger.error(`[CREATE] Stock deduction error: ${stockError.message}`);
                // Order is still valid, stock will be handled manually if needed
            }

            this.logger.log(`[CREATE] Success - order ID: ${order.id}`);
            return order;
        } catch (error) {
            this.logger.error(`[CREATE] Error: ${error.message}`);
            this.logger.error(`[CREATE] Stack: ${error.stack}`);
            throw error;
        }
    }

    /**
     * Update consumer order with automatic stock adjustment
     */
    async update(id: string, pangkalanId: string, dto: UpdateConsumerOrderDto) {
        this.logger.log(`[UPDATE] Starting - orderId: ${id}, pangkalanId: ${pangkalanId}`);

        // Verify ownership and get existing order
        const existing = await this.findOne(id, pangkalanId);

        // If consumer_id updated, verify ownership
        if (dto.consumer_id) {
            const consumer = await this.prisma.consumers.findFirst({
                where: { id: dto.consumer_id, pangkalan_id: pangkalanId },
            });
            if (!consumer) {
                throw new NotFoundException('Pelanggan tidak ditemukan');
            }
        }

        // Calculate qty delta for stock adjustment
        const oldQty = existing.qty;
        const newQty = dto.qty ?? oldQty;
        const qtyDelta = newQty - oldQty; // Positive = need more stock, Negative = return to stock

        // Recalculate total if qty or price changed
        const pricePerUnit = dto.price_per_unit ?? Number(existing.price_per_unit);
        const totalAmount = newQty * pricePerUnit;

        this.logger.log(`[UPDATE] Qty change: ${oldQty} -> ${newQty} (delta: ${qtyDelta})`);

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

        // ============================================
        // STOCK ADJUSTMENT - When qty changes
        // If qty increased: deduct more from stock
        // If qty decreased: return to stock
        // ============================================
        if (qtyDelta !== 0) {
            try {
                const lpgType = existing.lpg_type;
                const existingStock = await this.prisma.pangkalan_stocks.findFirst({
                    where: {
                        pangkalan_id: pangkalanId,
                        lpg_type: lpgType,
                    },
                });

                if (existingStock) {
                    // Adjust stock: subtract delta (positive delta = less stock, negative delta = more stock)
                    const newStockQty = existingStock.qty - qtyDelta;
                    await this.prisma.pangkalan_stocks.update({
                        where: { id: existingStock.id },
                        data: {
                            qty: newStockQty < 0 ? 0 : newStockQty,
                            updated_at: new Date(),
                        },
                    });
                    this.logger.log(`[UPDATE] Stock adjusted: ${existingStock.qty} -> ${newStockQty} for ${lpgType}`);
                }

                // Create stock movement record for audit trail
                const movementType = qtyDelta > 0 ? 'OUT' : 'IN';
                const movementQty = Math.abs(qtyDelta);
                await this.prisma.pangkalan_stock_movements.create({
                    data: {
                        pangkalan_id: pangkalanId,
                        lpg_type: lpgType,
                        movement_type: movementType,
                        qty: movementQty,
                        source: 'ADJUSTMENT',
                        reference_id: order.id,
                        note: `Edit penjualan ${existing.code}: qty ${oldQty} -> ${newQty}`,
                    },
                });
                this.logger.log(`[UPDATE] Stock movement recorded: ${movementType} ${movementQty}`);

            } catch (stockError) {
                this.logger.error(`[UPDATE] Stock adjustment error: ${stockError.message}`);
                // Don't fail the update, log for manual review
            }
        }

        return order;
    }

    /**
     * Delete consumer order with stock return
     */
    async remove(id: string, pangkalanId: string) {
        this.logger.log(`[DELETE] Starting - orderId: ${id}, pangkalanId: ${pangkalanId}`);

        // Verify ownership and get data before delete
        const order = await this.findOne(id, pangkalanId);

        // ============================================
        // STOCK RETURN - When order is deleted
        // Return the sold qty back to stock
        // ============================================
        try {
            const lpgType = order.lpg_type;
            const existingStock = await this.prisma.pangkalan_stocks.findFirst({
                where: {
                    pangkalan_id: pangkalanId,
                    lpg_type: lpgType,
                },
            });

            if (existingStock) {
                // Return stock: add qty back
                const newStockQty = existingStock.qty + order.qty;
                await this.prisma.pangkalan_stocks.update({
                    where: { id: existingStock.id },
                    data: {
                        qty: newStockQty,
                        updated_at: new Date(),
                    },
                });
                this.logger.log(`[DELETE] Stock returned: ${existingStock.qty} -> ${newStockQty} for ${lpgType}`);
            }

            // Create stock movement record for audit trail
            await this.prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pangkalanId,
                    lpg_type: lpgType,
                    movement_type: 'IN',
                    qty: order.qty,
                    source: 'RETURN', // Sale deleted = return to stock
                    reference_id: order.id, // ID will be kept in log even if record is deleted (optional: or use code)
                    note: `Hapus penjualan ${order.code} - ${order.consumer_name || 'Walk-in'}`,
                },
            });
            this.logger.log(`[DELETE] Stock movement recorded: IN ${order.qty}`);

        } catch (stockError) {
            this.logger.error(`[DELETE] Stock return error: ${stockError.message}`);
            // Don't fail the delete, simply log warning
        }

        await this.prisma.consumer_orders.delete({
            where: { id },
        });

        return { message: 'Pesanan berhasil dihapus dan stok dikembalikan' };
    }

    /**
     * Get sales stats for dashboard
     * Supports:
     * - todayOnly = true: filter to today's data
     * - startDate/endDate: filter to custom date range (takes precedence over todayOnly)
     */
    async getStats(pangkalanId: string, todayOnly = false, startDate?: string, endDate?: string) {
        // Build date filter
        const dateFilter: any = {};

        // Date range takes priority over todayOnly
        if (startDate || endDate) {
            dateFilter.sale_date = {};
            if (startDate) {
                dateFilter.sale_date.gte = new Date(startDate);
            }
            if (endDate) {
                // Add 1 day to include the end date fully
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);
                dateFilter.sale_date.lt = end;
            }
        } else if (todayOnly) {
            // Use WIB timezone for "today" calculation
            const today = todayWIB();
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

        // Get expenses for the period (matching the same date filter logic)
        const expenseFilter: any = { pangkalan_id: pangkalanId };
        if (startDate || endDate) {
            expenseFilter.expense_date = {};
            if (startDate) {
                expenseFilter.expense_date.gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);
                expenseFilter.expense_date.lt = end;
            }
        } else if (todayOnly) {
            const today = todayWIB();  // Use WIB timezone
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

        // Get data for last 7 days (using WIB timezone)
        for (let i = 6; i >= 0; i--) {
            const date = nowWIB();  // Use WIB timezone
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
