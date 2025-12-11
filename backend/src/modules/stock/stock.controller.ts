import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole, LpgType, StockMovementType } from '@prisma/client';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.OPERATOR) // Both ADMIN and OPERATOR can access
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @Get('summary')
    async getSummary() {
        const data = await this.stockService.getSummary();
        return { success: true, data };
    }

    @Post('movement')
    async recordMovement(
        @Body() body: {
            pangkalanId: string;
            lpgType: LpgType;
            movementType: StockMovementType;
            qty: number;
            note?: string;
        },
    ) {
        const data = await this.stockService.recordMovement(body);
        return { success: true, data };
    }

    @Get('history')
    async getHistory(
        @Query('lpgType') lpgType?: LpgType,
        @Query('movementType') movementType?: StockMovementType,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string,
    ) {
        const data = await this.stockService.getHistory({
            lpgType,
            movementType,
            startDate,
            endDate,
            limit: limit ? parseInt(limit) : 50,
        });
        return { success: true, data };
    }
}
