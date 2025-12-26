import { IsString, IsOptional, IsNumber, IsEnum, IsUUID, Min, MaxLength, IsIn } from 'class-validator';
import { lpg_type, consumer_payment_status } from '@prisma/client';
import { Type, Transform } from 'class-transformer';

// Accept both frontend (3kg) and backend (kg3) formats
const ALL_LPG_TYPES = ['3kg', '5kg', '12kg', '50kg', 'kg3', 'kg5', 'kg12', 'kg50'];

// Convert frontend format (3kg) to Prisma enum (kg3)
function toPrismaLpgType(value: string): lpg_type {
    const mapping: Record<string, lpg_type> = {
        '3kg': 'kg3' as lpg_type, '5kg': 'kg5' as lpg_type, '12kg': 'kg12' as lpg_type, '50kg': 'kg50' as lpg_type,
        'kg3': 'kg3' as lpg_type, 'kg5': 'kg5' as lpg_type, 'kg12': 'kg12' as lpg_type, 'kg50': 'kg50' as lpg_type,
    };
    return mapping[value] || 'kg3' as lpg_type;
}

/**
 * DTO untuk membuat consumer order (penjualan ke konsumen)
 * 
 * PENJELASAN:
 * - consumer_id: ID pelanggan yang sudah terdaftar (optional)
 * - consumer_name: Nama pelanggan walk-in yang tidak terdaftar
 * - Salah satu dari consumer_id atau consumer_name harus diisi
 */
export class CreateConsumerOrderDto {
    @IsOptional()
    @IsUUID()
    consumer_id?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    consumer_name?: string;  // For walk-in customers

    @IsIn(ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' })
    @Transform(({ value }) => toPrismaLpgType(value))
    lpg_type: lpg_type;

    @IsNumber()
    @Min(1, { message: 'Jumlah minimal 1 unit' })
    @Type(() => Number)
    qty: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price_per_unit: number;

    @IsOptional()
    @IsEnum(consumer_payment_status)
    payment_status?: consumer_payment_status;

    @IsOptional()
    @IsString()
    note?: string;
}

/**
 * DTO untuk update consumer order
 */
export class UpdateConsumerOrderDto {
    @IsOptional()
    @IsUUID()
    consumer_id?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    consumer_name?: string;

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'Jumlah minimal 1 unit' })
    @Type(() => Number)
    qty?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price_per_unit?: number;

    @IsOptional()
    @IsEnum(consumer_payment_status)
    payment_status?: consumer_payment_status;

    @IsOptional()
    @IsString()
    note?: string;
}
