import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePenerimaanDto {
    @IsString()
    no_so: string;

    @IsString()
    no_lo: string;

    @IsString()
    nama_material: string;

    @IsInt()
    @Min(0)
    qty_pcs: number;

    @IsNumber()
    @Min(0)
    qty_kg: number;

    @IsDateString()
    tanggal: string;

    @IsOptional()
    @IsString()
    sumber?: string;
}

export class GetPenerimaanQueryDto {
    @IsOptional()
    @IsDateString()
    tanggal_awal?: string;

    @IsOptional()
    @IsDateString()
    tanggal_akhir?: string;

    @IsOptional()
    @IsString()
    bulan?: string;

    @IsOptional()
    @IsString()
    sumber?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;
}
