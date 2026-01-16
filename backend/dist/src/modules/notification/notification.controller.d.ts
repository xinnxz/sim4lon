import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(page?: string, limit?: string, type?: string): Promise<import("./notification.service").PaginatedNotificationResponse>;
}
