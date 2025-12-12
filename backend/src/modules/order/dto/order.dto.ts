import { IsArray, IsEnum, IsOptional, IsString, IsUUID, ValidateNested, IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { lpg_type, status_pesanan } from '@prisma/client';

export class OrderItemDto {
    @IsEnum(lpg_type)
    lpg_type: lpg_type;

    @IsOptional()
    @IsString()
    label?: string;

    @IsNumber()
    @Min(0)
    price_per_unit: number;

    @IsInt()
    @Min(1)
    qty: number;
}

export class CreateOrderDto {
    @IsUUID()
    pangkalan_id: string;

    @IsOptional()
    @IsUUID()
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
    @IsUUID()
    pangkalan_id?: string;

    @IsOptional()
    @IsUUID()
    driver_id?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsEnum(status_pesanan)
    current_status?: status_pesanan;
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
