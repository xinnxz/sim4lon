import { IsString, IsOptional, IsBoolean, MaxLength, IsUUID } from 'class-validator';

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
