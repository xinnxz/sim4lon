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
            note: string | null;
            address: string | null;
            nik: string | null;
            kk: string | null;
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
        note: string | null;
        address: string | null;
        nik: string | null;
        kk: string | null;
    }>;
    create(dto: CreateConsumerDto, req: any): Promise<{
        id: string;
        name: string;
        phone: string | null;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        address: string | null;
        nik: string | null;
        kk: string | null;
    }>;
    update(id: string, dto: UpdateConsumerDto, req: any): Promise<{
        id: string;
        name: string;
        phone: string | null;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        address: string | null;
        nik: string | null;
        kk: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
