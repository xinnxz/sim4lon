import { PrismaService } from '../../prisma';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto';
import { status_pesanan } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';
export declare class OrderService {
    private prisma;
    private activityService;
    constructor(prisma: PrismaService, activityService: ActivityService);
    findAll(page?: number, limit?: number, status?: status_pesanan, pangkalanId?: string, driverId?: string): Promise<{
        data: ({
            pangkalans: {
                id: string;
                code: string;
                name: string;
                phone: string | null;
                address: string;
                region: string | null;
            };
            drivers: {
                id: string;
                code: string;
                name: string;
                phone: string | null;
            } | null;
            order_items: {
                id: string;
                created_at: Date;
                updated_at: Date;
                order_id: string;
                lpg_type: import("@prisma/client").$Enums.lpg_type;
                qty: number;
                price_per_unit: import("@prisma/client/runtime/library").Decimal;
                tax_amount: import("@prisma/client/runtime/library").Decimal;
                label: string | null;
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
            pangkalan_id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            driver_id: string | null;
            order_date: Date;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        pangkalans: {
            id: string;
            code: string;
            email: string | null;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
        };
        drivers: {
            id: string;
            code: string;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            vehicle_id: string | null;
            note: string | null;
        } | null;
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            qty: number;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            label: string | null;
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
        invoices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_id: string;
            payment_status: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
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
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(dto: CreateOrderDto): Promise<{
        pangkalans: {
            id: string;
            code: string;
            email: string | null;
            name: string;
            phone: string | null;
            is_active: boolean;
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
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            qty: number;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            label: string | null;
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
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdateOrderDto): Promise<{
        pangkalans: {
            id: string;
            code: string;
            email: string | null;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
        };
        drivers: {
            id: string;
            code: string;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            vehicle_id: string | null;
            note: string | null;
        } | null;
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            qty: number;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            label: string | null;
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
        invoices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_id: string;
            payment_status: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
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
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        pangkalans: {
            id: string;
            code: string;
            email: string | null;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
        };
        drivers: {
            id: string;
            code: string;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            vehicle_id: string | null;
            note: string | null;
        } | null;
        order_items: {
            id: string;
            created_at: Date;
            updated_at: Date;
            order_id: string;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            qty: number;
            price_per_unit: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            label: string | null;
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
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        driver_id: string | null;
        order_date: Date;
        current_status: import("@prisma/client").$Enums.status_pesanan;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax_amount: import("@prisma/client/runtime/library").Decimal;
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
