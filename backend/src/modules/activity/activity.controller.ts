import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @Get()
    async findAll(
        @Query('type') type?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string,
    ) {
        const data = await this.activityService.findAll({
            type,
            startDate,
            endDate,
            limit: limit ? parseInt(limit) : 50,
        });
        return { success: true, data };
    }
}
