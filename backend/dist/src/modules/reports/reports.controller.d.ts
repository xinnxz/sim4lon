import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSalesReport(startDate?: string, endDate?: string): Promise<{
        summary: {
            total_orders: number;
            total_revenue: number;
            average_order: number;
            status_breakdown: Record<string, number>;
        };
        data: {
            id: string;
            date: Date;
            code: string;
            pangkalan: string;
            pangkalan_code: string;
            subtotal: number;
            tax: number;
            total: number;
            status: import("@prisma/client").$Enums.status_pesanan;
            items: {
                type: import("@prisma/client").$Enums.lpg_type;
                label: string | null;
                qty: number;
                price: number;
                subtotal: number;
            }[];
        }[];
        period: {
            start: Date;
            end: Date;
        };
    }>;
    getPangkalanReport(startDate?: string, endDate?: string): Promise<{
        summary: {
            total_pangkalan: number;
            total_orders_subsidi: number;
            total_tabung_subsidi: number;
            total_revenue: number;
            total_consumers: number;
            active_consumers: number;
            top_pangkalan: string;
        };
        data: {
            id: string;
            code: string;
            name: string;
            address: string;
            region: string;
            pic_name: string;
            phone: string;
            alokasi_bulanan: number;
            total_orders_from_agen: number;
            total_tabung_from_agen: number;
            total_consumer_orders: number;
            total_tabung_to_consumers: number;
            total_revenue: number;
            total_registered_consumers: number;
            active_consumers: number;
        }[];
        period: {
            start: Date;
            end: Date;
        };
    }>;
    getSubsidiConsumers(pangkalanId: string, startDate?: string, endDate?: string): Promise<{
        error: string;
        summary?: undefined;
        data?: undefined;
        period?: undefined;
    } | {
        summary: {
            pangkalan_id: string;
            pangkalan_code: string;
            pangkalan_name: string;
            total_consumers: number;
            registered_consumers: number;
            walk_in_count: number;
            total_transactions: number;
            total_tabung: number;
        };
        data: {
            id: string;
            name: string;
            nik: string | null;
            kk: string | null;
            phone: string | null;
            address: string | null;
            consumer_type: string;
            total_purchases: number;
            total_tabung: number;
            last_purchase: Date;
            purchases: {
                date: Date;
                qty: number;
                amount: number;
            }[];
        }[];
        period: {
            start: Date;
            end: Date;
        };
        error?: undefined;
    }>;
    getStockMovementReport(startDate?: string, endDate?: string, productId?: string): Promise<{
        summary: {
            total_in: number;
            total_out: number;
            net_change: number;
            current_balance: number;
            movement_count: number;
        };
        data: {
            id: string;
            date: Date;
            product: string;
            type: import("@prisma/client").$Enums.stock_movement_type;
            qty: number;
            note: string | null;
            recorded_by: string;
        }[];
        period: {
            start: Date;
            end: Date;
        };
    }>;
    private parseDateRange;
}
