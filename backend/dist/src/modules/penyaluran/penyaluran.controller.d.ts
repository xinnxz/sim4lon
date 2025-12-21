import { PenyaluranService } from './penyaluran.service';
import { CreatePenyaluranDto, UpdatePenyaluranDto, BulkUpdatePenyaluranDto, GetPenyaluranQueryDto } from './dto';
export declare class PenyaluranController {
    private readonly penyaluranService;
    constructor(penyaluranService: PenyaluranService);
    findAll(query: GetPenyaluranQueryDto): Promise<({
        pangkalans: {
            id: string;
            code: string;
            name: string;
            is_active: boolean;
            alokasi_bulanan: number;
        };
    } & {
        id: string;
        created_at: Date;
        pangkalan_id: string;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        tanggal: Date;
        tipe_pembayaran: string;
        jumlah_fakultatif: number;
        jumlah_normal: number;
    })[]>;
    getRekapitulasi(bulan: string, tipePembayaran?: string, lpgType?: string): Promise<{
        bulan: string;
        days_in_month: number;
        data: {
            id_registrasi: string;
            nama_pangkalan: string;
            pangkalan_id: string;
            alokasi: number;
            status: string;
            daily: Record<number, number>;
            total_normal: number;
            total_fakultatif: number;
            sisa_alokasi: number;
            grand_total: number;
        }[];
    }>;
    create(dto: CreatePenyaluranDto): Promise<any>;
    bulkUpdate(dto: BulkUpdatePenyaluranDto): Promise<any[]>;
    update(id: string, dto: UpdatePenyaluranDto): Promise<{
        id: string;
        created_at: Date;
        pangkalan_id: string;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        tanggal: Date;
        tipe_pembayaran: string;
        jumlah_fakultatif: number;
        jumlah_normal: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        created_at: Date;
        pangkalan_id: string;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        tanggal: Date;
        tipe_pembayaran: string;
        jumlah_fakultatif: number;
        jumlah_normal: number;
    }>;
}
