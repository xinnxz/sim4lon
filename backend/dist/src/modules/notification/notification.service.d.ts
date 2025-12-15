import { PrismaService } from '../../prisma';
export interface Notification {
    id: string;
    type: 'order_new' | 'stock_low' | 'stock_critical' | 'stock_out';
    title: string;
    message: string;
    icon: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    link?: string;
    time: string;
    created_at: Date;
}
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotifications(limit?: number): Promise<{
        notifications: Notification[];
        unread_count: number;
    }>;
    private calculateStockAlerts;
    private formatTimeAgo;
}
