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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
const LOW_STOCK_THRESHOLD = 250;
const CRITICAL_STOCK_THRESHOLD = 100;
let NotificationService = class NotificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotifications(limit = 10) {
        const notifications = [];
        const recentOrders = await this.prisma.activity_logs.findMany({
            where: {
                type: 'order_created',
            },
            take: limit,
            orderBy: { created_at: 'desc' },
            include: {
                orders: {
                    select: { code: true },
                },
            },
        });
        for (const activity of recentOrders) {
            notifications.push({
                id: activity.id,
                type: 'order_new',
                title: 'Pesanan Baru',
                message: `${activity.title}${activity.pangkalan_name ? ` dari ${activity.pangkalan_name}` : ''}`,
                icon: 'ShoppingCart',
                priority: 'medium',
                link: activity.order_id ? `/detail-pesanan?id=${activity.order_id}` : undefined,
                time: this.formatTimeAgo(activity.created_at),
                created_at: activity.created_at,
            });
        }
        const pendingAgenOrders = await this.prisma.agen_orders.findMany({
            where: {
                status: 'PENDING',
            },
            take: limit,
            orderBy: { order_date: 'desc' },
            include: {
                pangkalans: { select: { code: true, name: true } },
            },
        });
        for (const order of pendingAgenOrders) {
            notifications.push({
                id: `agen-order-${order.id}`,
                type: 'agen_order',
                title: `Pesanan Baru dari ${order.pangkalans?.name || 'Pangkalan'}`,
                message: `${order.pangkalans?.code || 'PKL'} memesan ${order.qty_ordered} tabung LPG`,
                icon: 'ShoppingCart',
                priority: 'high',
                link: '/pesanan-pangkalan',
                time: this.formatTimeAgo(order.order_date),
                created_at: order.order_date,
                orderId: order.id,
            });
        }
        const stockAlerts = await this.calculateStockAlerts();
        notifications.push(...stockAlerts);
        notifications.sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return b.created_at.getTime() - a.created_at.getTime();
        });
        return {
            notifications: notifications.slice(0, limit),
            unread_count: notifications.length,
        };
    }
    async calculateStockAlerts() {
        const alerts = [];
        const products = await this.prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null,
            },
            select: {
                id: true,
                name: true,
            },
        });
        for (const product of products) {
            const stockData = await this.prisma.stock_histories.groupBy({
                by: ['movement_type'],
                where: {
                    lpg_product_id: product.id,
                },
                _sum: {
                    qty: true,
                },
            });
            let totalIn = 0;
            let totalOut = 0;
            for (const data of stockData) {
                if (data.movement_type === 'MASUK') {
                    totalIn = data._sum.qty || 0;
                }
                else {
                    totalOut = data._sum.qty || 0;
                }
            }
            const currentStock = totalIn - totalOut;
            const productName = product.name;
            if (currentStock <= 0) {
                alerts.push({
                    id: `stock-out-${product.id}`,
                    type: 'stock_out',
                    title: 'Stok Habis!',
                    message: `${productName} HABIS! Segera lakukan restock.`,
                    icon: 'AlertOctagon',
                    priority: 'critical',
                    link: '/ringkasan-stok',
                    time: 'Sekarang',
                    created_at: new Date(),
                });
            }
            else if (currentStock < CRITICAL_STOCK_THRESHOLD) {
                alerts.push({
                    id: `stock-critical-${product.id}`,
                    type: 'stock_critical',
                    title: 'Stok Kritis!',
                    message: `${productName} tersisa ${currentStock} tabung`,
                    icon: 'AlertTriangle',
                    priority: 'high',
                    link: '/ringkasan-stok',
                    time: 'Sekarang',
                    created_at: new Date(),
                });
            }
            else if (currentStock < LOW_STOCK_THRESHOLD) {
                alerts.push({
                    id: `stock-low-${product.id}`,
                    type: 'stock_low',
                    title: 'Stok Menipis',
                    message: `${productName} tersisa ${currentStock} tabung`,
                    icon: 'AlertCircle',
                    priority: 'medium',
                    link: '/ringkasan-stok',
                    time: 'Sekarang',
                    created_at: new Date(),
                });
            }
        }
        return alerts;
    }
    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffMins < 1)
            return 'Baru saja';
        if (diffMins < 60)
            return `${diffMins} menit lalu`;
        if (diffHours < 24)
            return `${diffHours} jam lalu`;
        if (diffDays < 7)
            return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map