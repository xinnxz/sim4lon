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
            id: string;
            code: string;
            pangkalan_id: string;
            created_at: Date;
            updated_at: Date;
            cost_price: Decimal;
            note: string | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            consumer_id: string | null;
            consumer_name: string | null;
            qty: number;
            price_per_unit: Decimal;
            total_amount: Decimal;
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
            nik: string | null;
            kk: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        cost_price: Decimal;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        consumer_id: string | null;
        consumer_name: string | null;
        qty: number;
        price_per_unit: Decimal;
        total_amount: Decimal;
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
        cost_price: Decimal;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        consumer_id: string | null;
        consumer_name: string | null;
        qty: number;
        price_per_unit: Decimal;
        total_amount: Decimal;
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
        cost_price: Decimal;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        consumer_id: string | null;
        consumer_name: string | null;
        qty: number;
        price_per_unit: Decimal;
        total_amount: Decimal;
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
        id: string;
        code: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        cost_price: Decimal;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        consumer_id: string | null;
        consumer_name: string | null;
        qty: number;
        price_per_unit: Decimal;
        total_amount: Decimal;
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
