import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { lpg_type, stock_movement_type } from '@prisma/client';

export class CreateStockMovementDto {
    @IsEnum(lpg_type)
    lpg_type: lpg_type;

    @IsEnum(stock_movement_type)
    movement_type: stock_movement_type;

    @IsInt()
    @Min(1)
    qty: number;

    @IsOptional()
    @IsString()
    note?: string;
}
