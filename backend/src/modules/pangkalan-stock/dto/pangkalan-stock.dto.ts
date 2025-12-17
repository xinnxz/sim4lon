import { IsString, IsNumber, IsOptional, Min, IsIn, IsDateString } from 'class-validator';

// Use string type to match Prisma enum - values must match schema's lpg_type enum
export type LpgType = 'kg3' | 'kg5' | 'kg12' | 'kg50';
export type MovementType = 'MASUK' | 'KELUAR' | 'OPNAME';

export const LPG_TYPES: LpgType[] = ['kg3', 'kg5', 'kg12', 'kg50'];
export const MOVEMENT_TYPES: MovementType[] = ['MASUK', 'KELUAR', 'OPNAME'];

/**
 * DTO untuk terima stok dari agen
 */
export class ReceiveStockDto {
    @IsIn(LPG_TYPES)
    lpg_type: LpgType;

    @IsNumber()
    @Min(1)
    qty: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsDateString()
    movement_date?: string;
}

/**
 * DTO untuk stock opname (adjustment)
 */
export class AdjustStockDto {
    @IsIn(LPG_TYPES)
    lpg_type: LpgType;

    @IsNumber()
    @Min(0)
    actual_qty: number; // Qty fisik actual

    @IsOptional()
    @IsString()
    note?: string;
}

/**
 * DTO untuk update stock level alerts
 */
export class UpdateStockLevelsDto {
    @IsIn(LPG_TYPES)
    lpg_type: LpgType;

    @IsOptional()
    @IsNumber()
    @Min(0)
    warning_level?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    critical_level?: number;
}
