import { PrismaService } from '../../prisma';
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
    orderId?: string;
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
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotifications(page?: number, limit?: number, type?: string): Promise<PaginatedNotificationResponse>;
    private calculateStockAlerts;
    private formatTimeAgo;
}
