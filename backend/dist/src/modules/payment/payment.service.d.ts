import { PrismaService } from '../../prisma';
import { CreatePaymentRecordDto, UpdateOrderPaymentDto } from './dto';
import { payment_method } from '@prisma/client';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllRecords(page?: number, limit?: number, orderId?: string, invoiceId?: string, method?: payment_method): Promise<{
        data: ({
            users: {
                name: string;
                id: string;
            };
            orders: {
                id: string;
                pangkalans: {
                    name: string;
                };
            } | null;
            invoices: {
                id: string;
                invoice_number: string | null;
            } | null;
        } & {
            id: string;
            created_at: Date;
            order_id: string | null;
            invoice_id: string | null;
            method: import("@prisma/client").$Enums.payment_method;
            amount: import("@prisma/client/runtime/library").Decimal;
            payment_time: Date;
            proof_url: string | null;
            recorded_by_user_id: string;
            note: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneRecord(id: string): Promise<{
        users: {
            name: string;
            id: string;
            email: string;
        };
        orders: ({
            pangkalans: {
                name: string;
                id: string;
                code: string;
                email: string | null;
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
                sub_total: import("@prisma/client/runtime/library").Decimal | null;
                label: string | null;
                is_taxable: boolean;
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
        }) | null;
        invoices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_id: string;
            payment_status: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        id: string;
        created_at: Date;
        order_id: string | null;
        invoice_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        amount: import("@prisma/client/runtime/library").Decimal;
        payment_time: Date;
        proof_url: string | null;
        recorded_by_user_id: string;
        note: string | null;
    }>;
    createRecord(dto: CreatePaymentRecordDto, userId: string): Promise<{
        users: {
            name: string;
            id: string;
        };
        orders: {
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
        } | null;
        invoices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_id: string;
            payment_status: string | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        id: string;
        created_at: Date;
        order_id: string | null;
        invoice_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        amount: import("@prisma/client/runtime/library").Decimal;
        payment_time: Date;
        proof_url: string | null;
        recorded_by_user_id: string;
        note: string | null;
    }>;
    updateOrderPayment(orderId: string, dto: UpdateOrderPaymentDto): Promise<{
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
    }>;
    getOrderPayment(orderId: string): Promise<{
        orders: {
            id: string;
            pangkalans: {
                name: string;
            };
            total_amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
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
    }>;
}
