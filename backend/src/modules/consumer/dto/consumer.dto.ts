import { IsString, IsOptional, IsBoolean, MaxLength, IsUUID, Length, IsIn } from 'class-validator';

/**
 * Consumer type enum
 */
export type ConsumerType = 'RUMAH_TANGGA' | 'WARUNG';

/**
 * DTO untuk membuat consumer baru
 * Consumer adalah pelanggan pangkalan (warung, ibu-ibu, dll)
 */
export class CreateConsumerDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    @Length(16, 16, { message: 'NIK harus 16 digit' })
    nik?: string;

    @IsOptional()
    @IsString()
    @Length(16, 16, { message: 'Nomor KK harus 16 digit' })
    kk?: string;

    @IsOptional()
    @IsIn(['RUMAH_TANGGA', 'WARUNG'], { message: 'Jenis harus RUMAH_TANGGA atau WARUNG' })
    consumer_type?: ConsumerType;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    note?: string;
}

/**
 * DTO untuk update consumer
 */
export class UpdateConsumerDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @Length(16, 16, { message: 'NIK harus 16 digit' })
    nik?: string;

    @IsOptional()
    @IsString()
    @Length(16, 16, { message: 'Nomor KK harus 16 digit' })
    kk?: string;

    @IsOptional()
    @IsIn(['RUMAH_TANGGA', 'WARUNG'], { message: 'Jenis harus RUMAH_TANGGA atau WARUNG' })
    consumer_type?: ConsumerType;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
