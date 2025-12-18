import { PangkalanService } from './pangkalan.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
export declare class PangkalanController {
    private readonly pangkalanService;
    constructor(pangkalanService: PangkalanService);
    findAll(page?: string, limit?: string, isActive?: string, search?: string): Promise<{
        data: ({
            _count: {
                orders: number;
            };
        } & {
            id: string;
            code: string;
            email: string | null;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
            capacity: number | null;
            agen_id: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        _count: {
            orders: number;
        };
    } & {
        id: string;
        code: string;
        email: string | null;
        name: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        address: string;
        region: string | null;
        pic_name: string | null;
        capacity: number | null;
        agen_id: string | null;
    }>;
    create(dto: CreatePangkalanDto): Promise<{
        id: string;
        code: string;
        email: string | null;
        name: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        address: string;
        region: string | null;
        pic_name: string | null;
        capacity: number | null;
        agen_id: string | null;
    }>;
    update(id: string, dto: UpdatePangkalanDto): Promise<{
        id: string;
        code: string;
        email: string | null;
        name: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        address: string;
        region: string | null;
        pic_name: string | null;
        capacity: number | null;
        agen_id: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
