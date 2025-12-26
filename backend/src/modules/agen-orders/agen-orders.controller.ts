import {
    Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AgenOrdersService } from './agen-orders.service';
import { CreateAgenOrderDto, ReceiveAgenOrderDto } from './dto';

/**
 * AgenOrdersController - API endpoints untuk pesanan LPG dari pangkalan ke agen
 * 
 * PANGKALAN Endpoints:
 * - GET /agen-orders - List orders for this pangkalan
 * - POST /agen-orders - Create new order
 * - PATCH /agen-orders/:id/receive - Receive order
 * - PATCH /agen-orders/:id/cancel - Cancel order
 * 
 * AGEN (ADMIN/OPERATOR) Endpoints:
 * - GET /agen-orders/agen/all - List all orders from all pangkalan
 * - GET /agen-orders/agen/stats - Get overall statistics
 * - PATCH /agen-orders/agen/:id/confirm - Confirm order (PENDING -> DIKIRIM)
 * - PATCH /agen-orders/agen/:id/complete - Complete order (DIKIRIM -> DITERIMA)
 */
@Controller('agen-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgenOrdersController {
    constructor(private readonly ordersService: AgenOrdersService) { }

    // =========================================
    // AGEN (ADMIN/OPERATOR) ENDPOINTS
    // =========================================

    /**
     * GET /agen-orders/agen/all - Get all orders for agen view
     */
    @Get('agen/all')
    @Roles('ADMIN', 'OPERATOR')
    async findAllForAgen(@Query('status') status?: string) {
        return this.ordersService.findAllForAgen(status);
    }

    /**
     * GET /agen-orders/agen/stats - Get overall order stats for agen
     */
    @Get('agen/stats')
    @Roles('ADMIN', 'OPERATOR')
    async getStatsForAgen() {
        return this.ordersService.getStatsForAgen();
    }

    /**
     * PATCH /agen-orders/agen/:id/confirm - Confirm order (PENDING -> DIKIRIM)
     */
    @Patch('agen/:id/confirm')
    @Roles('ADMIN', 'OPERATOR')
    async confirmOrder(@Param('id') id: string) {
        return this.ordersService.confirmOrder(id);
    }

    /**
     * PATCH /agen-orders/agen/:id/complete - Complete order (DIKIRIM -> DITERIMA)
     */
    @Patch('agen/:id/complete')
    @Roles('ADMIN', 'OPERATOR')
    async completeOrder(@Param('id') id: string, @Body() dto: ReceiveAgenOrderDto) {
        return this.ordersService.completeOrder(id, dto);
    }

    /**
     * PATCH /agen-orders/agen/:id/cancel - Cancel order from agen side
     */
    @Patch('agen/:id/cancel')
    @Roles('ADMIN', 'OPERATOR')
    async cancelFromAgen(@Param('id') id: string) {
        return this.ordersService.cancelFromAgen(id);
    }

    // =========================================
    // PANGKALAN ENDPOINTS
    // =========================================

    /**
     * GET /agen-orders - Get all orders for pangkalan
     */
    @Get()
    @Roles('PANGKALAN')
    async findAll(
        @Req() req: any,
        @Query('status') status?: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.findAll(pangkalanId, status);
    }

    /**
     * GET /agen-orders/stats - Get order statistics
     */
    @Get('stats')
    @Roles('PANGKALAN')
    async getStats(@Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.getStats(pangkalanId);
    }

    /**
     * GET /agen-orders/:id - Get single order
     */
    @Get(':id')
    @Roles('PANGKALAN')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.findOne(id, pangkalanId);
    }

    /**
     * POST /agen-orders - Create new order to agen
     */
    @Post()
    @Roles('PANGKALAN')
    async create(@Req() req: any, @Body() dto: CreateAgenOrderDto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.create(pangkalanId, dto);
    }

    /**
     * PATCH /agen-orders/:id/receive - Receive order and update stock
     */
    @Patch(':id/receive')
    @Roles('PANGKALAN')
    async receive(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: ReceiveAgenOrderDto,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.receive(id, pangkalanId, dto);
    }

    /**
     * PATCH /agen-orders/:id/cancel - Cancel order
     */
    @Patch(':id/cancel')
    @Roles('PANGKALAN')
    async cancel(@Req() req: any, @Param('id') id: string) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.cancel(id, pangkalanId);
    }
}

