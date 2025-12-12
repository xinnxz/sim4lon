import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { payment_method } from '@prisma/client';

export class CreatePaymentRecordDto {
    @IsOptional()
    @IsUUID()
    order_id?: string;

    @IsOptional()
    @IsUUID()
    invoice_id?: string;

    @IsEnum(payment_method)
    method: payment_method;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsOptional()
    @IsString()
    proof_url?: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdateOrderPaymentDto {
    @IsOptional()
    @IsBoolean()
    is_paid?: boolean;

    @IsOptional()
    @IsBoolean()
    is_dp?: boolean;

    @IsOptional()
    @IsEnum(payment_method)
    payment_method?: payment_method;

    @IsOptional()
    @IsNumber()
    @Min(0)
    amount_paid?: number;

    @IsOptional()
    @IsString()
    proof_url?: string;
}
