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
            id: string;
            code: string;
            pangkalan_id: string;
            created_at: Date;
            updated_at: Date;
            note: string | null;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            qty: number;
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
        unpaid_count: number;
        unpaid_total: number;
    }>;
    getRecentSales(req: any, limit?: string): Promise<({
        consumers: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    })[]>;
    findOne(id: string, req: any): Promise<{
        consumers: {
            id: string;
            name: string;
            phone: string | null;
            pangkalan_id: string;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            note: string | null;
            address: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
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
        id: string;
        code: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
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
        id: string;
        code: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: import("@prisma/client/runtime/library").Decimal;
        qty: number;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
