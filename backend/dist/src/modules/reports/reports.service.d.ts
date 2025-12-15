import { PrismaService } from '../../prisma';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSalesReport(startDate: Date, endDate: Date): Promise<{
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
    getPaymentsReport(startDate: Date, endDate: Date): Promise<{
        summary: {
            total_payments: number;
            total_amount: number;
            average_payment: number;
            method_breakdown: Record<string, {
                count: number;
                amount: number;
            }>;
        };
        data: {
            id: string;
            date: Date;
            invoice_number: string;
            order_code: string;
            pangkalan: string;
            amount: number;
            method: import("@prisma/client").$Enums.payment_method;
            note: string | null;
            recorded_by: string;
        }[];
        period: {
            start: Date;
            end: Date;
        };
    }>;
    getStockMovementReport(startDate: Date, endDate: Date, productId?: string): Promise<{
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
}
