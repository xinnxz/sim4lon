import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto, UpdateDriverDto } from './dto';
export declare class DriverService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, isActive?: boolean): Promise<{
        data: {
            is_busy: boolean;
            active_order: {
                id: string;
                code: string;
                current_status: import("@prisma/client").$Enums.status_pesanan;
            };
            _count: {
                orders: number;
            };
            orders: {
                id: string;
                code: string;
                current_status: import("@prisma/client").$Enums.status_pesanan;
            }[];
            id: string;
            code: string;
            name: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            vehicle_id: string | null;
        }[];
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
        _count: {
            orders: number;
        };
    } & {
        id: string;
        code: string;
        name: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    create(dto: CreateDriverDto): Promise<{
        id: string;
        code: string;
        name: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    update(id: string, dto: UpdateDriverDto): Promise<{
        id: string;
        code: string;
        name: string;
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
