import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        todayOrders: number;
        todaySales: number;
        pendingOrders: number;
        completedOrders: number;
        totalStock: Record<string, number>;
        dynamicProducts: {
            id: string;
            name: string;
            size_kg: number;
            category: import("@prisma/client").$Enums.lpg_category;
            color: string | null;
            price: number;
            stock: {
                in: number;
                out: number;
                current: number;
            };
        }[];
    }>;
    getSalesChart(): Promise<{
        data: {
            day: string;
            sales: number;
        }[];
    }>;
    getStockChart(): Promise<{
        products: {
            id: string;
            name: string;
            color: string;
        }[];
        data: Record<string, any>[];
    }>;
    getProfitChart(): Promise<{
        data: {
            day: string;
            profit: number;
            totalSales: number;
            totalCost: number;
            orderCount: number;
        }[];
    }>;
    getTopPangkalan(): Promise<{
        data: {
            name: string;
            value: number;
        }[];
    }>;
    getStockConsumption(): Promise<{
        data: {
            day: string;
            lpg3kg: number;
            lpg12kg: number;
            lpg50kg: number;
        }[];
    }>;
    getRecentActivities(): Promise<{
        data: {
            id: string;
            action: string;
            title: string;
            description: string | null;
            timestamp: Date;
            user: string;
        }[];
    }>;
}
