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
 * Endpoints:
 * - GET /agen-orders - List all orders
 * - GET /agen-orders/stats - Get order statistics
 * - GET /agen-orders/:id - Get single order
 * - POST /agen-orders - Create new order
 * - PATCH /agen-orders/:id/receive - Receive order & update stock
 * - PATCH /agen-orders/:id/cancel - Cancel order
 */
@Controller('agen-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PANGKALAN')
export class AgenOrdersController {
    constructor(private readonly ordersService: AgenOrdersService) { }

    /**
     * GET /agen-orders - Get all orders for pangkalan
     */
    @Get()
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
    async getStats(@Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.getStats(pangkalanId);
    }

    /**
     * GET /agen-orders/:id - Get single order
     */
    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.findOne(id, pangkalanId);
    }

    /**
     * POST /agen-orders - Create new order to agen
     */
    @Post()
    async create(@Req() req: any, @Body() dto: CreateAgenOrderDto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.create(pangkalanId, dto);
    }

    /**
     * PATCH /agen-orders/:id/receive - Receive order and update stock
     */
    @Patch(':id/receive')
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
    async cancel(@Req() req: any, @Param('id') id: string) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.cancel(id, pangkalanId);
    }
}
