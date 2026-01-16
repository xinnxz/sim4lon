import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsumerOrderDto, UpdateConsumerOrderDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class ConsumerOrderService {
    private prisma;
    private readonly logger;
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
            created_at: Date;
            total_amount: Decimal;
            code: string;
            id: string;
            pangkalan_id: string;
            note: string | null;
            updated_at: Date;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: Decimal;
            qty: number;
            cost_price: Decimal;
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
        total_amount: Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        cost_price: Decimal;
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
        created_at: Date;
        total_amount: Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        cost_price: Decimal;
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
        created_at: Date;
        total_amount: Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        cost_price: Decimal;
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
        total_modal: number;
        margin_kotor: number;
        total_pengeluaran: number;
        laba_bersih: number;
    }>;
    getRecentSales(pangkalanId: string, limit?: number): Promise<({
        consumers: {
            id: string;
            name: string;
        } | null;
    } & {
        created_at: Date;
        total_amount: Decimal;
        code: string;
        id: string;
        pangkalan_id: string;
        note: string | null;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        price_per_unit: Decimal;
        qty: number;
        cost_price: Decimal;
        consumer_id: string | null;
        consumer_name: string | null;
        payment_status: import("@prisma/client").$Enums.consumer_payment_status;
        sale_date: Date;
    })[]>;
    getChartData(pangkalanId: string): Promise<{
        day: string;
        date: string;
        penjualan: number;
        modal: number;
        pengeluaran: number;
        laba: number;
    }[]>;
}
