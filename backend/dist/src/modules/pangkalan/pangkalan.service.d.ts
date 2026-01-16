import { PrismaService } from '../../prisma/prisma.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
import { ActivityService } from '../activity/activity.service';
export declare class PangkalanService {
    private prisma;
    private activityService;
    constructor(prisma: PrismaService, activityService: ActivityService);
    findAll(page?: number, limit?: number, isActive?: boolean, search?: string): Promise<{
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
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            agen_id: string | null;
            alokasi_bulanan: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            totalActive: number;
            totalInactive: number;
            totalAll: number;
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
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        agen_id: string | null;
        alokasi_bulanan: number;
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
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        agen_id: string | null;
        alokasi_bulanan: number;
    }>;
    update(id: string, dto: UpdatePangkalanDto): Promise<{
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
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        agen_id: string | null;
        alokasi_bulanan: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
