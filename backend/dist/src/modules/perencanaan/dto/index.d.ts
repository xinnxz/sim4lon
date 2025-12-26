declare class PerencanaanDataItemDto {
    tanggal: string;
    jumlah: number;
    jumlah_normal?: number;
    jumlah_fakultatif?: number;
}
export declare class CreatePerencanaanDto {
    pangkalan_id: string;
    tanggal: string;
    jumlah: number;
    kondisi?: 'NORMAL' | 'FAKULTATIF';
    alokasi_bulan?: number;
}
export declare class UpdatePerencanaanDto {
    jumlah?: number;
    kondisi?: 'NORMAL' | 'FAKULTATIF';
}
export declare class BulkUpdatePerencanaanDto {
    pangkalan_id: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    kondisi?: 'NORMAL' | 'FAKULTATIF';
    data: PerencanaanDataItemDto[];
}
export declare class GetPerencanaanQueryDto {
    pangkalan_id?: string;
    tanggal_awal?: string;
    tanggal_akhir?: string;
    kondisi?: 'NORMAL' | 'FAKULTATIF';
    bulan?: string;
}
export {};
