import { PaymentService } from './payment.service';
import { CreatePaymentRecordDto, UpdateOrderPaymentDto } from './dto';
import { payment_method } from '@prisma/client';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    findAllRecords(page?: string, limit?: string, orderId?: string, invoiceId?: string, method?: payment_method): Promise<{
        data: ({
            invoices: {
                id: string;
                invoice_number: string | null;
            } | null;
            orders: {
                id: string;
                pangkalans: {
                    name: string;
                };
            } | null;
            users: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            order_id: string | null;
            invoice_id: string | null;
            method: import("@prisma/client").$Enums.payment_method;
            amount: import("@prisma/client/runtime/library").Decimal;
            payment_time: Date;
            proof_url: string | null;
            recorded_by_user_id: string;
            note: string | null;
            created_at: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneRecord(id: string): Promise<{
        invoices: {
            id: string;
            order_id: string;
            created_at: Date;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            updated_at: Date;
            deleted_at: Date | null;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
            payment_status: string | null;
        } | null;
        orders: ({
            order_items: {
                id: string;
                order_id: string;
                created_at: Date;
                tax_amount: import("@prisma/client/runtime/library").Decimal;
                updated_at: Date;
                sub_total: import("@prisma/client/runtime/library").Decimal | null;
                lpg_type: import("@prisma/client").$Enums.lpg_type;
                label: string | null;
                price_per_unit: import("@prisma/client/runtime/library").Decimal;
                qty: number;
                is_taxable: boolean;
            }[];
            pangkalans: {
                id: string;
                note: string | null;
                created_at: Date;
                code: string;
                updated_at: Date;
                deleted_at: Date | null;
                name: string;
                address: string;
                region: string | null;
                pic_name: string | null;
                phone: string | null;
                email: string | null;
                capacity: number | null;
                is_active: boolean;
                agen_id: string | null;
                alokasi_bulanan: number;
            };
        } & {
            id: string;
            note: string | null;
            created_at: Date;
            code: string;
            pangkalan_id: string;
            driver_id: string | null;
            order_date: Date;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            updated_at: Date;
            deleted_at: Date | null;
        }) | null;
        users: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        order_id: string | null;
        invoice_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        amount: import("@prisma/client/runtime/library").Decimal;
        payment_time: Date;
        proof_url: string | null;
        recorded_by_user_id: string;
        note: string | null;
        created_at: Date;
    }>;
    createRecord(dto: CreatePaymentRecordDto, userId: string): Promise<{
        invoices: {
            id: string;
            order_id: string;
            created_at: Date;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            updated_at: Date;
            deleted_at: Date | null;
            invoice_number: string | null;
            invoice_date: Date;
            due_date: Date | null;
            billing_address: string | null;
            billed_to_name: string | null;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            tax_rate: import("@prisma/client/runtime/library").Decimal | null;
            grand_total: import("@prisma/client/runtime/library").Decimal;
            payment_status: string | null;
        } | null;
        orders: {
            id: string;
            note: string | null;
            created_at: Date;
            code: string;
            pangkalan_id: string;
            driver_id: string | null;
            order_date: Date;
            current_status: import("@prisma/client").$Enums.status_pesanan;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            updated_at: Date;
            deleted_at: Date | null;
        } | null;
        users: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        order_id: string | null;
        invoice_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        amount: import("@prisma/client/runtime/library").Decimal;
        payment_time: Date;
        proof_url: string | null;
        recorded_by_user_id: string;
        note: string | null;
        created_at: Date;
    }>;
    getOrderPayment(orderId: string): Promise<{
        orders: {
            id: string;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            pangkalans: {
                name: string;
            };
        };
    } & {
        id: string;
        order_id: string;
        proof_url: string | null;
        created_at: Date;
        updated_at: Date;
        is_paid: boolean;
        is_dp: boolean;
        payment_method: import("@prisma/client").$Enums.payment_method | null;
        amount_paid: import("@prisma/client/runtime/library").Decimal | null;
        payment_date: Date | null;
    }>;
    updateOrderPayment(orderId: string, dto: UpdateOrderPaymentDto): Promise<{
        id: string;
        order_id: string;
        proof_url: string | null;
        created_at: Date;
        updated_at: Date;
        is_paid: boolean;
        is_dp: boolean;
        payment_method: import("@prisma/client").$Enums.payment_method | null;
        amount_paid: import("@prisma/client/runtime/library").Decimal | null;
        payment_date: Date | null;
    }>;
}
