import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
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
    private getStockSummary;
    private getDynamicProductsStock;
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
    private mapColorName;
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
    getDSSAlerts(): Promise<{
        lowStockAlerts: {
            id: string;
            name: string;
            currentStock: number;
            threshold: number;
            severity: "critical" | "warning";
            recommendation: string;
        }[];
        paymentOverdueAlerts: {
            orderId: string;
            orderCode: string;
            pangkalanName: string;
            totalAmount: number;
            amountPaid: number;
            daysOverdue: number;
            severity: string;
            recommendation: string;
        }[];
        summary: {
            totalLowStockProducts: number;
            criticalStockProducts: number;
            totalOverduePayments: number;
            criticalOverduePayments: number;
            pendingOrdersCount: number;
            urgentOrdersCount: number;
            overallHealthScore: number;
        };
        generatedAt: string;
    }>;
    private calculateHealthScore;
}
