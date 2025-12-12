import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        todayOrders: number;
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
    private getStockSummary;
    private getDynamicProductsStock;
    getSalesChart(): Promise<{
        data: {
            day: string;
            sales: number;
        }[];
    }>;
    getStockChart(): Promise<{
        data: {
            day: string;
            stock: number;
        }[];
    }>;
    getProfitChart(): Promise<{
        data: {
            day: string;
            profit: number;
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
