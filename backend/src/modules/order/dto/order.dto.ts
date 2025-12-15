import { IsArray, IsEnum, IsOptional, IsString, ValidateNested, IsInt, IsNumber, Min, IsNotEmpty, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { status_pesanan } from '@prisma/client';

// UUID regex pattern - accepts any valid UUID format
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * OrderItemDto - DTO untuk item pesanan
 * 
 * PENJELASAN:
 * - lpg_type sekarang string (bukan enum) untuk support dynamic products
 * - lpg_product_id untuk tracking stok dynamic products
 * - Contoh: "3kg", "12kg", "50kg", atau ukuran custom lainnya
 */
export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    lpg_type: string;  // Changed from enum to string for dynamic products

    @IsOptional()
    @IsString()
    lpg_product_id?: string;  // ID dari lpg_products table untuk stock tracking

    @IsOptional()
    @IsString()
    label?: string;

    @IsNumber()
    @Min(0)
    price_per_unit: number;

    @IsInt()
    @Min(1)
    qty: number;

    @IsOptional()
    is_taxable?: boolean;  // true jika NON_SUBSIDI (kena PPN 12%)
}

export class CreateOrderDto {
    @IsString()
    @Matches(UUID_REGEX, { message: 'pangkalan_id must be a valid UUID format' })
    pangkalan_id: string;

    @IsOptional()
    @IsString()
    @Matches(UUID_REGEX, { message: 'driver_id must be a valid UUID format' })
    driver_id?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}

export class UpdateOrderDto {
    @IsOptional()
    @IsString()
    @Matches(UUID_REGEX, { message: 'pangkalan_id must be a valid UUID format' })
    pangkalan_id?: string;

    @IsOptional()
    @IsString()
    @Matches(UUID_REGEX, { message: 'driver_id must be a valid UUID format' })
    driver_id?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsEnum(status_pesanan)
    current_status?: status_pesanan;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items?: OrderItemDto[];
}

export class UpdateOrderStatusDto {
    @IsEnum(status_pesanan)
    status: status_pesanan;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    note?: string;
}
