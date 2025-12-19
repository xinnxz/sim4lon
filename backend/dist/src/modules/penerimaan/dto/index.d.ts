export declare class CreatePenerimaanDto {
    no_so: string;
    no_lo: string;
    nama_material: string;
    qty_pcs: number;
    qty_kg: number;
    tanggal: string;
    sumber?: string;
    lpg_product_id?: string;
}
export declare class GetPenerimaanQueryDto {
    tanggal_awal?: string;
    tanggal_akhir?: string;
    bulan?: string;
    sumber?: string;
    page?: string;
    limit?: string;
}
