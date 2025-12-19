import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePenyaluranDto {
    @IsString()
    pangkalan_id: string;

    @IsDateString()
    tanggal: string;

    @IsInt()
    @Min(0)
    jumlah: number;

    @IsOptional()
    @IsString()
    tipe_pembayaran?: string;
}

export class UpdatePenyaluranDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    jumlah?: number;

    @IsOptional()
    @IsString()
    tipe_pembayaran?: string;
}

export class BulkUpdatePenyaluranDto {
    @IsString()
    pangkalan_id: string;

    @IsDateString()
    tanggal_awal: string;

    @IsDateString()
    tanggal_akhir: string;

    @IsOptional()
    @IsString()
    tipe_pembayaran?: string;

    data: { tanggal: string; jumlah: number }[];
}

export class GetPenyaluranQueryDto {
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
    tipe_pembayaran?: string;

    @IsOptional()
    @IsString()
    bulan?: string;
}
