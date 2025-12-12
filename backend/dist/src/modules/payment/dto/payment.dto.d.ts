import { payment_method } from '@prisma/client';
export declare class CreatePaymentRecordDto {
    order_id?: string;
    invoice_id?: string;
    method: payment_method;
    amount: number;
    proof_url?: string;
    note?: string;
}
export declare class UpdateOrderPaymentDto {
    is_paid?: boolean;
    is_dp?: boolean;
    payment_method?: payment_method;
    amount_paid?: number;
    proof_url?: string;
}
