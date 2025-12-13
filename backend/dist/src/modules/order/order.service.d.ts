import { PrismaService } from '../../prisma';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto';
import { status_pesanan } from '@prisma/client';
export declare class OrderService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, status?: status_pesanan, pangkalanId?: string, driverId?: string): Promise<{
        data: ({
            order_items: {
                id: string;
                tax_amount: import("@prisma/client-runtime-utils").Decimal;
                created_at: Date;
                updated_at: Date;
                order_id: string;
                lpg_type: import("@prisma/client").$Enums.lpg_type;
                label: string | null;
                price_per_unit: import("@prisma/client-runtime-utils").Decimal;
                qty: number;
                sub_total: import("@prisma/client-runtime-utils").Decimal | null;
                is_taxable: boolean;
            }[];
            order_payment_details: {
                id: string;
                created_at: Date;
                updated_at: Date;
                order_id: string;
                is_paid: boolean;
                is_dp: boolean;
                payment_method: import("@prisma/client").$Enums.payment_method | null;
                amount_paid: import("@prisma/client-runtime-utils").Decimal | null;
                payment_date: Date | null;
                proof_url: string | null;
            } | null;
            drivers: {
                id: string;
                code: string;
                name: string;
                phone: string | null;
            } | null;
            pangkalans: {
                id: string;
                code: string;
                name: string;
                address: string;
                region: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            code: string;
            pangkalan_id: string;
            driver_id: string | null;
            order_date: Date;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            tax_amount: import("@prisma/client-runtime-utils").Decimal;
            total_amount: import("@prisma/client-runtime-utils").Decimal;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        invoices: {
            id: string;
            tax_amount: import("@prisma/client-runtime-utils").Decimal | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_id: string;
            sub_total: import("@prisma/client-runtime-utils").Decimal;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            tax_rate: import("@prisma/client-runtime-utils").Decimal | null;
            grand_total: import("@prisma/client-runtime-utils").Decimal;
            payment_status: string | null;
        }[];
        order_items: {
            id: string;
            tax_amount: import("@prisma/client-runtime-utils").Decimal;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            is_taxable: boolean;
        }[];
        order_payment_details: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            is_paid: boolean;
            is_dp: boolean;
            payment_method: import("@prisma/client").$Enums.payment_method | null;
            amount_paid: import("@prisma/client-runtime-utils").Decimal | null;
            payment_date: Date | null;
            proof_url: string | null;
        } | null;
        drivers: {
            id: string;
            code: string;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            name: string;
            phone: string | null;
            is_active: boolean;
            vehicle_id: string | null;
        } | null;
        pangkalans: {
            id: string;
            code: string;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            name: string;
            address: string;
            region: string | null;
            pic_name: string | null;
            phone: string | null;
            capacity: number | null;
            is_active: boolean;
        };
        timeline_tracks: {
            id: string;
            note: string | null;
            created_at: Date;
            order_id: string;
            status: import("@prisma/client").$Enums.status_pesanan;
            description: string | null;
        }[];
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax_amount: import("@prisma/client-runtime-utils").Decimal;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    create(dto: CreateOrderDto): Promise<{
        order_items: {
            id: string;
            tax_amount: import("@prisma/client-runtime-utils").Decimal;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            is_taxable: boolean;
        }[];
        pangkalans: {
            id: string;
            code: string;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            name: string;
            address: string;
            region: string | null;
            pic_name: string | null;
            phone: string | null;
            capacity: number | null;
            is_active: boolean;
        };
        timeline_tracks: {
            id: string;
            note: string | null;
            created_at: Date;
            order_id: string;
            status: import("@prisma/client").$Enums.status_pesanan;
            description: string | null;
        }[];
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax_amount: import("@prisma/client-runtime-utils").Decimal;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    update(id: string, dto: UpdateOrderDto): Promise<{
        order_items: {
            id: string;
            tax_amount: import("@prisma/client-runtime-utils").Decimal;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            is_taxable: boolean;
        }[];
        drivers: {
            id: string;
            code: string;
            name: string;
            phone: string | null;
        } | null;
        pangkalans: {
            id: string;
            code: string;
            name: string;
            address: string;
            region: string | null;
            phone: string | null;
        };
        timeline_tracks: {
            id: string;
            note: string | null;
            created_at: Date;
            order_id: string;
            status: import("@prisma/client").$Enums.status_pesanan;
            description: string | null;
        }[];
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax_amount: import("@prisma/client-runtime-utils").Decimal;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        order_items: {
            id: string;
            tax_amount: import("@prisma/client-runtime-utils").Decimal;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            label: string | null;
            price_per_unit: import("@prisma/client-runtime-utils").Decimal;
            qty: number;
            sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            is_taxable: boolean;
        }[];
        drivers: {
            id: string;
            code: string;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            name: string;
            phone: string | null;
            is_active: boolean;
            vehicle_id: string | null;
        } | null;
        pangkalans: {
            id: string;
            code: string;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            name: string;
            address: string;
            region: string | null;
            pic_name: string | null;
            phone: string | null;
            capacity: number | null;
            is_active: boolean;
        };
        timeline_tracks: {
            id: string;
            note: string | null;
            created_at: Date;
            order_id: string;
            status: import("@prisma/client").$Enums.status_pesanan;
            description: string | null;
        }[];
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax_amount: import("@prisma/client-runtime-utils").Decimal;
        total_amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private validateStatusTransition;
}
