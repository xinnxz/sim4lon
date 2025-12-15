import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto';
import { lpg_type, stock_movement_type } from '@prisma/client';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    getHistory(page?: string, limit?: string, lpgType?: lpg_type, movementType?: stock_movement_type): Promise<{
        data: ({
            users: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            created_at: Date;
            timestamp: Date;
            lpg_product_id: string | null;
            note: string | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type | null;
            qty: number;
            recorded_by_user_id: string | null;
            movement_type: import("@prisma/client").$Enums.stock_movement_type;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSummary(): Promise<Record<string, {
        in: number;
        out: number;
        current: number;
    }>>;
    getHistoryByType(lpgType: lpg_type, limit?: string): Promise<({
        users: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        timestamp: Date;
        lpg_product_id: string | null;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type | null;
        qty: number;
        recorded_by_user_id: string | null;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
    })[]>;
    createMovement(dto: CreateStockMovementDto, userId: string): Promise<{
        users: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        timestamp: Date;
        lpg_product_id: string | null;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type | null;
        qty: number;
        recorded_by_user_id: string | null;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
    }>;
}
