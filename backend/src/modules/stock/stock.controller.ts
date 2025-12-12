import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, Roles } from '../auth/decorators';
import { lpg_type, stock_movement_type, user_role } from '@prisma/client';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @Get('history')
    getHistory(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('lpg_type') lpgType?: lpg_type,
        @Query('movement_type') movementType?: stock_movement_type,
    ) {
        return this.stockService.getHistory(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            lpgType,
            movementType,
        );
    }

    @Get('summary')
    getSummary() {
        return this.stockService.getSummary();
    }

    @Get('history/:lpgType')
    getHistoryByType(
        @Param('lpgType') lpgType: lpg_type,
        @Query('limit') limit?: string,
    ) {
        return this.stockService.getHistoryByType(
            lpgType,
            limit ? parseInt(limit, 10) : 20,
        );
    }

    @Post('movements')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    createMovement(
        @Body() dto: CreateStockMovementDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.stockService.createMovement(dto, userId);
    }
}
