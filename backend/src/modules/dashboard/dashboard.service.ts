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
     * - todaySales: Total penjualan (Rp) hari ini
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

        // Sum today's sales (total_amount) - exclude cancelled orders
        const salesData = await this.prisma.client.orders.aggregate({
            where: {
                created_at: { gte: today },
                current_status: { not: 'BATAL' },
            },
            _sum: {
                total_amount: true,
            },
        });
        const todaySales = Number(salesData._sum.total_amount) || 0;

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
            todaySales,
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
                price: Number(product.selling_price) || 0,  // Use selling_price directly
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

            // Sum total_amount from orders for this day (exclude cancelled orders)
            const salesData = await this.prisma.client.orders.aggregate({
                where: {
                    created_at: {
                        gte: date,
                        lt: nextDay,
                    },
                    current_status: { not: 'BATAL' },  // Exclude cancelled orders
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
     * Get stock CONSUMPTION/USAGE data for chart (last 7 days) - DYNAMIC PRODUCTS
     * 
     * PENJELASAN:
     * Chart ini menampilkan PEMAKAIAN stok (movement KELUAR) per hari.
     * Bukan level stok, tapi berapa banyak yang keluar/terjual per hari.
     * 
     * Data format: {
     *   products: [{ id, name, color }, ...],
     *   data: [{ day: "Sen", [productId]: consumedQty, ... }, ...]
     * }
     */
    async getStockChart() {
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        // Get all active products
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });

        // Build days array with consumption per product
        const days: Record<string, any>[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            // Get KELUAR (consumption) movements for this day grouped by product
            const movements = await this.prisma.client.stock_histories.groupBy({
                by: ['lpg_product_id'],
                where: {
                    timestamp: { gte: date, lt: nextDay },
                    lpg_product_id: { not: null },
                    movement_type: 'KELUAR'  // Only count consumption/usage
                },
                _sum: { qty: true }
            });

            const dayData: Record<string, any> = { day: dayNames[date.getDay()] };

            // Initialize all products with 0
            products.forEach(p => {
                const movement = movements.find(m => m.lpg_product_id === p.id);
                dayData[p.id] = movement?._sum.qty || 0;
            });

            days.push(dayData);
        }

        // Color palette for products without color
        const colorPalette = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

        return {
            products: products.map((p, index) => ({
                id: p.id,
                name: p.name,
                color: this.mapColorName(p.color) || colorPalette[index % colorPalette.length]
            })),
            data: days
        };
    }

    /**
     * Map color name to hex color (based on Pertamina LPG colors)
     * - hijau/green = 3kg Elpiji subsidi
     * - biru/blue = 12kg Elpiji  
     * - ungu/purple = Bright Gas 5.5kg
     * - pink = Bright Gas 12kg
     * - merah/red = 50kg
     */
    private mapColorName(colorName: string | null): string | null {
        if (!colorName) return null;
        const colorMap: Record<string, string> = {
            // 3kg Elpiji - Hijau terang
            'hijau': '#22c55e',
            'green': '#22c55e',
            'standard': '#22c55e',  // Default 3kg warna hijau

            // 12kg Elpiji - Biru langit
            'biru': '#38bdf8',
            'blue': '#38bdf8',

            // Bright Gas 5.5kg - Ungu
            'ungu': '#a855f7',
            'purple': '#a855f7',
            'violet': '#a855f7',

            // Bright Gas 12kg - Pink magenta
            'pink': '#ec4899',
            'magenta': '#ec4899',

            // 50kg - Merah
            'merah': '#dc2626',
            'red': '#dc2626',

            // Extras
            'kuning': '#eab308',
            'yellow': '#eab308',
            'orange': '#f97316',
        };
        return colorMap[colorName.toLowerCase()] || null;
    }

    /**
     * Get profit data for chart (last 7 days)
     * 
     * PENJELASAN PERHITUNGAN PROFIT:
     * Profit = Total Penjualan - Total Modal
     * - Untuk setiap order SELESAI, kita ambil semua order_items
     * - Profit per item = (price_per_unit - cost_price) * qty
     * - cost_price diambil dari lpg_products based on lpg_type
     */
    async getProfitChart() {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result: {
            day: string;
            profit: number;
            totalSales: number;
            totalCost: number;
            orderCount: number;
        }[] = [];

        // Get cost prices for each LPG type from lpg_products
        const products = await this.prisma.lpg_products.findMany({
            where: { is_active: true, deleted_at: null }
        });

        // Map lpg_type enum to cost_price
        const costPriceMap: Record<string, number> = {};
        products.forEach(p => {
            // Map size_kg to lpg_type enum format (3kg, 5.5kg, 12kg, 50kg)
            const sizeKg = Number(p.size_kg);
            let lpgTypeKey = '';
            if (sizeKg === 3) lpgTypeKey = 'kg3';
            else if (sizeKg === 5.5) lpgTypeKey = 'kg5';
            else if (sizeKg === 12) lpgTypeKey = 'kg12';
            else if (sizeKg === 50) lpgTypeKey = 'kg50';

            if (lpgTypeKey) {
                costPriceMap[lpgTypeKey] = Number(p.cost_price) || 0;
            }
        });

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            // Get completed orders for this day with their items
            const orders = await this.prisma.client.orders.findMany({
                where: {
                    created_at: {
                        gte: date,
                        lt: nextDay,
                    },
                    current_status: 'SELESAI',
                },
                include: {
                    order_items: true
                }
            });

            let totalSales = 0;
            let totalCost = 0;

            // Calculate profit for each order
            orders.forEach(order => {
                order.order_items.forEach(item => {
                    const sellingPrice = Number(item.price_per_unit) || 0;
                    const costPrice = costPriceMap[item.lpg_type] || 0;
                    const qty = item.qty || 0;

                    totalSales += sellingPrice * qty;
                    totalCost += costPrice * qty;
                });
            });

            const profit = totalSales - totalCost;

            result.push({
                day: days[date.getDay()],
                profit: profit > 0 ? profit : 0,
                totalSales,
                totalCost,
                orderCount: orders.length
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
            take: 3,
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
