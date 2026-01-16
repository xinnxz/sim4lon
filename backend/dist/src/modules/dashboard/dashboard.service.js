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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const timezone_util_1 = require("../../common/utils/timezone.util");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const today = (0, timezone_util_1.todayWIB)();
        const todayOrders = await this.prisma.client.orders.count({
            where: {
                order_date: { gte: today },
            },
        });
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
        const pendingOrders = await this.prisma.client.orders.count({
            where: {
                current_status: {
                    in: ['DRAFT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES', 'SIAP_KIRIM'],
                },
            },
        });
        const completedOrders = await this.prisma.client.orders.count({
            where: {
                current_status: 'SELESAI',
                order_date: { gte: today },
            },
        });
        const stockSummary = await this.getStockSummary();
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
    async getStockSummary() {
        const stockHistory = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: {
                lpg_type: { not: null }
            },
            _sum: {
                qty: true,
            },
        });
        const summary = {
            kg3: 0,
            kg12: 0,
            kg50: 0,
        };
        stockHistory.forEach((item) => {
            const lpgType = item.lpg_type;
            if (!lpgType)
                return;
            const qty = item._sum.qty || 0;
            if (item.movement_type === 'MASUK') {
                summary[lpgType] = (summary[lpgType] || 0) + qty;
            }
            else {
                summary[lpgType] = (summary[lpgType] || 0) - qty;
            }
        });
        return summary;
    }
    async getDynamicProductsStock() {
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });
        const stockData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: {
                qty: true
            }
        });
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
                price: Number(product.selling_price) || 0,
                stock: {
                    in: inQty,
                    out: outQty,
                    current: inQty - outQty
                }
            };
        });
    }
    async getSalesChart() {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const date = (0, timezone_util_1.nowWIB)();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const salesData = await this.prisma.client.orders.aggregate({
                where: {
                    order_date: {
                        gte: date,
                        lt: nextDay,
                    },
                    current_status: { not: 'BATAL' },
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
    async getStockChart() {
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = (0, timezone_util_1.nowWIB)();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const movements = await this.prisma.client.stock_histories.groupBy({
                by: ['lpg_product_id'],
                where: {
                    timestamp: { gte: date, lt: nextDay },
                    lpg_product_id: { not: null },
                    movement_type: 'KELUAR'
                },
                _sum: { qty: true }
            });
            const dayData = { day: dayNames[date.getDay()] };
            products.forEach(p => {
                const movement = movements.find(m => m.lpg_product_id === p.id);
                dayData[p.id] = movement?._sum.qty || 0;
            });
            days.push(dayData);
        }
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
    mapColorName(colorName) {
        if (!colorName)
            return null;
        const colorMap = {
            'hijau': '#22c55e',
            'green': '#22c55e',
            'standard': '#22c55e',
            'biru': '#38bdf8',
            'blue': '#38bdf8',
            'ungu': '#a855f7',
            'purple': '#a855f7',
            'violet': '#a855f7',
            'pink': '#ec4899',
            'magenta': '#ec4899',
            'merah': '#dc2626',
            'red': '#dc2626',
            'kuning': '#eab308',
            'yellow': '#eab308',
            'orange': '#f97316',
        };
        return colorMap[colorName.toLowerCase()] || null;
    }
    async getProfitChart() {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const result = [];
        const products = await this.prisma.lpg_products.findMany({
            where: { is_active: true, deleted_at: null }
        });
        const costPriceMap = {};
        products.forEach(p => {
            const sizeKg = Number(p.size_kg);
            const cost = Number(p.cost_price) || 0;
            if (sizeKg === 3) {
                costPriceMap['kg3'] = cost;
                costPriceMap['3kg'] = cost;
            }
            else if (sizeKg === 5.5) {
                costPriceMap['kg5'] = cost;
                costPriceMap['5kg'] = cost;
                costPriceMap['5.5kg'] = cost;
            }
            else if (sizeKg === 12) {
                costPriceMap['kg12'] = cost;
                costPriceMap['12kg'] = cost;
            }
            else if (sizeKg === 50) {
                costPriceMap['kg50'] = cost;
                costPriceMap['50kg'] = cost;
            }
            else if (sizeKg <= 0.5) {
                costPriceMap['gr220'] = cost;
                costPriceMap['220gr'] = cost;
            }
        });
        for (let i = 6; i >= 0; i--) {
            const date = (0, timezone_util_1.nowWIB)();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
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
        const result = await Promise.all(pangkalanOrders.map(async (item) => {
            const pangkalan = await this.prisma.client.pangkalans.findUnique({
                where: { id: item.pangkalan_id },
                select: { name: true },
            });
            return {
                name: pangkalan?.name || 'Unknown',
                value: item._count.id,
            };
        }));
        return { data: result };
    }
    async getStockConsumption() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const date = (0, timezone_util_1.nowWIB)();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
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
            const dayData = {
                day: days[date.getDay()],
                lpg3kg: 0,
                lpg12kg: 0,
                lpg50kg: 0,
            };
            movements.forEach((m) => {
                const lpgType = String(m.lpg_type);
                if (lpgType === 'kg3')
                    dayData.lpg3kg = m._sum.qty || 0;
                if (lpgType === 'kg12')
                    dayData.lpg12kg = m._sum.qty || 0;
                if (lpgType === 'kg50')
                    dayData.lpg50kg = m._sum.qty || 0;
            });
            result.push(dayData);
        }
        return { data: result };
    }
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
    async getDSSAlerts() {
        const LEAD_TIME_DAYS = 2;
        const ANALYSIS_DAYS = 30;
        const OVERDUE_DAYS = 1;
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });
        const startDate = (0, timezone_util_1.nowWIB)();
        startDate.setDate(startDate.getDate() - ANALYSIS_DAYS);
        startDate.setHours(0, 0, 0, 0);
        const usageData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id'],
            where: {
                lpg_product_id: { not: null },
                movement_type: 'KELUAR',
                timestamp: { gte: startDate }
            },
            _sum: { qty: true }
        });
        const stockData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: {
                qty: true
            }
        });
        const lowStockAlerts = [];
        products.forEach(product => {
            const productStock = stockData.filter(s => s.lpg_product_id === product.id);
            const inQty = productStock.find(s => s.movement_type === 'MASUK')?._sum.qty || 0;
            const outQty = productStock.find(s => s.movement_type === 'KELUAR')?._sum.qty || 0;
            const currentStock = inQty - outQty;
            const usage = usageData.find(u => u.lpg_product_id === product.id);
            const totalUsage = usage?._sum.qty || 0;
            const avgDailyDemand = totalUsage / ANALYSIS_DAYS;
            const safetyStock = Math.ceil(avgDailyDemand * LEAD_TIME_DAYS * 0.5);
            const reorderPoint = Math.ceil((avgDailyDemand * LEAD_TIME_DAYS) + safetyStock);
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
        const overdueDate = (0, timezone_util_1.nowWIB)();
        overdueDate.setDate(overdueDate.getDate() - OVERDUE_DAYS);
        const overdueOrders = await this.prisma.client.orders.findMany({
            where: {
                order_date: {
                    lt: overdueDate
                },
                current_status: {
                    notIn: ['BATAL', 'SELESAI']
                },
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
            const daysOverdue = Math.floor(((0, timezone_util_1.nowWIB)().getTime() - new Date(order.order_date).getTime()) / (1000 * 60 * 60 * 24));
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
    calculateHealthScore(lowStockCount, overdueCount, pendingCount) {
        let score = 100;
        score -= Math.min(lowStockCount * 10, 30);
        score -= Math.min(overdueCount * 8, 40);
        if (pendingCount > 20)
            score -= Math.min((pendingCount - 20) * 2, 30);
        return Math.max(score, 0);
    }
    async getReorderPoint() {
        const LEAD_TIME_DAYS = 2;
        const ANALYSIS_DAYS = 30;
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });
        const startDate = (0, timezone_util_1.nowWIB)();
        startDate.setDate(startDate.getDate() - ANALYSIS_DAYS);
        startDate.setHours(0, 0, 0, 0);
        const usageData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id'],
            where: {
                lpg_product_id: { not: null },
                movement_type: 'KELUAR',
                timestamp: { gte: startDate }
            },
            _sum: { qty: true }
        });
        const stockData = await this.prisma.client.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: { qty: true }
        });
        const reorderData = products.map(product => {
            const productStock = stockData.filter(s => s.lpg_product_id === product.id);
            const inQty = productStock.find(s => s.movement_type === 'MASUK')?._sum.qty || 0;
            const outQty = productStock.find(s => s.movement_type === 'KELUAR')?._sum.qty || 0;
            const currentStock = inQty - outQty;
            const usage = usageData.find(u => u.lpg_product_id === product.id);
            const totalUsage = usage?._sum.qty || 0;
            const avgDailyDemand = totalUsage / ANALYSIS_DAYS;
            const safetyStock = Math.ceil(avgDailyDemand * LEAD_TIME_DAYS * 0.5);
            const reorderPoint = Math.ceil((avgDailyDemand * LEAD_TIME_DAYS) + safetyStock);
            const daysUntilStockout = avgDailyDemand > 0
                ? Math.floor(currentStock / avgDailyDemand)
                : 999;
            let status;
            if (currentStock <= 0) {
                status = 'critical';
            }
            else if (currentStock <= reorderPoint * 0.5) {
                status = 'critical';
            }
            else if (currentStock <= reorderPoint) {
                status = 'warning';
            }
            else if (currentStock > reorderPoint * 3) {
                status = 'overstocked';
            }
            else {
                status = 'safe';
            }
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
    getReorderRecommendation(status, productName, daysUntilStockout, suggestedQty) {
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
    async getSalesTrend() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const ANALYSIS_WEEKS = 4;
        const ANALYSIS_DAYS = ANALYSIS_WEEKS * 7;
        const startDate = (0, timezone_util_1.nowWIB)();
        startDate.setDate(startDate.getDate() - ANALYSIS_DAYS);
        startDate.setHours(0, 0, 0, 0);
        const dailySales = [];
        for (let i = ANALYSIS_DAYS - 1; i >= 0; i--) {
            const date = (0, timezone_util_1.nowWIB)();
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
        const weeklyPattern = [];
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
        const midPoint = Math.floor(dailySales.length / 2);
        const recentWeeks = dailySales.slice(midPoint);
        const previousWeeks = dailySales.slice(0, midPoint);
        const recentTotal = recentWeeks.reduce((sum, d) => sum + d.sales, 0);
        const previousTotal = previousWeeks.reduce((sum, d) => sum + d.sales, 0);
        let growthRate = 0;
        if (previousTotal > 0) {
            growthRate = Math.round(((recentTotal - previousTotal) / previousTotal) * 100 * 10) / 10;
        }
        const totalSalesAll = dailySales.reduce((sum, d) => sum + d.sales, 0);
        const totalOrdersAll = dailySales.reduce((sum, d) => sum + d.orderCount, 0);
        const avgDailySales = Math.round(totalSalesAll / ANALYSIS_DAYS);
        const avgDailyOrders = Math.round((totalOrdersAll / ANALYSIS_DAYS) * 10) / 10;
        const last7Days = dailySales.slice(-7).map(d => ({
            date: d.date.toISOString().split('T')[0],
            day: days[d.dayOfWeek],
            sales: d.sales,
            orderCount: d.orderCount
        }));
        const weeklySummary = [];
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
        const insights = [];
        if (growthRate > 10) {
            insights.push(`📈 Penjualan meningkat ${growthRate}% dibanding 2 minggu sebelumnya!`);
        }
        else if (growthRate < -10) {
            insights.push(`📉 Penjualan menurun ${Math.abs(growthRate)}% dibanding 2 minggu sebelumnya.`);
        }
        else {
            insights.push(`📊 Penjualan stabil (${growthRate > 0 ? '+' : ''}${growthRate}%) dibanding sebelumnya.`);
        }
        if (peakDays.length > 0) {
            insights.push(`🔥 Hari tersibuk: ${peakDays[0].day} dengan rata-rata Rp ${peakDays[0].avgSales.toLocaleString('id-ID')}/hari.`);
        }
        if (lowDays.length > 0) {
            insights.push(`💤 Hari paling sepi: ${lowDays[0].day}.`);
        }
        return {
            weeklyPattern,
            peakDays,
            lowDays,
            last7Days,
            weeklySummary: weeklySummary.reverse(),
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map