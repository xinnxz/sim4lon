import { IsDateString, IsInt, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Nested DTO for bulk update items
class PerencanaanDataItemDto {
    @IsDateString()
    tanggal: string;

    @IsInt()
    @Min(0)
    jumlah: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    jumlah_normal?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    jumlah_fakultatif?: number;
}

export class CreatePerencanaanDto {
    @IsString()
    pangkalan_id: string;

    @IsDateString()
    tanggal: string;

    @IsInt()
    @Min(0)
    jumlah: number;

    @IsOptional()
    @IsString()
    kondisi?: 'NORMAL' | 'FAKULTATIF';

    @IsOptional()
    @IsInt()
    @Min(0)
    alokasi_bulan?: number;
}

export class UpdatePerencanaanDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    jumlah?: number;

    @IsOptional()
    @IsString()
    kondisi?: 'NORMAL' | 'FAKULTATIF';
}

export class BulkUpdatePerencanaanDto {
    @IsString()
    pangkalan_id: string;

    @IsDateString()
    tanggal_awal: string;

    @IsDateString()
    tanggal_akhir: string;

    @IsOptional()
    @IsString()
    kondisi?: 'NORMAL' | 'FAKULTATIF';

    // Array of date -> jumlah mappings
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PerencanaanDataItemDto)
    data: PerencanaanDataItemDto[];
}

export class GetPerencanaanQueryDto {
    @IsOptional()
    @IsString()
    pangkalan_id?: string;

    @IsOptional()
    @IsDateString()
    tanggal_awal?: string;

    @IsOptional()
    @IsDateString()
    tanggal_akhir?: string;

    @IsOptional()
    @IsString()
    kondisi?: 'NORMAL' | 'FAKULTATIF';

    @IsOptional()
    @IsString()
    bulan?: string; // Format: YYYY-MM
}
