import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsumerDto, UpdateConsumerDto } from './dto';
export declare class ConsumerService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(pangkalanId: string, page?: number, limit?: number, search?: string): Promise<{
        data: ({
            _count: {
                consumer_orders: number;
            };
        } & {
            id: string;
            name: string;
            phone: string | null;
            pangkalan_id: string;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            address: string | null;
            note: string | null;
            nik: string | null;
            kk: string | null;
            consumer_type: import("@prisma/client").$Enums.consumer_type;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, pangkalanId: string): Promise<{
        _count: {
            consumer_orders: number;
        };
    } & {
        id: string;
        name: string;
        phone: string | null;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        address: string | null;
        note: string | null;
        nik: string | null;
        kk: string | null;
        consumer_type: import("@prisma/client").$Enums.consumer_type;
    }>;
    create(pangkalanId: string, dto: CreateConsumerDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        address: string | null;
        note: string | null;
        nik: string | null;
        kk: string | null;
        consumer_type: import("@prisma/client").$Enums.consumer_type;
    }>;
    update(id: string, pangkalanId: string, dto: UpdateConsumerDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        address: string | null;
        note: string | null;
        nik: string | null;
        kk: string | null;
        consumer_type: import("@prisma/client").$Enums.consumer_type;
    }>;
    remove(id: string, pangkalanId: string): Promise<{
        message: string;
    }>;
    getStats(pangkalanId: string): Promise<{
        total: number;
        active: number;
        inactive: number;
        rumahTangga: number;
        warung: number;
        withNik: number;
    }>;
}
