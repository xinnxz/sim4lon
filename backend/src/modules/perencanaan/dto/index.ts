import { IsDateString, IsInt, IsOptional, IsString, IsEnum, Min } from 'class-validator';

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
    data: { tanggal: string; jumlah: number }[];
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
