import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { lpg_category } from '@prisma/client';

// DTO for price variants
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

// Create LPG Product
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

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LpgPriceDto)
    prices?: LpgPriceDto[];
}

// Update LPG Product
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
    @IsBoolean()
    is_active?: boolean;
}

// Add/Update Price
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
