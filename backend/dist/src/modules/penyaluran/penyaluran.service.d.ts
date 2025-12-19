import { PrismaService } from '../../prisma';
import { CreatePenyaluranDto, UpdatePenyaluranDto, BulkUpdatePenyaluranDto, GetPenyaluranQueryDto } from './dto';
export declare class PenyaluranService {
    private prisma;
    constructor(prisma: PrismaService);
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
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        tipe_pembayaran: string;
    })[]>;
    getRekapitulasi(bulan: string, tipePembayaran?: string): Promise<{
        bulan: string;
        days_in_month: number;
        data: {
            id_registrasi: string;
            nama_pangkalan: string;
            pangkalan_id: string;
            alokasi: number;
            status: string;
            daily: Record<number, number>;
            total: number;
            sisa_alokasi: number;
        }[];
    }>;
    create(dto: CreatePenyaluranDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        tipe_pembayaran: string;
    }>;
    bulkUpdate(dto: BulkUpdatePenyaluranDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        tipe_pembayaran: string;
    }[]>;
    update(id: string, dto: UpdatePenyaluranDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        tipe_pembayaran: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        jumlah: number;
        tipe_pembayaran: string;
    }>;
}
