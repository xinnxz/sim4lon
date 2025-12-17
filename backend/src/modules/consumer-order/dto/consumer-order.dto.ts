import { IsString, IsOptional, IsNumber, IsEnum, IsUUID, Min, MaxLength, IsDecimal } from 'class-validator';
import { lpg_type, consumer_payment_status } from '@prisma/client';
import { Type } from 'class-transformer';

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

    @IsEnum(lpg_type)
    lpg_type: lpg_type;

    @IsNumber()
    @Min(1)
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
    @Min(1)
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
