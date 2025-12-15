import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { lpg_category } from '@prisma/client';

/**
 * Create LPG Product DTO
 * Simplified: 1 selling_price + 1 cost_price per product
 */
export class CreateLpgProductDto {
    @IsString()
    name: string;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0.1)
    size_kg: number;

    @IsEnum(lpg_category)
    category: lpg_category;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    selling_price: number;  // Harga jual default

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    cost_price: number;    // Harga beli (wajib untuk profit)
}

/**
 * Update LPG Product DTO
 */
export class UpdateLpgProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0.1)
    size_kg?: number;

    @IsOptional()
    @IsEnum(lpg_category)
    category?: lpg_category;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    selling_price?: number;

    @IsOptional()
    @Transform(({ value }) => value != null ? parseFloat(value) : undefined)
    @IsNumber()
    @Min(0)
    cost_price?: number;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

// DEPRECATED: Keep for backward compatibility
export class LpgPriceDto {
    @IsString()
    label: string;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsBoolean()
    is_default?: boolean;
}

// DEPRECATED: Keep for backward compatibility  
export class CreateLpgPriceDto {
    @IsString()
    label: string;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsBoolean()
    is_default?: boolean;
}
