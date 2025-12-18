import { PangkalanService } from './pangkalan.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
export declare class PangkalanController {
    private readonly pangkalanService;
    constructor(pangkalanService: PangkalanService);
    findAll(page?: string, limit?: string, isActive?: string, search?: string): Promise<{
        data: ({
            users: {
                id: string;
                name: string;
                email: string;
                is_active: boolean;
            }[];
            _count: {
                orders: number;
            };
        } & {
            id: string;
            code: string;
            name: string;
            address: string;
            region: string | null;
            pic_name: string | null;
            phone: string | null;
            email: string | null;
            capacity: number | null;
            note: string | null;
            agen_id: string | null;
            is_active: boolean;
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
        users: {
            id: string;
            name: string;
            email: string;
            is_active: boolean;
        }[];
        _count: {
            orders: number;
        };
    } & {
        id: string;
        code: string;
        name: string;
        address: string;
        region: string | null;
        pic_name: string | null;
        phone: string | null;
        email: string | null;
        capacity: number | null;
        note: string | null;
        agen_id: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    create(dto: CreatePangkalanDto): Promise<{
        users: {
            id: string;
            name: string;
            email: string;
            is_active: boolean;
        }[];
        _count: {
            orders: number;
        };
    } & {
        id: string;
        code: string;
        name: string;
        address: string;
        region: string | null;
        pic_name: string | null;
        phone: string | null;
        email: string | null;
        capacity: number | null;
        note: string | null;
        agen_id: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    update(id: string, dto: UpdatePangkalanDto): Promise<{
        id: string;
        code: string;
        name: string;
        address: string;
        region: string | null;
        pic_name: string | null;
        phone: string | null;
        email: string | null;
        capacity: number | null;
        note: string | null;
        agen_id: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
