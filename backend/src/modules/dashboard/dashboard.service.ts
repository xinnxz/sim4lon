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
                order_date: { gte: today },
            },
        });

        // Sum today's sales (total_amount) - exclude cancelled orders
        const salesData = await this.prisma.client.orders.aggregate({
            where: {
                order_date: { gte: today },
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
                order_date: { gte: today },
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
                    order_date: {
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

        // Map lpg_type to cost_price - support BOTH formats (kg3 and 3kg)
        const costPriceMap: Record<string, number> = {};
        products.forEach(p => {
            const sizeKg = Number(p.size_kg);
            const cost = Number(p.cost_price) || 0;

            // Map size to both backend (kg3) and frontend (3kg) formats
            if (sizeKg === 3) {
                costPriceMap['kg3'] = cost;
                costPriceMap['3kg'] = cost;
            } else if (sizeKg === 5.5) {
                costPriceMap['kg5'] = cost;
                costPriceMap['5kg'] = cost;
                costPriceMap['5.5kg'] = cost;
            } else if (sizeKg === 12) {
                costPriceMap['kg12'] = cost;
                costPriceMap['12kg'] = cost;
            } else if (sizeKg === 50) {
                costPriceMap['kg50'] = cost;
                costPriceMap['50kg'] = cost;
            } else if (sizeKg <= 0.5) {
                // Bright Gas 220gr (0.22kg)
                costPriceMap['gr220'] = cost;
                costPriceMap['220gr'] = cost;
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
                    order_date: {
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

    /**
     * Get DSS (Decision Support System) Alerts
     * 
     * PENJELASAN:
     * Method ini menyediakan data untuk mendukung keputusan operasional:
     * 1. Low Stock Alerts - Produk dengan stok di bawah threshold
     * 2. Payment Overdue Alerts - Pesanan dengan pembayaran yang terlambat
     * 3. Pending Orders Alert - Pesanan yang perlu tindak lanjut
     * 
     * Threshold default:
     * - Low stock: < 50 unit
     * - Payment overdue: > 7 hari sejak order dibuat
     */
    async getDSSAlerts() {
        const LEAD_TIME_DAYS = 2; // Same as Reorder Point
        const ANALYSIS_DAYS = 30; // Same as Reorder Point
        const OVERDUE_DAYS = 1;

        // ========== 1. LOW STOCK ALERTS (ROP-based) ==========
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });

        // Get start date for usage analysis (30 days ago)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - ANALYSIS_DAYS);
        startDate.setHours(0, 0, 0, 0);

        // Get usage data (KELUAR movements in last 30 days)
        const usageData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id'],
            where: {
                lpg_product_id: { not: null },
                movement_type: 'KELUAR',
                timestamp: { gte: startDate }
            },
            _sum: { qty: true }
        });

        // Get current stock movements
        const stockData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: {
                qty: true
            }
        });

        // Calculate current stock and identify low stock products using ROP logic
        const lowStockAlerts: {
            id: string;
            name: string;
            currentStock: number;
            threshold: number;
            severity: 'critical' | 'warning';
            recommendation: string;
        }[] = [];

        products.forEach(product => {
            const productStock = stockData.filter(s => s.lpg_product_id === product.id);
            const inQty = productStock.find(s => s.movement_type === 'MASUK')?._sum.qty || 0;
            const outQty = productStock.find(s => s.movement_type === 'KELUAR')?._sum.qty || 0;
            const currentStock = inQty - outQty;

            // Calculate ROP (same logic as getReorderPoint)
            const usage = usageData.find(u => u.lpg_product_id === product.id);
            const totalUsage = usage?._sum.qty || 0;
            const avgDailyDemand = totalUsage / ANALYSIS_DAYS;
            const safetyStock = Math.ceil(avgDailyDemand * LEAD_TIME_DAYS * 0.5);
            const reorderPoint = Math.ceil((avgDailyDemand * LEAD_TIME_DAYS) + safetyStock);

            // Use ROP-based threshold (only alert if stock <= ROP)
            if (currentStock <= reorderPoint) {
                const severity = currentStock <= reorderPoint * 0.5 ? 'critical' : 'warning';
                const daysUntilStockout = avgDailyDemand > 0
                    ? Math.floor(currentStock / avgDailyDemand)
                    : 999;
                const suggestedOrderQty = Math.ceil(avgDailyDemand * 14 + safetyStock);

                lowStockAlerts.push({
                    id: product.id,
                    name: product.name,
                    currentStock,
                    threshold: reorderPoint,
                    severity,
                    recommendation: severity === 'critical'
                        ? `SEGERA pesan ${product.name}! Stok akan habis dalam ${daysUntilStockout} hari. Disarankan pesan ${suggestedOrderQty} unit.`
                        : `Pertimbangkan untuk memesan ${product.name} dalam 1-2 hari. Disarankan pesan ${suggestedOrderQty} unit.`
                });
            }
        });

        // ========== 2. PAYMENT OVERDUE ALERTS ==========
        const overdueDate = new Date();
        overdueDate.setDate(overdueDate.getDate() - OVERDUE_DAYS);

        // Query orders yang belum lunas dan sudah lewat OVERDUE_DAYS
        const overdueOrders = await this.prisma.client.orders.findMany({
            where: {
                order_date: {
                    lt: overdueDate
                },
                current_status: {
                    notIn: ['BATAL', 'SELESAI']
                },
                // Check payment via order_payment_details
                order_payment_details: {
                    is_paid: false
                }
            },
            include: {
                pangkalans: {
                    select: {
                        name: true
                    }
                },
                order_payment_details: {
                    select: {
                        amount_paid: true,
                        is_paid: true
                    }
                }
            },
            orderBy: {
                order_date: 'asc'
            },
            take: 10
        });

        const paymentOverdueAlerts = overdueOrders.map(order => {
            const daysOverdue = Math.floor((new Date().getTime() - new Date(order.order_date).getTime()) / (1000 * 60 * 60 * 24));
            const severity = daysOverdue > 14 ? 'critical' : 'warning';
            const amountPaid = Number(order.order_payment_details?.amount_paid) || 0;

            return {
                orderId: order.id,
                orderCode: order.code,
                pangkalanName: order.pangkalans?.name || 'Unknown',
                totalAmount: Number(order.total_amount),
                amountPaid: amountPaid,
                daysOverdue,
                severity,
                recommendation: severity === 'critical'
                    ? `Hubungi ${order.pangkalans?.name} segera untuk penagihan. Pembayaran tertunda ${daysOverdue} hari.`
                    : `Follow up pembayaran dari ${order.pangkalans?.name}. Sudah ${daysOverdue} hari belum lunas.`
            };
        });

        // ========== 3. PENDING ORDERS SUMMARY ==========
        const pendingOrdersCount = await this.prisma.client.orders.count({
            where: {
                current_status: {
                    in: ['DRAFT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES', 'SIAP_KIRIM']
                }
            }
        });

        const urgentOrdersCount = await this.prisma.client.orders.count({
            where: {
                current_status: {
                    in: ['SIAP_KIRIM', 'DIKIRIM']
                }
            }
        });

        // ========== 4. SUMMARY METRICS ==========
        const summary = {
            totalLowStockProducts: lowStockAlerts.length,
            criticalStockProducts: lowStockAlerts.filter(a => a.severity === 'critical').length,
            totalOverduePayments: paymentOverdueAlerts.length,
            criticalOverduePayments: paymentOverdueAlerts.filter(a => a.severity === 'critical').length,
            pendingOrdersCount,
            urgentOrdersCount,
            overallHealthScore: this.calculateHealthScore(lowStockAlerts.length, paymentOverdueAlerts.length, pendingOrdersCount)
        };

        return {
            lowStockAlerts,
            paymentOverdueAlerts,
            summary,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Calculate overall operational health score (0-100)
     * Higher score = better health
     */
    private calculateHealthScore(lowStockCount: number, overdueCount: number, pendingCount: number): number {
        let score = 100;

        // Deduct points for low stock (max -30)
        score -= Math.min(lowStockCount * 10, 30);

        // Deduct points for overdue payments (max -40)
        score -= Math.min(overdueCount * 8, 40);

        // Deduct points for too many pending orders (max -30)
        if (pendingCount > 20) score -= Math.min((pendingCount - 20) * 2, 30);

        return Math.max(score, 0);
    }

    /**
     * Get Reorder Point Data for DSS
     * 
     * PENJELASAN:
     * Menghitung titik pemesanan ulang (Reorder Point) untuk setiap produk LPG.
     * Formula: ROP = (Average Daily Demand × Lead Time) + Safety Stock
     * 
     * - Average Daily Demand: Rata-rata penjualan per hari (30 hari terakhir)
     * - Lead Time: Waktu tunggu pengiriman dari SPBE (default 2 hari)
     * - Safety Stock: Stok pengaman (50% dari avg daily demand × lead time)
     */
    async getReorderPoint() {
        const LEAD_TIME_DAYS = 2; // Waktu tunggu pengiriman dari SPBE
        const ANALYSIS_DAYS = 30; // Periode analisis untuk rata-rata

        // Get all active products
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });

        // Get start date (30 days ago)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - ANALYSIS_DAYS);
        startDate.setHours(0, 0, 0, 0);

        // Get stock movements (KELUAR = usage/sales)
        const usageData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id'],
            where: {
                lpg_product_id: { not: null },
                movement_type: 'KELUAR',
                timestamp: { gte: startDate }
            },
            _sum: { qty: true }
        });

        // Get current stock for each product
        const stockData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: { qty: true }
        });

        const reorderData = products.map(product => {
            // Calculate current stock
            const productStock = stockData.filter(s => s.lpg_product_id === product.id);
            const inQty = productStock.find(s => s.movement_type === 'MASUK')?._sum.qty || 0;
            const outQty = productStock.find(s => s.movement_type === 'KELUAR')?._sum.qty || 0;
            const currentStock = inQty - outQty;

            // Calculate average daily demand
            const usage = usageData.find(u => u.lpg_product_id === product.id);
            const totalUsage = usage?._sum.qty || 0;
            const avgDailyDemand = totalUsage / ANALYSIS_DAYS;

            // Calculate Reorder Point
            const safetyStock = Math.ceil(avgDailyDemand * LEAD_TIME_DAYS * 0.5);
            const reorderPoint = Math.ceil((avgDailyDemand * LEAD_TIME_DAYS) + safetyStock);

            // Calculate days until stockout
            const daysUntilStockout = avgDailyDemand > 0
                ? Math.floor(currentStock / avgDailyDemand)
                : 999;

            // Determine status
            let status: 'critical' | 'warning' | 'safe' | 'overstocked';
            if (currentStock <= 0) {
                status = 'critical';
            } else if (currentStock <= reorderPoint * 0.5) {
                status = 'critical';
            } else if (currentStock <= reorderPoint) {
                status = 'warning';
            } else if (currentStock > reorderPoint * 3) {
                status = 'overstocked';
            } else {
                status = 'safe';
            }

            // Calculate suggested order quantity (EOQ simplified)
            // Order enough for 14 days of demand + safety stock
            const suggestedOrderQty = Math.ceil(avgDailyDemand * 14 + safetyStock);

            return {
                productId: product.id,
                productName: product.name,
                sizeKg: Number(product.size_kg),
                color: product.color,
                currentStock,
                avgDailyDemand: Math.round(avgDailyDemand * 10) / 10,
                reorderPoint,
                safetyStock,
                daysUntilStockout,
                suggestedOrderQty: suggestedOrderQty > 0 ? suggestedOrderQty : 0,
                status,
                needsReorder: currentStock <= reorderPoint,
                recommendation: this.getReorderRecommendation(status, product.name, daysUntilStockout, suggestedOrderQty)
            };
        });

        // Sort by urgency (critical first, then warning)
        reorderData.sort((a, b) => {
            const statusOrder = { critical: 0, warning: 1, safe: 2, overstocked: 3 };
            return statusOrder[a.status] - statusOrder[b.status];
        });

        return {
            data: reorderData,
            summary: {
                totalProducts: reorderData.length,
                needsReorderCount: reorderData.filter(r => r.needsReorder).length,
                criticalCount: reorderData.filter(r => r.status === 'critical').length,
                warningCount: reorderData.filter(r => r.status === 'warning').length,
                analysisSettings: {
                    leadTimeDays: LEAD_TIME_DAYS,
                    analysisPeriodDays: ANALYSIS_DAYS
                }
            },
            generatedAt: new Date().toISOString()
        };
    }

    private getReorderRecommendation(
        status: string,
        productName: string,
        daysUntilStockout: number,
        suggestedQty: number
    ): string {
        switch (status) {
            case 'critical':
                return `SEGERA pesan ${productName}! Stok akan habis dalam ${daysUntilStockout} hari. Disarankan pesan ${suggestedQty} unit.`;
            case 'warning':
                return `Pertimbangkan untuk memesan ${productName} dalam 1-2 hari. Disarankan pesan ${suggestedQty} unit.`;
            case 'overstocked':
                return `Stok ${productName} berlebih. Hentikan sementara pemesanan untuk produk ini.`;
            default:
                return `Stok ${productName} aman. Estimasi bertahan ${daysUntilStockout} hari lagi.`;
        }
    }

    /**
     * Get Sales Trend Analysis for DSS
     * 
     * PENJELASAN:
     * Menganalisis tren penjualan untuk mengidentifikasi:
     * - Peak demand days (hari dengan permintaan tertinggi)
     * - Growth rate (pertumbuhan penjualan)
     * - Weekly patterns (pola mingguan)
     * - Daily average sales
     */
    async getSalesTrend() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const ANALYSIS_WEEKS = 4; // Analisis 4 minggu terakhir
        const ANALYSIS_DAYS = ANALYSIS_WEEKS * 7;

        // Get start date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - ANALYSIS_DAYS);
        startDate.setHours(0, 0, 0, 0);

        // ========== 1. DAILY SALES DATA ==========
        const dailySales: { date: Date; dayOfWeek: number; sales: number; orderCount: number }[] = [];

        for (let i = ANALYSIS_DAYS - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const salesData = await this.prisma.client.orders.aggregate({
                where: {
                    order_date: { gte: date, lt: nextDay },
                    current_status: { not: 'BATAL' }
                },
                _sum: { total_amount: true },
                _count: { id: true }
            });

            dailySales.push({
                date,
                dayOfWeek: date.getDay(),
                sales: Number(salesData._sum.total_amount) || 0,
                orderCount: salesData._count.id || 0
            });
        }

        // ========== 2. CALCULATE WEEKLY PATTERN ==========
        const weeklyPattern: {
            day: string;
            dayIndex: number;
            avgSales: number;
            avgOrders: number;
            totalSales: number;
            occurrences: number;
        }[] = [];

        for (let i = 0; i < 7; i++) {
            const dayData = dailySales.filter(d => d.dayOfWeek === i);
            const totalSales = dayData.reduce((sum, d) => sum + d.sales, 0);
            const totalOrders = dayData.reduce((sum, d) => sum + d.orderCount, 0);
            const occurrences = dayData.length;

            weeklyPattern.push({
                day: days[i],
                dayIndex: i,
                avgSales: occurrences > 0 ? Math.round(totalSales / occurrences) : 0,
                avgOrders: occurrences > 0 ? Math.round((totalOrders / occurrences) * 10) / 10 : 0,
                totalSales,
                occurrences
            });
        }

        // ========== 3. FIND PEAK DAYS ==========
        const sortedByAvgSales = [...weeklyPattern].sort((a, b) => b.avgSales - a.avgSales);
        const peakDays = sortedByAvgSales.slice(0, 3).map(d => ({
            day: d.day,
            avgSales: d.avgSales,
            avgOrders: d.avgOrders
        }));
        const lowDays = sortedByAvgSales.slice(-2).map(d => ({
            day: d.day,
            avgSales: d.avgSales,
            avgOrders: d.avgOrders
        }));

        // ========== 4. CALCULATE GROWTH RATE ==========
        // Compare last 2 weeks vs previous 2 weeks
        const midPoint = Math.floor(dailySales.length / 2);
        const recentWeeks = dailySales.slice(midPoint);
        const previousWeeks = dailySales.slice(0, midPoint);

        const recentTotal = recentWeeks.reduce((sum, d) => sum + d.sales, 0);
        const previousTotal = previousWeeks.reduce((sum, d) => sum + d.sales, 0);

        let growthRate = 0;
        if (previousTotal > 0) {
            growthRate = Math.round(((recentTotal - previousTotal) / previousTotal) * 100 * 10) / 10;
        }

        // ========== 5. OVERALL STATISTICS ==========
        const totalSalesAll = dailySales.reduce((sum, d) => sum + d.sales, 0);
        const totalOrdersAll = dailySales.reduce((sum, d) => sum + d.orderCount, 0);
        const avgDailySales = Math.round(totalSalesAll / ANALYSIS_DAYS);
        const avgDailyOrders = Math.round((totalOrdersAll / ANALYSIS_DAYS) * 10) / 10;

        // ========== 6. LAST 7 DAYS FOR CHART ==========
        const last7Days = dailySales.slice(-7).map(d => ({
            date: d.date.toISOString().split('T')[0],
            day: days[d.dayOfWeek],
            sales: d.sales,
            orderCount: d.orderCount
        }));

        // ========== 7. WEEKLY SUMMARY (last 4 weeks) ==========
        const weeklySummary: { week: string; sales: number; orders: number; avgDaily: number }[] = [];
        for (let w = 0; w < ANALYSIS_WEEKS; w++) {
            const weekStart = w * 7;
            const weekEnd = weekStart + 7;
            const weekData = dailySales.slice(weekStart, weekEnd);
            const weekSales = weekData.reduce((sum, d) => sum + d.sales, 0);
            const weekOrders = weekData.reduce((sum, d) => sum + d.orderCount, 0);

            weeklySummary.push({
                week: `Minggu ${ANALYSIS_WEEKS - w}`,
                sales: weekSales,
                orders: weekOrders,
                avgDaily: Math.round(weekSales / 7)
            });
        }

        // ========== 8. TREND INSIGHTS ==========
        const insights: string[] = [];

        // Growth insight
        if (growthRate > 10) {
            insights.push(`📈 Penjualan meningkat ${growthRate}% dibanding 2 minggu sebelumnya!`);
        } else if (growthRate < -10) {
            insights.push(`📉 Penjualan menurun ${Math.abs(growthRate)}% dibanding 2 minggu sebelumnya.`);
        } else {
            insights.push(`📊 Penjualan stabil (${growthRate > 0 ? '+' : ''}${growthRate}%) dibanding sebelumnya.`);
        }

        // Peak day insight
        if (peakDays.length > 0) {
            insights.push(`🔥 Hari tersibuk: ${peakDays[0].day} dengan rata-rata Rp ${peakDays[0].avgSales.toLocaleString('id-ID')}/hari.`);
        }

        // Low day insight
        if (lowDays.length > 0) {
            insights.push(`💤 Hari paling sepi: ${lowDays[0].day}.`);
        }

        return {
            weeklyPattern,
            peakDays,
            lowDays,
            last7Days,
            weeklySummary: weeklySummary.reverse(), // Oldest first
            statistics: {
                totalSales: totalSalesAll,
                totalOrders: totalOrdersAll,
                avgDailySales,
                avgDailyOrders,
                growthRate,
                analysisPeriodDays: ANALYSIS_DAYS
            },
            insights,
            generatedAt: new Date().toISOString()
        };
    }
}
