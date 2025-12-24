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
            consumer_id: string | null;
            consumer_name: string | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            qty: number;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            payment_status: import("@prisma/client").$Enums.consumer_payment_status;
            note: string | null;
            id: string;
            code: string;
            pangkalan_id: string;
            cost_price: import("@prisma/client/runtime/library").Decimal;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            sale_date: Date;
            created_at: Date;
            updated_at: Date;
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
        consumer_id: string | null;
        consumer_name: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        note: string | null;
        id: string;
        code: string;
        pangkalan_id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        sale_date: Date;
        created_at: Date;
        updated_at: Date;
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
            note: string | null;
            id: string;
            pangkalan_id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
            nik: string | null;
            kk: string | null;
            phone: string | null;
            address: string | null;
            is_active: boolean;
            consumer_type: import("@prisma/client").$Enums.consumer_type;
        } | null;
    } & {
        consumer_id: string | null;
        consumer_name: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        note: string | null;
        id: string;
        code: string;
        pangkalan_id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        sale_date: Date;
        created_at: Date;
        updated_at: Date;
    }>;
    create(dto: CreateConsumerOrderDto, req: any): Promise<{
        consumers: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
    } & {
        consumer_id: string | null;
        consumer_name: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        note: string | null;
        id: string;
        code: string;
        pangkalan_id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        sale_date: Date;
        created_at: Date;
        updated_at: Date;
    }>;
    update(id: string, dto: UpdateConsumerOrderDto, req: any): Promise<{
        consumers: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
    } & {
        consumer_id: string | null;
        consumer_name: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        note: string | null;
        id: string;
        code: string;
        pangkalan_id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        sale_date: Date;
        created_at: Date;
        updated_at: Date;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
