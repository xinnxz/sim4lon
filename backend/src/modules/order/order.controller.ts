import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { status_pesanan } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: status_pesanan,
        @Query('pangkalan_id') pangkalanId?: string,
        @Query('driver_id') driverId?: string,
        @Query('sort_by') sortBy?: 'created_at' | 'total_amount' | 'code' | 'current_status' | 'pangkalan_name',
        @Query('sort_order') sortOrder?: 'asc' | 'desc',
    ) {
        return this.orderService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            status,
            pangkalanId,
            driverId,
            sortBy || 'created_at',
            sortOrder || 'desc',
        );
    }

    @Get('stats')
    getStats(@Query('today') today?: string) {
        const todayOnly = today === 'true';
        return this.orderService.getStats(todayOnly);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.orderService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
        return this.orderService.update(id, dto);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.orderService.updateStatus(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderService.remove(id);
    }
}
