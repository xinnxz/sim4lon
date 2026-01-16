import { ConsumerOrderService } from './consumer-order.service';
import { CreateConsumerOrderDto, UpdateConsumerOrderDto } from './dto';
export declare class ConsumerOrderController {
    private readonly consumerOrderService;
    constructor(consumerOrderService: ConsumerOrderService);
    findAll(req: any, page?: string, limit?: string, startDate?: string, endDate?: string, paymentStatus?: string, consumerId?: string): Promise<{
        data: ({
            consumers: {
                id: string;
                name: string;
                phone: string | null;
            } | null;
        } & {
            created_at: Date;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            code: string;
            id: string;
            pangkalan_id: string;
            note: string | null;
            updated_at: Date;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            cost_price: import("@prisma/client/runtime/library").Decimal;
            consumer_id: string | null;
            consumer_name: string | null;
            payment_status: import("@prisma/client").$Enums.consumer_payment_status;
            sale_date: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(req: any, today?: string): Promise<{
        total_orders: number;
        total_qty: number;
        total_revenue: number;
        total_modal: number;
        margin_kotor: number;
        total_pengeluaran: number;
        laba_bersih: number;
    }>;
    getRecentSales(req: any, limit?: string): Promise<({
        consumers: {
            id: string;
            name: string;
        } | null;
    } & {
        created_at: Date;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    })[]>;
    getChartData(req: any): Promise<{
        day: string;
        date: string;
        penjualan: number;
        modal: number;
        pengeluaran: number;
        laba: number;
    }[]>;
    findOne(id: string, req: any): Promise<{
        consumers: {
            created_at: Date;
            id: string;
            pangkalan_id: string;
            note: string | null;
            updated_at: Date;
            name: string;
            address: string | null;
            phone: string | null;
            is_active: boolean;
            nik: string | null;
            kk: string | null;
            consumer_type: import("@prisma/client").$Enums.consumer_type;
        } | null;
    } & {
        created_at: Date;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    }>;
    create(dto: CreateConsumerOrderDto, req: any): Promise<{
        consumers: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
    } & {
        created_at: Date;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    }>;
    update(id: string, dto: UpdateConsumerOrderDto, req: any): Promise<{
        consumers: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
    } & {
        created_at: Date;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
