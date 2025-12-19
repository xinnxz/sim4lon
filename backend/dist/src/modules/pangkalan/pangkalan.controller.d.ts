import { PangkalanService } from './pangkalan.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
export declare class PangkalanController {
    private readonly pangkalanService;
    constructor(pangkalanService: PangkalanService);
    findAll(page?: string, limit?: string, isActive?: string, search?: string): Promise<{
        data: ({
            users: {
                id: string;
                email: string;
                name: string;
                is_active: boolean;
            }[];
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
            alokasi_bulanan: number;
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
            email: string;
            name: string;
            is_active: boolean;
        }[];
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
        alokasi_bulanan: number;
    }>;
    create(dto: CreatePangkalanDto): Promise<{
        users: {
            id: string;
            email: string;
            name: string;
            is_active: boolean;
        }[];
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
        alokasi_bulanan: number;
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
        alokasi_bulanan: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
