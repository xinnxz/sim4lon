import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole, StatusPesanan } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: StatusPesanan,
        @Query('pangkalanId') pangkalanId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const result = await this.orderService.findAll({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            status,
            pangkalanId,
            startDate,
            endDate,
        });
        return { success: true, ...result };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const data = await this.orderService.findOne(id);
        return { success: true, data };
    }

    @Post()
    async create(@Body() body: any) {
        const data = await this.orderService.create(body);
        return { success: true, data };
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: { status: StatusPesanan; description?: string }) {
        const data = await this.orderService.updateStatus(id, body);
        return { success: true, data };
    }

    @Patch(':id/assign-driver')
    async assignDriver(@Param('id') id: string, @Body() body: { driverId: string }) {
        const data = await this.orderService.assignDriver(id, body.driverId);
        return { success: true, data };
    }
}
