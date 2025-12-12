/**
 * Dashboard Service
 * 
 * PENJELASAN:
 * Service ini berisi logic untuk mengambil data statistik dan chart dari database.
 * 
 * Method yang tersedia:
 * - getStats() - Statistik KPI (total orders, pending, completed, stock)
 * - getSalesChart() - Data penjualan 7 hari untuk line chart
 * - getStockChart() - Data stok 7 hari untuk line chart
 * - getProfitChart() - Data profit 7 hari untuk bar chart
 * - getTopPangkalan() - Top 5 pangkalan dengan order terbanyak
 * - getStockConsumption() - Pemakaian stok per LPG type
 * - getRecentActivities() - 10 aktivitas terbaru
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get dashboard KPI statistics
     * 
     * Data yang dikembalikan:
     * - todayOrders: Total pesanan hari ini
     * - pendingOrders: Pesanan yang belum diproses
     * - completedOrders: Pesanan yang sudah selesai hari ini
     * - totalStock: Stok per jenis LPG (legacy)
     * - dynamicProducts: Stok produk LPG dinamis
     */
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Count today's orders
        const todayOrders = await this.prisma.client.orders.count({
            where: {
                created_at: { gte: today },
            },
        });

        // Count pending orders - using IN for multiple pending statuses
        const pendingOrders = await this.prisma.client.orders.count({
            where: {
                current_status: {
                    in: ['DRAFT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES', 'SIAP_KIRIM'],
                },
            },
        });

        // Count completed orders today
        const completedOrders = await this.prisma.client.orders.count({
            where: {
                current_status: 'SELESAI',
                updated_at: { gte: today },
            },
        });

        // Get legacy stock summary
        const stockSummary = await this.getStockSummary();

        // Get dynamic products with stock
        const dynamicProducts = await this.getDynamicProductsStock();

        return {
            todayOrders,
            pendingOrders,
            completedOrders,
            totalStock: stockSummary,
            dynamicProducts,
        };
    }

    /**
     * Get stock summary by LPG type (legacy)
     */
    private async getStockSummary() {
        const stockHistory = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: {
                lpg_type: { not: null }
            },
            _sum: {
                qty: true,
            },
        });

        const summary: Record<string, number> = {
            kg3: 0,
            kg12: 0,
            kg50: 0,
        };

        stockHistory.forEach((item) => {
            const lpgType = item.lpg_type as string;
            if (!lpgType) return;
            const qty = item._sum.qty || 0;

            if (item.movement_type === 'MASUK') {
                summary[lpgType] = (summary[lpgType] || 0) + qty;
            } else {
                summary[lpgType] = (summary[lpgType] || 0) - qty;
            }
        });

        return summary;
    }

    /**
     * Get dynamic products with stock from lpg_products table
     */
    private async getDynamicProductsStock() {
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            include: {
                prices: {
                    where: { is_default: true },
                    take: 1
                }
            },
            orderBy: { size_kg: 'asc' }
        });

        // Get stock movements grouped by lpg_product_id
        const stockData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: {
                qty: true
            }
        });

        // Build response
        return products.map(product => {
            const productStock = stockData.filter(s => s.lpg_product_id === product.id);
            const inQty = productStock.find(s => s.movement_type === 'MASUK')?._sum.qty || 0;
            const outQty = productStock.find(s => s.movement_type === 'KELUAR')?._sum.qty || 0;

            return {
                id: product.id,
                name: product.name,
                size_kg: Number(product.size_kg),
                category: product.category,
                color: product.color,
                price: product.prices[0] ? Number(product.prices[0].price) : 0,
                stock: {
                    in: inQty,
                    out: outQty,
                    current: inQty - outQty
                }
            };
        });
    }

    /**
     * Get sales data for chart (last 7 days)
     * 
     * Data format: [{ day: "Sen", sales: 2400000 }, ...]
     */
    async getSalesChart() {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result: { day: string; sales: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            // Sum total_amount from orders for this day
            const salesData = await this.prisma.client.orders.aggregate({
                where: {
                    created_at: {
                        gte: date,
                        lt: nextDay,
                    },
                },
                _sum: {
                    total_amount: true,
                },
            });

            result.push({
                day: days[date.getDay()],
                sales: Number(salesData._sum.total_amount) || 0,
            });
        }

        return { data: result };
    }

    /**
     * Get stock trend for chart (last 7 days)
     * 
     * Data format: [{ day: "Sen", stock: 2200 }, ...]
     */
    async getStockChart() {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result: { day: string; stock: number }[] = [];

        // Get current stock first
        const currentStock = await this.getStockSummary();
        let runningStock = currentStock.kg3 + currentStock.kg12 + currentStock.kg50;

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            // Get movements for this day
            const movements = await this.prisma.client.stock_histories.findMany({
                where: {
                    timestamp: {
                        gte: date,
                        lt: nextDay,
                    },
                },
            });

            // Calculate stock at end of this day (going backwards)
            if (i === 0) {
                result.unshift({
                    day: days[date.getDay()],
                    stock: runningStock,
                });
            } else {
                // Reverse the movements to get previous day's stock
                movements.forEach((m) => {
                    if (m.movement_type === 'MASUK') {
                        runningStock -= m.qty;
                    } else {
                        runningStock += m.qty;
                    }
                });
                result.unshift({
                    day: days[date.getDay()],
                    stock: runningStock,
                });
            }
        }

        return { data: result };
    }

    /**
     * Get profit data for chart (last 7 days)
     * 
     * Profit dihitung dari total_amount orders
     * (simplified - dalam real app perlu kalkulasi cost)
     */
    async getProfitChart() {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result: { day: string; profit: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const salesData = await this.prisma.client.orders.aggregate({
                where: {
                    created_at: {
                        gte: date,
                        lt: nextDay,
                    },
                    current_status: 'SELESAI',
                },
                _sum: {
                    total_amount: true,
                },
            });

            // Simplified profit calculation (10% of sales)
            const totalAmount = salesData._sum?.total_amount || 0;
            const profit = Number(totalAmount) * 0.1;

            result.push({
                day: days[date.getDay()],
                profit,
            });
        }

        return { data: result };
    }

    /**
     * Get top 5 pangkalan by order count
     * 
     * Data format untuk pie chart
     */
    async getTopPangkalan() {
        const pangkalanOrders = await this.prisma.client.orders.groupBy({
            by: ['pangkalan_id'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 5,
        });

        // Get pangkalan names
        const result = await Promise.all(
            pangkalanOrders.map(async (item) => {
                const pangkalan = await this.prisma.client.pangkalans.findUnique({
                    where: { id: item.pangkalan_id },
                    select: { name: true },
                });
                return {
                    name: pangkalan?.name || 'Unknown',
                    value: item._count.id,
                };
            })
        );

        return { data: result };
    }

    /**
     * Get stock consumption by LPG type (last 7 days)
     * 
     * Data untuk WeeklyConsumptionChart di ringkasan-stok
     */
    async getStockConsumption() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const result: { day: string; lpg3kg: number; lpg12kg: number; lpg50kg: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            // Get KELUAR movements for each LPG type
            const movements = await this.prisma.client.stock_histories.groupBy({
                by: ['lpg_type'],
                where: {
                    movement_type: 'KELUAR',
                    timestamp: {
                        gte: date,
                        lt: nextDay,
                    },
                },
                _sum: {
                    qty: true,
                },
            });

            const dayData: { day: string; lpg3kg: number; lpg12kg: number; lpg50kg: number } = {
                day: days[date.getDay()],
                lpg3kg: 0,
                lpg12kg: 0,
                lpg50kg: 0,
            };

            movements.forEach((m) => {
                const lpgType = String(m.lpg_type);
                if (lpgType === 'kg3') dayData.lpg3kg = m._sum.qty || 0;
                if (lpgType === 'kg12') dayData.lpg12kg = m._sum.qty || 0;
                if (lpgType === 'kg50') dayData.lpg50kg = m._sum.qty || 0;
            });

            result.push(dayData);
        }

        return { data: result };
    }

    /**
     * Get recent activities (last 10)
     */
    async getRecentActivities() {
        const activities = await this.prisma.client.activity_logs.findMany({
            take: 10,
            orderBy: {
                timestamp: 'desc',
            },
            include: {
                users: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return {
            data: activities.map((a) => ({
                id: a.id,
                action: a.type,
                title: a.title,
                description: a.description,
                timestamp: a.timestamp,
                user: a.users?.name || 'System',
            })),
        };
    }
}
