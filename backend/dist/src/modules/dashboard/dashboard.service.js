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
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await this.prisma.client.orders.count({
            where: {
                created_at: { gte: today },
            },
        });
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
                updated_at: { gte: today },
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
            const date = new Date();
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
            let lpgTypeKey = '';
            if (sizeKg === 3)
                lpgTypeKey = 'kg3';
            else if (sizeKg === 5.5)
                lpgTypeKey = 'kg5';
            else if (sizeKg === 12)
                lpgTypeKey = 'kg12';
            else if (sizeKg === 50)
                lpgTypeKey = 'kg50';
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
            const date = new Date();
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map