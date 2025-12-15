import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(limit?: string): Promise<{
        notifications: import("./notification.service").Notification[];
        unread_count: number;
    }>;
}
