/**
 * Notification Controller
 * 
 * PENJELASAN:
 * API endpoint untuk notifikasi
 * GET /notifications - Get all notifications
 */

import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    async getNotifications(@Query('limit') limit?: string) {
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        return this.notificationService.getNotifications(parsedLimit);
    }
}
