import { IsString, IsNumber, IsOptional, Min, IsIn, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

// Backend uses kg3/kg5/kg12/kg50/gr220 (Prisma enum identifiers)
// Frontend uses 3kg/5kg/12kg/50kg/220gr (human-readable format)
export type LpgType = 'gr220' | 'kg3' | 'kg5' | 'kg12' | 'kg50';
export type MovementType = 'MASUK' | 'KELUAR' | 'OPNAME';

// Prisma enum values - include gr220 for Bright Gas
export const LPG_TYPES: LpgType[] = ['gr220', 'kg3', 'kg5', 'kg12', 'kg50'];
// Frontend format values (also accepted in API)
export const LPG_TYPES_FRONTEND = ['220gr', '3kg', '5kg', '12kg', '50kg'];
// Combined for validation
export const ALL_LPG_TYPES = [...LPG_TYPES, ...LPG_TYPES_FRONTEND];
export const MOVEMENT_TYPES: MovementType[] = ['MASUK', 'KELUAR', 'OPNAME'];

// Convert frontend format (3kg) to backend format (kg3)
export function toBackendFormat(type: string): LpgType {
    const mapping: Record<string, LpgType> = {
        '220gr': 'gr220', 'gr220': 'gr220',
        '3kg': 'kg3', '5kg': 'kg5', '12kg': 'kg12', '50kg': 'kg50',
        'kg3': 'kg3', 'kg5': 'kg5', 'kg12': 'kg12', 'kg50': 'kg50',
    };
    return mapping[type] || 'kg3';
}

// Convert backend format (kg3) to frontend format (3kg)
export function toFrontendFormat(type: string): string {
    const mapping: Record<string, string> = {
        'gr220': 'gr220', '220gr': 'gr220', // Keep gr220 as-is for frontend
        'kg3': '3kg', 'kg5': '5kg', 'kg12': '12kg', 'kg50': '50kg',
        '3kg': '3kg', '5kg': '5kg', '12kg': '12kg', '50kg': '50kg',
    };
    return mapping[type] || type;
}

/**
 * DTO untuk terima stok dari agen
 */
export class ReceiveStockDto {
    @IsIn(ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' })
    @Transform(({ value }) => toBackendFormat(value))
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
    @IsIn(ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' })
    @Transform(({ value }) => toBackendFormat(value))
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
    @IsIn(ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' })
    @Transform(({ value }) => toBackendFormat(value))
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
