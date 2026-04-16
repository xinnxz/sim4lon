import { lpg_type } from '@prisma/client';
export declare class UpdateLpgPriceDto {
    cost_price?: number;
    selling_price?: number;
    is_active?: boolean;
}
export declare class LpgPriceItemDto {
    lpg_type: lpg_type;
    cost_price: number;
    selling_price: number;
    is_active?: boolean;
}
export declare class BulkUpdateLpgPricesDto {
    prices: LpgPriceItemDto[];
}
