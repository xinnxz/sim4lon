import { PrismaService } from '../../prisma';
import { CreatePaymentRecordDto, UpdateOrderPaymentDto } from './dto';
import { payment_method } from '@prisma/client';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllRecords(page?: number, limit?: number, orderId?: string, invoiceId?: string, method?: payment_method): Promise<{
        data: ({
            users: {
                id: string;
                name: string;
            };
            orders: {
                pangkalans: {
                    name: string;
                };
                id: string;
            } | null;
            invoices: {
                id: string;
                invoice_number: string | null;
            } | null;
        } & {
            id: string;
            note: string | null;
            created_at: Date;
            recorded_by_user_id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            order_id: string | null;
            method: import("@prisma/client").$Enums.payment_method;
            payment_time: Date;
            proof_url: string | null;
            invoice_id: string | null;
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
            name: string;
            email: string;
        };
        orders: ({
            pangkalans: {
                id: string;
                code: string;
                note: string | null;
                created_at: Date;
                updated_at: Date;
                name: string;
                address: string;
                phone: string | null;
                email: string | null;
                pic_name: string | null;
                region: string | null;
                is_active: boolean;
                deleted_at: Date | null;
                agen_id: string | null;
                capacity: number | null;
                alokasi_bulanan: number;
            };
            order_items: {
                qty: number;
                id: string;
                lpg_type: import("@prisma/client").$Enums.lpg_type;
                price_per_unit: import("@prisma/client/runtime/library").Decimal;
                created_at: Date;
                updated_at: Date;
                tax_amount: import("@prisma/client/runtime/library").Decimal;
                order_id: string;
                sub_total: import("@prisma/client/runtime/library").Decimal | null;
                label: string | null;
                is_taxable: boolean;
            }[];
        } & {
            current_status: import("@prisma/client").$Enums.status_pesanan;
            id: string;
            code: string;
            pangkalan_id: string;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_date: Date;
            driver_id: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
        }) | null;
        invoices: {
            id: string;
            payment_status: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            order_id: string;
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
        note: string | null;
        created_at: Date;
        recorded_by_user_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        order_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        payment_time: Date;
        proof_url: string | null;
        invoice_id: string | null;
    }>;
    createRecord(dto: CreatePaymentRecordDto, userId: string): Promise<{
        users: {
            id: string;
            name: string;
        };
        orders: {
            current_status: import("@prisma/client").$Enums.status_pesanan;
            id: string;
            code: string;
            pangkalan_id: string;
            total_amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            order_date: Date;
            driver_id: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            tax_amount: import("@prisma/client/runtime/library").Decimal;
        } | null;
        invoices: {
            id: string;
            payment_status: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            tax_amount: import("@prisma/client/runtime/library").Decimal | null;
            order_id: string;
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
        note: string | null;
        created_at: Date;
        recorded_by_user_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        order_id: string | null;
        method: import("@prisma/client").$Enums.payment_method;
        payment_time: Date;
        proof_url: string | null;
        invoice_id: string | null;
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
            pangkalans: {
                name: string;
            };
            id: string;
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
