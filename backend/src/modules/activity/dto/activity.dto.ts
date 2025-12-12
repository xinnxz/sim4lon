import { IsEnum, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { status_pesanan } from '@prisma/client';

export class CreateActivityLogDto {
    @IsOptional()
    @IsUUID()
    user_id?: string;

    @IsOptional()
    @IsUUID()
    order_id?: string;

    @IsString()
    type: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    pangkalan_name?: string;

    @IsOptional()
    @IsNumber()
    detail_numeric?: number;

    @IsOptional()
    @IsString()
    icon_name?: string;

    @IsOptional()
    @IsEnum(status_pesanan)
    order_status?: status_pesanan;
}
