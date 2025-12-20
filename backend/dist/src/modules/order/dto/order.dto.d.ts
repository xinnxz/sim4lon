import { status_pesanan } from '@prisma/client';
export declare class OrderItemDto {
    lpg_type: string;
    lpg_product_id?: string;
    label?: string;
    price_per_unit: number;
    qty: number;
    is_taxable?: boolean;
}
export declare class CreateOrderDto {
    pangkalan_id: string;
    driver_id?: string;
    note?: string;
    items: OrderItemDto[];
}
export declare class UpdateOrderDto {
    pangkalan_id?: string;
    driver_id?: string;
    note?: string;
    current_status?: status_pesanan;
    items?: OrderItemDto[];
}
export declare class UpdateOrderStatusDto {
    status: status_pesanan;
    description?: string;
    note?: string;
    payment_method?: 'TUNAI' | 'TRANSFER';
}
