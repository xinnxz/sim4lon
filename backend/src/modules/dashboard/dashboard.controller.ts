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

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
     * GET /api/dashboard/top-pangkalan?limit=3
     * 
     * Top pangkalan dengan order terbanyak untuk pie chart
     * @param limit - default 3, max 100
     */
    @Get('top-pangkalan')
    async getTopPangkalan(@Query('limit') limit?: string) {
        const numLimit = parseInt(limit || '3', 10);
        return this.dashboardService.getTopPangkalan(isNaN(numLimit) ? 3 : numLimit);
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

    /**
     * GET /api/dashboard/dss-alerts
     * 
     * Decision Support System Alerts:
     * - Low Stock Alerts (products below threshold)
     * - Payment Overdue Alerts (unpaid orders > 7 days)
     * - Operational Health Score
     */
    @Get('dss-alerts')
    async getDSSAlerts() {
        return this.dashboardService.getDSSAlerts();
    }

    /**
     * GET /api/dashboard/reorder-point
     * 
     * DSS Feature: Reorder Point Calculator
     * Menghitung kapan dan berapa jumlah yang harus dipesan ulang
     */
    @Get('reorder-point')
    async getReorderPoint() {
        return this.dashboardService.getReorderPoint();
    }

    /**
     * GET /api/dashboard/sales-trend
     * 
     * DSS Feature: Sales Trend Analysis
     * Menganalisis pola penjualan dan mengidentifikasi peak days
     */
    @Get('sales-trend')
    async getSalesTrend() {
        return this.dashboardService.getSalesTrend();
    }
}
