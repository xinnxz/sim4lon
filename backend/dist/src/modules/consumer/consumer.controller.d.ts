import { ConsumerService } from './consumer.service';
import { CreateConsumerDto, UpdateConsumerDto } from './dto';
export declare class ConsumerController {
    private readonly consumerService;
    constructor(consumerService: ConsumerService);
    findAll(req: any, page?: string, limit?: string, search?: string): Promise<{
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
    getStats(req: any): Promise<{
        total: number;
        active: number;
        inactive: number;
        rumahTangga: number;
        warung: number;
        withNik: number;
    }>;
    findOne(id: string, req: any): Promise<{
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
    create(dto: CreateConsumerDto, req: any): Promise<{
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
    update(id: string, dto: UpdateConsumerDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
