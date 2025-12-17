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
            note: string | null;
            address: string | null;
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
        note: string | null;
        address: string | null;
    }>;
    create(pangkalanId: string, dto: CreateConsumerDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        address: string | null;
    }>;
    update(id: string, pangkalanId: string, dto: UpdateConsumerDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        address: string | null;
    }>;
    remove(id: string, pangkalanId: string): Promise<{
        message: string;
    }>;
    getStats(pangkalanId: string): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
}
