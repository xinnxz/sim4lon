import { PrismaService } from '../../prisma';
import { CreateStockMovementDto } from './dto';
import { lpg_type } from '@prisma/client';
export declare class StockService {
    private prisma;
    constructor(prisma: PrismaService);
    getHistory(page?: number, limit?: number, lpgType?: string, movementType?: string): Promise<{
        data: ({
            users: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            created_at: Date;
            timestamp: Date;
            note: string | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type | null;
            qty: number;
            movement_type: import("@prisma/client").$Enums.stock_movement_type;
            lpg_product_id: string | null;
            recorded_by_user_id: string | null;
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
        timestamp: Date;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type | null;
        qty: number;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
        lpg_product_id: string | null;
        recorded_by_user_id: string | null;
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
        timestamp: Date;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type | null;
        qty: number;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
        lpg_product_id: string | null;
        recorded_by_user_id: string | null;
    })[]>;
}
