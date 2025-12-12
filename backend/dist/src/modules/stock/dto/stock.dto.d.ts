import { lpg_type, stock_movement_type } from '@prisma/client';
export declare class CreateStockMovementDto {
    lpg_type: lpg_type;
    movement_type: stock_movement_type;
    qty: number;
    note?: string;
}
