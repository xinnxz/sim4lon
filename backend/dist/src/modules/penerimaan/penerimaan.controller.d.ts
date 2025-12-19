import { PenerimaanService } from './penerimaan.service';
import { CreatePenerimaanDto, GetPenerimaanQueryDto } from './dto';
export declare class PenerimaanController {
    private readonly penerimaanService;
    constructor(penerimaanService: PenerimaanService);
    findAll(query: GetPenerimaanQueryDto): Promise<{
        data: {
            id: string;
            no_so: string;
            no_lo: string;
            nama_material: string;
            qty_pcs: number;
            qty_kg: import("@prisma/client/runtime/library").Decimal;
            tanggal: Date;
            sumber: string | null;
            created_at: Date;
            updated_at: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getInOutAgen(bulan: string): Promise<{
        bulan: string;
        days_in_month: number;
        stok_awal_bulan: number;
        stok_akhir_bulan: number;
        total_penerimaan: number;
        total_penyaluran: number;
        daily: Record<number, {
            stok_awal: number;
            penerimaan: number;
            penyaluran: number;
            stok_akhir: number;
        }>;
    }>;
    create(dto: CreatePenerimaanDto): Promise<{
        id: string;
        no_so: string;
        no_lo: string;
        nama_material: string;
        qty_pcs: number;
        qty_kg: import("@prisma/client/runtime/library").Decimal;
        tanggal: Date;
        sumber: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        no_so: string;
        no_lo: string;
        nama_material: string;
        qty_pcs: number;
        qty_kg: import("@prisma/client/runtime/library").Decimal;
        tanggal: Date;
        sumber: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
}
