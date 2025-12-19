import { PrismaService } from '../../prisma';
import { CreatePenerimaanDto, GetPenerimaanQueryDto } from './dto';
export declare class PenerimaanService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: GetPenerimaanQueryDto): Promise<{
        data: {
            id: string;
            created_at: Date;
            updated_at: Date;
            tanggal: Date;
            no_so: string;
            no_lo: string;
            nama_material: string;
            qty_pcs: number;
            qty_kg: import("@prisma/client/runtime/library").Decimal;
            sumber: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: CreatePenerimaanDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        no_so: string;
        no_lo: string;
        nama_material: string;
        qty_pcs: number;
        qty_kg: import("@prisma/client/runtime/library").Decimal;
        sumber: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        no_so: string;
        no_lo: string;
        nama_material: string;
        qty_pcs: number;
        qty_kg: import("@prisma/client/runtime/library").Decimal;
        sumber: string | null;
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
}
