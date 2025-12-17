import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ConsumerOrderService } from './consumer-order.service';
import { CreateConsumerOrderDto, UpdateConsumerOrderDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role } from '@prisma/client';

/**
 * ConsumerOrderController
 * 
 * Controller untuk mengelola penjualan LPG dari pangkalan ke konsumen.
 * Hanya bisa diakses oleh user dengan role PANGKALAN.
 * 
 * PENJELASAN:
 * - Endpoint ini untuk mencatat penjualan ke konsumen (warung, ibu-ibu, dll)
 * - pangkalan_id diambil dari JWT token untuk multi-tenant security
 */
@Controller('consumer-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(user_role.PANGKALAN)
export class ConsumerOrderController {
    constructor(private readonly consumerOrderService: ConsumerOrderService) { }

    /**
     * Get all consumer orders
     * GET /consumer-orders?page=1&limit=10&startDate=2024-01-01&paymentStatus=HUTANG
     */
    @Get()
    findAll(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('paymentStatus') paymentStatus?: string,
        @Query('consumerId') consumerId?: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.findAll(
            pangkalanId,
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            { startDate, endDate, paymentStatus, consumerId },
        );
    }

    /**
     * Get sales stats for dashboard
     * GET /consumer-orders/stats?today=true
     */
    @Get('stats')
    getStats(
        @Req() req: any,
        @Query('today') today?: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        const todayOnly = today === 'true';
        return this.consumerOrderService.getStats(pangkalanId, todayOnly);
    }

    /**
     * Get recent sales for dashboard
     * GET /consumer-orders/recent
     */
    @Get('recent')
    getRecentSales(
        @Req() req: any,
        @Query('limit') limit?: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.getRecentSales(
            pangkalanId,
            limit ? parseInt(limit, 10) : 5,
        );
    }

    /**
     * Get single consumer order
     * GET /consumer-orders/:id
     */
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.findOne(id, pangkalanId);
    }

    /**
     * Create new consumer order (record a sale)
     * POST /consumer-orders
     */
    @Post()
    create(@Body() dto: CreateConsumerOrderDto, @Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.create(pangkalanId, dto);
    }

    /**
     * Update consumer order
     * PUT /consumer-orders/:id
     */
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateConsumerOrderDto,
        @Req() req: any,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.update(id, pangkalanId, dto);
    }

    /**
     * Delete consumer order
     * DELETE /consumer-orders/:id
     */
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.remove(id, pangkalanId);
    }
}
