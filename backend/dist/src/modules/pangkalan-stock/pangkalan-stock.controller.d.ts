import { PangkalanStockService } from './pangkalan-stock.service';
import { ReceiveStockDto, AdjustStockDto, UpdateStockLevelsDto } from './dto';
export declare class PangkalanStockController {
    private readonly stockService;
    constructor(stockService: PangkalanStockService);
    getStockLevels(req: any): Promise<{
        stocks: {
            id: string;
            lpg_type: string;
            qty: number;
            warning_level: number;
            critical_level: number;
            status: string;
            updated_at: Date;
        }[];
        summary: {
            total: number;
            hasWarning: boolean;
            hasCritical: boolean;
        };
    }>;
    getMovements(req: any, startDate?: string, endDate?: string, limit?: string): Promise<{
        movement_type: string;
        qty: number;
        id: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        source: string | null;
        reference_id: string | null;
        movement_date: Date;
    }[]>;
    receiveStock(req: any, dto: ReceiveStockDto): Promise<{
        message: string;
        newQty: number;
    }>;
    adjustStock(req: any, dto: AdjustStockDto): Promise<{
        message: string;
        oldQty: number;
        newQty: number;
        difference: number;
    }>;
    updateLevels(req: any, dto: UpdateStockLevelsDto): Promise<{
        qty: number;
        warning_level: number;
        critical_level: number;
        id: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        created_at: Date;
        updated_at: Date;
    }>;
}
