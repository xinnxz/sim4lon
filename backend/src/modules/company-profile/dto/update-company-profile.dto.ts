import { IsString, IsOptional, IsEmail, MaxLength, IsNumber, Min, Max } from 'class-validator';

export class UpdateCompanyProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    company_name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    pic_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    sppbe_number?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    spbe_supplier_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    region?: string;

    @IsOptional()
    @IsString()
    logo_url?: string;

    // === APP SETTINGS ===
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    ppn_rate?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(1000)
    critical_stock_limit?: number;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    invoice_prefix?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    order_code_prefix?: string;

    // === PAYMENT & ORDER SETTINGS ===
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(90)
    payment_due_days?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    min_order_quantity?: number;
}
