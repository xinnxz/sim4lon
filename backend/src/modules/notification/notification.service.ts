/**
 * Notification Service
 * 
 * PENJELASAN:
 * Menggabungkan notifikasi dari:
 * 1. Activity logs (pesanan baru)
 * 2. Pending agen orders (dari pangkalan)
 * 3. Stock alerts (calculated - stok menipis/habis)
 * 
 * Mendukung pagination untuk performa dengan banyak data
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

// Stock alert thresholds - sesuaikan sesuai kebutuhan
const LOW_STOCK_THRESHOLD = 250;  // Warning jika stok < 250
const CRITICAL_STOCK_THRESHOLD = 100;  // Critical jika stok < 100

export interface Notification {
    id: string;
    type: 'order_new' | 'agen_order' | 'stock_low' | 'stock_critical' | 'stock_out';
    title: string;
    message: string;
    icon: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    link?: string;
    time: string;
    created_at: Date;
    orderId?: string; // For agen_order type - reference to agen_orders.id
}

export interface PaginatedNotificationResponse {
    data: Notification[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        pendingCount: number;
        stockAlertCount: number;
    };
}

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async getNotifications(
        page = 1,
        limit = 10,
        type?: string
    ): Promise<PaginatedNotificationResponse> {
        const allNotifications: Notification[] = [];

        // 1. Get recent order activities
        const recentOrders = await this.prisma.activity_logs.findMany({
            where: {
                type: 'order_created',
            },
            take: 100, // Get more for filtering
            orderBy: { created_at: 'desc' },
            include: {
                orders: {
                    select: { code: true },
                },
            },
        });

        for (const activity of recentOrders) {
            allNotifications.push({
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

        // 2. Get pending orders from pangkalan (LANGSUNG dari agen_orders)
        const pendingAgenOrders = await this.prisma.agen_orders.findMany({
            where: {
                status: 'PENDING',
            },
            take: 100,
            orderBy: { order_date: 'desc' },
            include: {
                pangkalans: { select: { code: true, name: true } },
            },
        });

        for (const order of pendingAgenOrders) {
            allNotifications.push({
                id: `agen-order-${order.id}`,
                type: 'agen_order',
                title: `Pesanan Baru dari ${order.pangkalans?.name || 'Pangkalan'}`,
                message: `${order.pangkalans?.code || 'PKL'} memesan ${order.qty_ordered} tabung ${order.lpg_type || 'LPG'}`,
                icon: 'ShoppingCart',
                priority: 'high',
                link: '/pesanan-pangkalan',
                time: this.formatTimeAgo(order.order_date),
                created_at: order.order_date,
                orderId: order.id,
            });
        }

        // 3. Calculate stock alerts
        const stockAlerts = await this.calculateStockAlerts();
        allNotifications.push(...stockAlerts);

        // Sort by priority and created_at
        allNotifications.sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return b.created_at.getTime() - a.created_at.getTime();
        });

        // Filter by type if specified
        let filteredNotifications = allNotifications;
        if (type && type !== 'all') {
            if (type === 'pending') {
                filteredNotifications = allNotifications.filter(n => n.type === 'agen_order');
            } else if (type === 'stock') {
                filteredNotifications = allNotifications.filter(n => n.type.startsWith('stock_'));
            } else if (type === 'order') {
                filteredNotifications = allNotifications.filter(n => n.type === 'order_new');
            } else {
                filteredNotifications = allNotifications.filter(n => n.type === type);
            }
        }

        // Calculate counts for stats
        const pendingCount = allNotifications.filter(n => n.type === 'agen_order').length;
        const stockAlertCount = allNotifications.filter(n => n.type.startsWith('stock_')).length;

        // Pagination
        const total = filteredNotifications.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredNotifications.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            meta: {
                total,
                page,
                limit,
                totalPages,
                pendingCount,
                stockAlertCount,
            },
        };
    }

    private async calculateStockAlerts(): Promise<Notification[]> {
        const alerts: Notification[] = [];

        // Get all active LPG products
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

        // Calculate stock for each product from stock_histories
        for (const product of products) {
            // Get stock movements for this product
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
                } else {
                    totalOut = data._sum.qty || 0;
                }
            }

            const currentStock = totalIn - totalOut;
            const productName = product.name;

            // Generate alerts based on stock levels
            if (currentStock <= 0) {
                alerts.push({
                    id: `stock-out-${product.id}`,
                    type: 'stock_out',
                    title: 'Stok Habis!',
                    message: `${productName} HABIS! Segera lakukan restock.`,
                    icon: 'AlertOctagon',
                    priority: 'critical',
                    link: '/stok-lpg',
                    time: 'Sekarang',
                    created_at: new Date(),
                });
            } else if (currentStock < CRITICAL_STOCK_THRESHOLD) {
                alerts.push({
                    id: `stock-critical-${product.id}`,
                    type: 'stock_critical',
                    title: 'Stok Kritis!',
                    message: `${productName} tersisa ${currentStock} tabung`,
                    icon: 'AlertTriangle',
                    priority: 'high',
                    link: '/stok-lpg',
                    time: 'Sekarang',
                    created_at: new Date(),
                });
            } else if (currentStock < LOW_STOCK_THRESHOLD) {
                alerts.push({
                    id: `stock-low-${product.id}`,
                    type: 'stock_low',
                    title: 'Stok Menipis',
                    message: `${productName} tersisa ${currentStock} tabung`,
                    icon: 'AlertCircle',
                    priority: 'medium',
                    link: '/stok-lpg',
                    time: 'Sekarang',
                    created_at: new Date(),
                });
            }
        }

        return alerts;
    }

    private formatTimeAgo(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;

        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
}
