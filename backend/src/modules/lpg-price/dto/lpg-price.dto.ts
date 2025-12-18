import { IsNumber, IsEnum, IsBoolean, IsOptional, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { lpg_type } from '@prisma/client';

/**
 * DTO untuk update harga LPG individual
 */
export class UpdateLpgPriceDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    cost_price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    selling_price?: number;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

/**
 * DTO untuk item dalam bulk update
 */
export class LpgPriceItemDto {
    @IsEnum(lpg_type)
    lpg_type: lpg_type;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    cost_price: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    selling_price: number;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

/**
 * DTO untuk bulk update semua harga
 */
export class BulkUpdateLpgPricesDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LpgPriceItemDto)
    prices: LpgPriceItemDto[];
}
