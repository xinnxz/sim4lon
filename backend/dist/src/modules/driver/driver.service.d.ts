import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto, UpdateDriverDto } from './dto';
export declare class DriverService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string, isActive?: boolean): Promise<{
        data: {
            is_busy: boolean;
            active_order: {
                current_status: import("@prisma/client").$Enums.status_pesanan;
                id: string;
                code: string;
            };
            orders: {
                current_status: import("@prisma/client").$Enums.status_pesanan;
                id: string;
                code: string;
            }[];
            _count: {
                orders: number;
            };
            id: string;
            code: string;
            note: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            phone: string | null;
            is_active: boolean;
            deleted_at: Date | null;
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
        note: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        phone: string | null;
        is_active: boolean;
        deleted_at: Date | null;
        vehicle_id: string | null;
    }>;
    create(dto: CreateDriverDto): Promise<{
        id: string;
        code: string;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        phone: string | null;
        is_active: boolean;
        deleted_at: Date | null;
        vehicle_id: string | null;
    }>;
    update(id: string, dto: UpdateDriverDto): Promise<{
        id: string;
        code: string;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        phone: string | null;
        is_active: boolean;
        deleted_at: Date | null;
        vehicle_id: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
