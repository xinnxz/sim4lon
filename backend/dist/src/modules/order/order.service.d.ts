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
                code: string;
                name: string;
                phone: string | null;
            } | null;
            pangkalans: {
                id: string;
                code: string;
                name: string;
                phone: string | null;
                address: string;
                region: string | null;
            };
            order_items: {
                id: string;
                created_at: Date;
                updated_at: Date;
                order_id: string;
                label: string | null;
                tax_amount: import("@prisma/client/runtime/library").Decimal;
                lpg_type: import("@prisma/client").$Enums.lpg_type;
                price_per_unit: import("@prisma/client/runtime/library").Decimal;
                qty: number;
                sub_total: import("@prisma/client/runtime/library").Decimal | null;
                is_taxable: boolean;
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
                amount_paid: import("@prisma/client/runtime/library").Decimal | null;
                payment_date: Date | null;
            } | null;
        } & {
            id: string;
            code: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            pangkalan_id: string;
            driver_id: string | null;
            order_date: Date;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            total_amount: import("@prisma/client/runtime/library").Decimal;
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
            code: string;
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
            code: string;
            email: string | null;
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
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
            payment_status: string | null;
        }[];
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            label: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            sub_total: import("@prisma/client/runtime/library").Decimal | null;
            is_taxable: boolean;
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
            amount_paid: import("@prisma/client/runtime/library").Decimal | null;
            payment_date: Date | null;
        } | null;
        timeline_tracks: {
            id: string;
            created_at: Date;
            description: string | null;
            order_id: string;
            note: string | null;
            status: import("@prisma/client").$Enums.status_pesanan;
        }[];
    } & {
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(dto: CreateOrderDto): Promise<{
        pangkalans: {
            id: string;
            code: string;
            email: string | null;
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
            label: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            sub_total: import("@prisma/client/runtime/library").Decimal | null;
            is_taxable: boolean;
        }[];
        timeline_tracks: {
            id: string;
            created_at: Date;
            description: string | null;
            order_id: string;
            note: string | null;
            status: import("@prisma/client").$Enums.status_pesanan;
        }[];
    } & {
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdateOrderDto): Promise<{
        drivers: {
            id: string;
            code: string;
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
            code: string;
            email: string | null;
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
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
            payment_status: string | null;
        }[];
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            label: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            sub_total: import("@prisma/client/runtime/library").Decimal | null;
            is_taxable: boolean;
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
            amount_paid: import("@prisma/client/runtime/library").Decimal | null;
            payment_date: Date | null;
        } | null;
        timeline_tracks: {
            id: string;
            created_at: Date;
            description: string | null;
            order_id: string;
            note: string | null;
            status: import("@prisma/client").$Enums.status_pesanan;
        }[];
    } & {
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        drivers: {
            id: string;
            code: string;
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
            code: string;
            email: string | null;
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
            label: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            sub_total: import("@prisma/client/runtime/library").Decimal | null;
            is_taxable: boolean;
        }[];
        timeline_tracks: {
            id: string;
            created_at: Date;
            description: string | null;
            order_id: string;
            note: string | null;
            status: import("@prisma/client").$Enums.status_pesanan;
        }[];
    } & {
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        pangkalan_id: string;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private validateStatusTransition;
    getStats(todayOnly?: boolean): Promise<{
        total: number;
        menunggu_pembayaran: number;
        diproses: number;
        siap_kirim: number;
        dikirim: number;
        selesai: number;
        batal: number;
        today_only: boolean;
    }>;
}
