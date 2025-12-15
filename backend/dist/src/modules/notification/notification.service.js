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
const LOW_STOCK_THRESHOLD = 50;
const CRITICAL_STOCK_THRESHOLD = 10;
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
        const stockData = await this.prisma.stock_histories.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: {
                lpg_type: { not: null },
            },
            _sum: {
                qty: true,
            },
        });
        const stockSummary = {};
        for (const data of stockData) {
            const type = data.lpg_type;
            if (!type)
                continue;
            if (!stockSummary[type]) {
                stockSummary[type] = 0;
            }
            if (data.movement_type === 'MASUK') {
                stockSummary[type] += data._sum.qty || 0;
            }
            else {
                stockSummary[type] -= data._sum.qty || 0;
            }
        }
        for (const [type, currentStock] of Object.entries(stockSummary)) {
            const productName = this.getProductName(type);
            if (currentStock <= 0) {
                alerts.push({
                    id: `stock-out-${type}`,
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
                    id: `stock-critical-${type}`,
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
                    id: `stock-low-${type}`,
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
    getProductName(lpgType) {
        const names = {
            'LPG_3KG': 'LPG 3kg Subsidi',
            'LPG_5KG': 'LPG 5.5kg',
            'LPG_12KG': 'LPG 12kg',
            'LPG_50KG': 'LPG 50kg',
            'BRIGHT_GAS_5KG': 'Bright Gas 5.5kg',
            'BRIGHT_GAS_12KG': 'Bright Gas 12kg',
        };
        return names[lpgType] || lpgType;
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