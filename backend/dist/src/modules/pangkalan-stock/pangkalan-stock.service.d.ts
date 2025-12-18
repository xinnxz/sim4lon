import { PrismaService } from '../../prisma/prisma.service';
import { ReceiveStockDto, AdjustStockDto, UpdateStockLevelsDto, LpgType } from './dto';
export declare class PangkalanStockService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateStock;
    getStockLevels(pangkalanId: string): Promise<{
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
    receiveStock(pangkalanId: string, dto: ReceiveStockDto): Promise<{
        message: string;
        newQty: number;
    }>;
    deductStock(pangkalanId: string, lpgType: LpgType, qty: number, referenceId?: string): Promise<boolean>;
    adjustStock(pangkalanId: string, dto: AdjustStockDto): Promise<{
        message: string;
        oldQty: number;
        newQty: number;
        difference: number;
    }>;
    getMovements(pangkalanId: string, startDate?: string, endDate?: string, limit?: number): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        note: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        movement_type: string;
        source: string | null;
        reference_id: string | null;
        movement_date: Date;
    }[]>;
    updateLevels(pangkalanId: string, dto: UpdateStockLevelsDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        warning_level: number;
        critical_level: number;
    }>;
}
