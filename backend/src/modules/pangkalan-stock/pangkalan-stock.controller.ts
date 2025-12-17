import {
    Controller, Get, Post, Put, Body, Query, UseGuards, Req
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PangkalanStockService } from './pangkalan-stock.service';
import { ReceiveStockDto, AdjustStockDto, UpdateStockLevelsDto } from './dto';

/**
 * PangkalanStockController - API endpoints untuk manajemen stok pangkalan
 * 
 * Endpoints:
 * - GET /pangkalan-stocks - Get stock levels
 * - GET /pangkalan-stocks/movements - Get movement history
 * - POST /pangkalan-stocks/receive - Receive from agen
 * - POST /pangkalan-stocks/adjust - Stock opname
 * - PUT /pangkalan-stocks/levels - Update alert levels
 */
@Controller('pangkalan-stocks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PANGKALAN')
export class PangkalanStockController {
    constructor(private readonly stockService: PangkalanStockService) { }

    /**
     * GET /pangkalan-stocks - Get current stock levels
     */
    @Get()
    async getStockLevels(@Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.getStockLevels(pangkalanId);
    }

    /**
     * GET /pangkalan-stocks/movements - Get stock movement history
     */
    @Get('movements')
    async getMovements(
        @Req() req: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.getMovements(
            pangkalanId,
            startDate,
            endDate,
            limit ? parseInt(limit) : 50,
        );
    }

    /**
     * POST /pangkalan-stocks/receive - Receive stock from agen
     */
    @Post('receive')
    async receiveStock(@Req() req: any, @Body() dto: ReceiveStockDto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.receiveStock(pangkalanId, dto);
    }

    /**
     * POST /pangkalan-stocks/adjust - Stock opname adjustment
     */
    @Post('adjust')
    async adjustStock(@Req() req: any, @Body() dto: AdjustStockDto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.adjustStock(pangkalanId, dto);
    }

    /**
     * PUT /pangkalan-stocks/levels - Update stock alert levels
     */
    @Put('levels')
    async updateLevels(@Req() req: any, @Body() dto: UpdateStockLevelsDto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.updateLevels(pangkalanId, dto);
    }
}
