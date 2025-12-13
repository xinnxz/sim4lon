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
            name: string;
            address: string;
            region: string | null;
            pic_name: string | null;
            phone: string | null;
            capacity: number | null;
            note: string | null;
            is_active: boolean;
            id: string;
            code: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
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
        name: string;
        address: string;
        region: string | null;
        pic_name: string | null;
        phone: string | null;
        capacity: number | null;
        note: string | null;
        is_active: boolean;
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    create(dto: CreatePangkalanDto): Promise<{
        name: string;
        address: string;
        region: string | null;
        pic_name: string | null;
        phone: string | null;
        capacity: number | null;
        note: string | null;
        is_active: boolean;
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    update(id: string, dto: UpdatePangkalanDto): Promise<{
        name: string;
        address: string;
        region: string | null;
        pic_name: string | null;
        phone: string | null;
        capacity: number | null;
        note: string | null;
        is_active: boolean;
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
