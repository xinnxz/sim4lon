import { PrismaService } from '../../prisma';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto';
import { status_pesanan } from '@prisma/client';
export declare class OrderService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, status?: status_pesanan, pangkalanId?: string, driverId?: string): Promise<{
        data: ({
            drivers: {
                id: string;
                name: string;
            } | null;
            pangkalans: {
                id: string;
                name: string;
                region: string | null;
            };
            order_items: {
                id: string;
                created_at: Date;
                updated_at: Date;
                order_id: string;
                sub_total: import("@prisma/client-runtime-utils").Decimal | null;
                lpg_type: import("@prisma/client").$Enums.lpg_type;
                label: string | null;
                price_per_unit: import("@prisma/client-runtime-utils").Decimal;
                qty: number;
            }[];
            order_payment_details: {
                id: string;
                created_at: Date;
                updated_at: Date;
                order_id: string;
                proof_url: string | null;
                is_paid: boolean;
                is_dp: boolean;
                payment_method: import("@prisma/client").$Enums.payment_method | null;
                amount_paid: import("@prisma/client-runtime-utils").Decimal | null;
                payment_date: Date | null;
            } | null;
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            pangkalan_id: string;
            driver_id: string | null;
            order_date: Date;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            total_amount: import("@prisma/client-runtime-utils").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        drivers: {
            id: string;
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            vehicle_id: string | null;
            note: string | null;
        } | null;
        pangkalans: {
            id: string;
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
        };
        invoices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_id: string;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            sub_total: import("@prisma/client-runtime-utils").Decimal;
            tax_rate: import("@prisma/client-runtime-utils").Decimal | null;
            tax_amount: import("@prisma/client-runtime-utils").Decimal | null;
            grand_total: import("@prisma/client-runtime-utils").Decimal;
            payment_status: string | null;
        }[];
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
        }[];
        order_payment_details: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            proof_url: string | null;
            is_paid: boolean;
            is_dp: boolean;
            payment_method: import("@prisma/client").$Enums.payment_method | null;
            amount_paid: import("@prisma/client-runtime-utils").Decimal | null;
            payment_date: Date | null;
        } | null;
        timeline_tracks: {
            id: string;
            created_at: Date;
            note: string | null;
            order_id: string;
            description: string | null;
            status: import("@prisma/client").$Enums.status_pesanan;
        }[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    create(dto: CreateOrderDto): Promise<{
        pangkalans: {
            id: string;
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
        };
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
        }[];
        timeline_tracks: {
            id: string;
            created_at: Date;
            note: string | null;
            order_id: string;
            description: string | null;
            status: import("@prisma/client").$Enums.status_pesanan;
        }[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    update(id: string, dto: UpdateOrderDto): Promise<{
        drivers: {
            id: string;
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            vehicle_id: string | null;
            note: string | null;
        } | null;
        pangkalans: {
            id: string;
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
        };
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
        }[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        drivers: {
            id: string;
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            vehicle_id: string | null;
            note: string | null;
        } | null;
        pangkalans: {
            id: string;
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
        };
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
        }[];
        timeline_tracks: {
            id: string;
            created_at: Date;
            note: string | null;
            order_id: string;
            description: string | null;
            status: import("@prisma/client").$Enums.status_pesanan;
        }[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private validateStatusTransition;
}
