import { lpg_type, consumer_payment_status } from '@prisma/client';
export declare class CreateConsumerOrderDto {
    consumer_id?: string;
    consumer_name?: string;
    lpg_type: lpg_type;
    qty: number;
    price_per_unit: number;
    payment_status?: consumer_payment_status;
    note?: string;
}
export declare class UpdateConsumerOrderDto {
    consumer_id?: string;
    consumer_name?: string;
    qty?: number;
    price_per_unit?: number;
    payment_status?: consumer_payment_status;
    note?: string;
}
