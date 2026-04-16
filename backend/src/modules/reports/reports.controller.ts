/**
 * Reports Controller
 * 
 * PENJELASAN:
 * API endpoints untuk laporan:
 * GET /reports/sales - Laporan penjualan
 * GET /reports/pangkalan - Laporan analytics pangkalan & subsidi
 * GET /reports/pangkalan/:id/consumers - Detail konsumen subsidi per pangkalan
 * GET /reports/stock-movement - Laporan stok
 */

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    /**
     * Get sales report
     * Query params: startDate, endDate (ISO date strings)
     */
    @Get('sales')
    async getSalesReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const { start, end } = this.parseDateRange(startDate, endDate);
        return this.reportsService.getSalesReport(start, end);
    }

    /**
     * Get pangkalan analytics report
     * Shows performance stats and subsidi distribution per pangkalan
     */
    @Get('pangkalan')
    async getPangkalanReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const { start, end } = this.parseDateRange(startDate, endDate);
        return this.reportsService.getPangkalanReport(start, end);
    }

    /**
     * Get subsidi consumers for a specific pangkalan
     * For audit purposes - shows who bought subsidized LPG
     */
    @Get('pangkalan/:id/consumers')
    async getSubsidiConsumers(
        @Param('id') pangkalanId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const { start, end } = this.parseDateRange(startDate, endDate);
        return this.reportsService.getSubsidiConsumers(pangkalanId, start, end);
    }

    /**
     * Get stock movement report
     */
    @Get('stock-movement')
    async getStockMovementReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('productId') productId?: string,
    ) {
        const { start, end } = this.parseDateRange(startDate, endDate);
        return this.reportsService.getStockMovementReport(start, end, productId);
    }

    /**
     * Parse date range from query params
     * Default: current month
     */
    private parseDateRange(startDate?: string, endDate?: string) {
        const now = new Date();

        // Default to current month
        const start = startDate
            ? new Date(startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1);

        const end = endDate
            ? new Date(endDate)
            : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        return { start, end };
    }
}

