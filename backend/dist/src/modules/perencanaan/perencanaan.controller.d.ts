import { PerencanaanService } from './perencanaan.service';
import { CreatePerencanaanDto, UpdatePerencanaanDto, BulkUpdatePerencanaanDto, GetPerencanaanQueryDto } from './dto';
export declare class PerencanaanController {
    private readonly perencanaanService;
    constructor(perencanaanService: PerencanaanService);
    findAll(query: GetPerencanaanQueryDto): Promise<({
        pangkalans: {
            id: string;
            code: string;
            name: string;
            is_active: boolean;
            alokasi_bulanan: number;
        };
    } & {
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        tanggal: Date;
        alokasi_bulan: number;
        jumlah_fakultatif: number;
        jumlah_normal: number;
    })[]>;
    getRekapitulasi(bulan: string, kondisi?: string, lpgType?: string): Promise<{
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
    create(dto: CreatePerencanaanDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        tanggal: Date;
        alokasi_bulan: number;
        jumlah_fakultatif: number;
        jumlah_normal: number;
    }>;
    bulkUpdate(dto: BulkUpdatePerencanaanDto): Promise<any[]>;
    update(id: string, dto: UpdatePerencanaanDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        tanggal: Date;
        alokasi_bulan: number;
        jumlah_fakultatif: number;
        jumlah_normal: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        tanggal: Date;
        alokasi_bulan: number;
        jumlah_fakultatif: number;
        jumlah_normal: number;
    }>;
    autoGenerate(body: {
        bulan: string;
        lpg_type?: string;
        kondisi?: string;
        overwrite?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        details: {
            bulan: string;
            lpg_type: string;
            kondisi: string;
            total_pangkalan: number;
            skipped_no_alokasi: number;
            work_days: number;
            deleted_records: number;
            created_records: number;
            duration_ms: number;
        };
    }>;
}
