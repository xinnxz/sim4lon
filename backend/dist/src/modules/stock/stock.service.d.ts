import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockMovementDto } from './dto';
import { lpg_type, stock_movement_type } from '@prisma/client';
export declare class StockService {
    private prisma;
    constructor(prisma: PrismaService);
    getHistory(page?: number, limit?: number, lpgType?: lpg_type, movementType?: stock_movement_type): Promise<{
        data: ({
            users: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            created_at: Date;
            note: string | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type;
            qty: number;
            recorded_by_user_id: string | null;
            movement_type: import("@prisma/client").$Enums.stock_movement_type;
            timestamp: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createMovement(dto: CreateStockMovementDto, userId: string): Promise<{
        users: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        recorded_by_user_id: string | null;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
        timestamp: Date;
    }>;
    getSummary(): Promise<Record<string, {
        in: number;
        out: number;
        current: number;
    }>>;
    getHistoryByType(lpgType: lpg_type, limit?: number): Promise<({
        users: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        recorded_by_user_id: string | null;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
        timestamp: Date;
    })[]>;
}
