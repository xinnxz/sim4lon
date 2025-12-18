import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO untuk membuat pangkalan baru
 * - Termasuk field untuk membuat akun login (login_email, login_password)
 * - email adalah email pangkalan untuk invoice, login_email adalah email untuk login
 */
export class CreatePangkalanDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    pic_name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsInt()
    capacity?: number;

    @IsOptional()
    @IsString()
    note?: string;

    // === Field untuk akun login pangkalan ===

    @IsOptional()
    @IsEmail({}, { message: 'Format email login tidak valid' })
    login_email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Password minimal 6 karakter' })
    login_password?: string;
}

export class UpdatePangkalanDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    pic_name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsInt()
    capacity?: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
