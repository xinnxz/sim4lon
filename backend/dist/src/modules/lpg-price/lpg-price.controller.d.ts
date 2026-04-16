import { LpgPriceService } from './lpg-price.service';
import { UpdateLpgPriceDto, BulkUpdateLpgPricesDto } from './dto';
export declare class LpgPriceController {
    private readonly lpgPriceService;
    constructor(lpgPriceService: LpgPriceService);
    findAll(req: any): Promise<{
        id: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        updated_at: Date;
        is_active: boolean;
        selling_price: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    update(id: string, dto: UpdateLpgPriceDto, req: any): Promise<{
        id: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        updated_at: Date;
        is_active: boolean;
        selling_price: import("@prisma/client/runtime/library").Decimal;
    }>;
    bulkUpdate(dto: BulkUpdateLpgPricesDto, req: any): Promise<any[]>;
}
