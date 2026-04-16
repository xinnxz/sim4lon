import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty({ message: 'Kata sandi lama harus diisi' })
    @IsString()
    oldPassword: string;

    @IsNotEmpty({ message: 'Kata sandi baru harus diisi' })
    @IsString()
    @MinLength(8, { message: 'Kata sandi baru minimal 8 karakter' })
    @Matches(/(?=.*[a-z])/, { message: 'Kata sandi harus mengandung huruf kecil' })
    @Matches(/(?=.*[A-Z])/, { message: 'Kata sandi harus mengandung huruf besar' })
    @Matches(/(?=.*\d)/, { message: 'Kata sandi harus mengandung angka' })
    newPassword: string;
}
