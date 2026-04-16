/**
 * RegisterPangkalanDto — Self-registration untuk pangkalan baru
 * 
 * Data yang diperlukan:
 * - Data pemilik/user (email, password, nama, HP)
 * - Data pangkalan (nama pangkalan, alamat)
 */

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterPangkalanDto {
    // --- Data Pemilik ---

    @IsEmail({}, { message: 'Format email tidak valid' })
    @IsNotEmpty({ message: 'Email wajib diisi' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password wajib diisi' })
    @MinLength(6, { message: 'Password minimal 6 karakter' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Nama pemilik wajib diisi' })
    owner_name: string;

    @IsOptional()
    @IsString()
    phone?: string;

    // --- Data Pangkalan ---

    @IsString()
    @IsNotEmpty({ message: 'Nama pangkalan wajib diisi' })
    pangkalan_name: string;

    @IsString()
    @IsNotEmpty({ message: 'Alamat pangkalan wajib diisi' })
    address: string;

    @IsOptional()
    @IsString()
    region?: string;
}
