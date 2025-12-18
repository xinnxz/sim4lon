import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto';
import { lpg_type, stock_movement_type } from '@prisma/client';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    getHistory(page?: string, limit?: string, lpgType?: lpg_type, movementType?: stock_movement_type): Promise<{
        data: ({
            users: {
                name: string;
                id: string;
            } | null;
        } & {
            id: string;
            created_at: Date;
            timestamp: Date;
            recorded_by_user_id: string | null;
            note: string | null;
            lpg_product_id: string | null;
            lpg_type: import("@prisma/client").$Enums.lpg_type | null;
            movement_type: import("@prisma/client").$Enums.stock_movement_type;
            qty: number;
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
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        timestamp: Date;
        recorded_by_user_id: string | null;
        note: string | null;
        lpg_product_id: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type | null;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
        qty: number;
    })[]>;
    createMovement(dto: CreateStockMovementDto, userId: string): Promise<{
        users: {
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        timestamp: Date;
        recorded_by_user_id: string | null;
        note: string | null;
        lpg_product_id: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type | null;
        movement_type: import("@prisma/client").$Enums.stock_movement_type;
        qty: number;
    }>;
}
