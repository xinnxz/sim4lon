import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @Matches(/^(\+62|0)[0-9]{9,12}$/, { message: 'Format nomor telepon tidak valid' })
    phone?: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;
}
