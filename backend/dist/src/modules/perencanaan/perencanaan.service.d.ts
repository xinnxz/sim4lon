import { PrismaService } from '../../prisma';
import { CreatePerencanaanDto, UpdatePerencanaanDto, BulkUpdatePerencanaanDto, GetPerencanaanQueryDto } from './dto';
export declare class PerencanaanService {
    private prisma;
    constructor(prisma: PrismaService);
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
        tanggal: Date;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        alokasi_bulan: number;
    })[]>;
    getRekapitulasi(bulan: string, kondisi?: string): Promise<{
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
        tanggal: Date;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        alokasi_bulan: number;
    }>;
    bulkUpdate(dto: BulkUpdatePerencanaanDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        alokasi_bulan: number;
    }[]>;
    update(id: string, dto: UpdatePerencanaanDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        alokasi_bulan: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        kondisi: import("@prisma/client").$Enums.kondisi_type;
        alokasi_bulan: number;
    }>;
}
