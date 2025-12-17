import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsumerOrderDto, UpdateConsumerOrderDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class ConsumerOrderService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(pangkalanId: string, page?: number, limit?: number, options?: {
        startDate?: string;
        endDate?: string;
        paymentStatus?: string;
        consumerId?: string;
    }): Promise<{
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
            total_amount: Decimal;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: Decimal;
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
    findOne(id: string, pangkalanId: string): Promise<{
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
        total_amount: Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    }>;
    create(pangkalanId: string, dto: CreateConsumerOrderDto): Promise<{
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
        total_amount: Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    }>;
    update(id: string, pangkalanId: string, dto: UpdateConsumerOrderDto): Promise<{
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
        total_amount: Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    }>;
    remove(id: string, pangkalanId: string): Promise<{
        message: string;
    }>;
    getStats(pangkalanId: string, todayOnly?: boolean): Promise<{
        total_orders: number;
        total_qty: number;
        total_revenue: number;
        unpaid_count: number;
        unpaid_total: number;
    }>;
    getRecentSales(pangkalanId: string, limit?: number): Promise<({
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
        total_amount: Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    })[]>;
}
