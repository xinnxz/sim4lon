import { PrismaService } from '../../prisma/prisma.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
export declare class PangkalanService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, isActive?: boolean, search?: string): Promise<{
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
