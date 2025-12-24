import { IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Transform } from 'class-transformer';

// Valid values - includes 50kg for industrial LPG
const validLpgTypes = ['3kg', '12kg', '50kg'];
const validMovementTypes = ['MASUK', 'KELUAR'];

export class CreateStockMovementDto {
    @IsOptional()
    @IsIn(validLpgTypes, { message: 'lpg_type must be one of: 3kg, 12kg, 50kg' })
    lpg_type?: string;

    @IsOptional()
    @IsUUID()
    lpg_product_id?: string; // For dynamic products

    @IsIn(validMovementTypes, { message: 'movement_type must be MASUK or KELUAR' })
    movement_type: string;

    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Jumlah harus berupa angka bulat' })
    @Min(1, { message: 'Jumlah minimal 1 unit' })
    qty: number;

    @IsOptional()
    @IsString()
    note?: string;
}

// Map frontend values to Prisma TypeScript enum keys
export function mapLpgTypeToEnum(value: string): 'kg3' | 'kg12' | 'kg50' {
    if (value === '3kg') return 'kg3';
    if (value === '12kg') return 'kg12';
    if (value === '50kg') return 'kg50';
    return 'kg3'; // default
}

export function mapMovementTypeToEnum(value: string): 'MASUK' | 'KELUAR' {
    return value === 'MASUK' ? 'MASUK' : 'KELUAR';
}
