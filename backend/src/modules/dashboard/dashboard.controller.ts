/**
 * Dashboard Controller
 * 
 * PENJELASAN:
 * Controller ini menangani semua endpoint untuk data dashboard.
 * Semua endpoint membutuhkan autentikasi (JWT token).
 * 
 * Endpoints:
 * GET /api/dashboard/stats     - KPI statistics
 * GET /api/dashboard/sales     - Sales chart data (7 days)
 * GET /api/dashboard/stock     - Stock trend data (7 days)
 * GET /api/dashboard/profit    - Profit chart data (7 days)
 * GET /api/dashboard/top-pangkalan - Top 5 pangkalan by orders
 * GET /api/dashboard/stock-consumption - Stock usage by LPG type
 * GET /api/dashboard/activities - Recent activities
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard) // Semua endpoint butuh login
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    /**
     * GET /api/dashboard/stats
     * 
     * Mengembalikan statistik KPI untuk dashboard cards:
     * - Total orders hari ini
     * - Orders pending
     * - Orders completed hari ini
     * - Total stock per LPG type
     */
    @Get('stats')
    async getStats() {
        return this.dashboardService.getStats();
    }

    /**
     * GET /api/dashboard/sales
     * 
     * Data penjualan 7 hari terakhir untuk line chart
     */
    @Get('sales')
    async getSalesChart() {
        return this.dashboardService.getSalesChart();
    }

    /**
     * GET /api/dashboard/stock
     * 
     * Trend stok 7 hari terakhir untuk line chart
     */
    @Get('stock')
    async getStockChart() {
        return this.dashboardService.getStockChart();
    }

    /**
     * GET /api/dashboard/profit
     * 
     * Data profit 7 hari terakhir untuk bar chart
     */
    @Get('profit')
    async getProfitChart() {
        return this.dashboardService.getProfitChart();
    }

    /**
     * GET /api/dashboard/top-pangkalan
     * 
     * Top 5 pangkalan dengan order terbanyak untuk pie chart
     */
    @Get('top-pangkalan')
    async getTopPangkalan() {
        return this.dashboardService.getTopPangkalan();
    }

    /**
     * GET /api/dashboard/stock-consumption
     * 
     * Pemakaian stok per LPG type (7 hari) untuk consumption chart
     */
    @Get('stock-consumption')
    async getStockConsumption() {
        return this.dashboardService.getStockConsumption();
    }

    /**
     * GET /api/dashboard/activities
     * 
     * 10 aktivitas terbaru
     */
    @Get('activities')
    async getRecentActivities() {
        return this.dashboardService.getRecentActivities();
    }
}
