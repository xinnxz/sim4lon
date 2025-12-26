export declare class CreatePenyaluranDto {
    pangkalan_id: string;
    tanggal: string;
    jumlah: number;
    tipe_pembayaran?: string;
}
export declare class UpdatePenyaluranDto {
    jumlah?: number;
    tipe_pembayaran?: string;
}
export declare class BulkUpdatePenyaluranDto {
    pangkalan_id: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    tipe_pembayaran?: string;
    data: {
        tanggal: string;
        jumlah: number;
    }[];
}
export declare class GetPenyaluranQueryDto {
    pangkalan_id?: string;
    tanggal_awal?: string;
    tanggal_akhir?: string;
    tipe_pembayaran?: string;
    bulan?: string;
}
