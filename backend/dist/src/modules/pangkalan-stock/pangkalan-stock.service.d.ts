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
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        note: string | null;
        movement_date: Date;
        id: string;
        pangkalan_id: string;
        created_at: Date;
        movement_type: string;
        source: string | null;
        reference_id: string | null;
    }[]>;
    updateLevels(pangkalanId: string, dto: UpdateStockLevelsDto): Promise<{
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty: number;
        warning_level: number;
        critical_level: number;
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
    }>;
}
