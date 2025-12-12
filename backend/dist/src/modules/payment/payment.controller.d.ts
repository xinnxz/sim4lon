import { PaymentService } from './payment.service';
import { CreatePaymentRecordDto, UpdateOrderPaymentDto } from './dto';
import { payment_method } from '@prisma/client';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    findAllRecords(page?: string, limit?: string, orderId?: string, invoiceId?: string, method?: payment_method): Promise<{
        data: ({
            users: {
                id: string;
                name: string;
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
            note: string | null;
            order_id: string | null;
            proof_url: string | null;
            invoice_id: string | null;
            method: import("@prisma/client").$Enums.payment_method;
            amount: import("@prisma/client-runtime-utils").Decimal;
            payment_time: Date;
            recorded_by_user_id: string;
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
            id: string;
            email: string;
            name: string;
        };
        orders: ({
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
                lpg_type: import("@prisma/client").$Enums.lpg_type;
                label: string | null;
                price_per_unit: import("@prisma/client-runtime-utils").Decimal;
                qty: number;
                order_id: string;
                sub_total: import("@prisma/client-runtime-utils").Decimal | null;
            }[];
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            pangkalan_id: string;
            driver_id: string | null;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            order_date: Date;
            total_amount: import("@prisma/client-runtime-utils").Decimal;
        }) | null;
        invoices: {
            id: string;
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
            tax_amount: import("@prisma/client-runtime-utils").Decimal | null;
            grand_total: import("@prisma/client-runtime-utils").Decimal;
            payment_status: string | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        note: string | null;
        order_id: string | null;
        proof_url: string | null;
        invoice_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        amount: import("@prisma/client-runtime-utils").Decimal;
        payment_time: Date;
        recorded_by_user_id: string;
    }>;
    createRecord(dto: CreatePaymentRecordDto, userId: string): Promise<{
        users: {
            id: string;
            name: string;
        };
        orders: {
            id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            pangkalan_id: string;
            driver_id: string | null;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            order_date: Date;
            total_amount: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        invoices: {
            id: string;
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
            tax_amount: import("@prisma/client-runtime-utils").Decimal | null;
            grand_total: import("@prisma/client-runtime-utils").Decimal;
            payment_status: string | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        note: string | null;
        order_id: string | null;
        proof_url: string | null;
        invoice_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        amount: import("@prisma/client-runtime-utils").Decimal;
        payment_time: Date;
        recorded_by_user_id: string;
    }>;
    getOrderPayment(orderId: string): Promise<{
        orders: {
            id: string;
            pangkalans: {
                name: string;
            };
            total_amount: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
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
    }>;
    updateOrderPayment(orderId: string, dto: UpdateOrderPaymentDto): Promise<{
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
    }>;
}
