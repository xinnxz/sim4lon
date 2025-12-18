import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto, UpdateDriverDto } from './dto';
export declare class DriverService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, isActive?: boolean): Promise<{
        data: ({
            _count: {
                orders: number;
            };
        } & {
            name: string;
            id: string;
            code: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            vehicle_id: string | null;
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
        id: string;
        code: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    create(dto: CreateDriverDto): Promise<{
        name: string;
        id: string;
        code: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    update(id: string, dto: UpdateDriverDto): Promise<{
        name: string;
        id: string;
        code: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
