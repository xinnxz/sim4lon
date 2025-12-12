import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityLogDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { user_role } from '@prisma/client';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('type') type?: string,
        @Query('user_id') userId?: string,
    ) {
        return this.activityService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 20,
            type,
            userId,
        );
    }

    @Get('recent')
    getRecent(@Query('limit') limit?: string) {
        return this.activityService.getRecent(limit ? parseInt(limit, 10) : 10);
    }

    @Get('by-type')
    getByType(
        @Query('type') type: string,
        @Query('limit') limit?: string,
    ) {
        return this.activityService.getByType(type, limit ? parseInt(limit, 10) : 20);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    create(@Body() dto: CreateActivityLogDto) {
        return this.activityService.create(dto);
    }
}
