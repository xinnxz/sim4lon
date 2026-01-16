/**
 * Notification Controller
 * 
 * PENJELASAN:
 * API endpoint untuk notifikasi dengan pagination
 * GET /notifications - Get all notifications with pagination
 */

import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    async getNotifications(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('type') type?: string,
    ) {
        const parsedPage = page ? parseInt(page, 10) : 1;
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        return this.notificationService.getNotifications(parsedPage, parsedLimit, type);
    }
}
