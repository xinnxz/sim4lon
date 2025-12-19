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
            alokasi_bulanan: number;
            is_active: boolean;
        };
    } & {
        id: string;
        pangkalan_id: string;
        tanggal: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        tipe_pembayaran: string;
        created_at: Date;
        updated_at: Date;
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
    create(dto: CreatePenyaluranDto): Promise<{
        id: string;
        pangkalan_id: string;
        tanggal: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        tipe_pembayaran: string;
        created_at: Date;
        updated_at: Date;
    }>;
    bulkUpdate(dto: BulkUpdatePenyaluranDto): Promise<{
        id: string;
        pangkalan_id: string;
        tanggal: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        tipe_pembayaran: string;
        created_at: Date;
        updated_at: Date;
    }[]>;
    update(id: string, dto: UpdatePenyaluranDto): Promise<{
        id: string;
        pangkalan_id: string;
        tanggal: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        tipe_pembayaran: string;
        created_at: Date;
        updated_at: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        pangkalan_id: string;
        tanggal: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        tipe_pembayaran: string;
        created_at: Date;
        updated_at: Date;
    }>;
}
