import { LpgPriceService } from './lpg-price.service';
import { UpdateLpgPriceDto, BulkUpdateLpgPricesDto } from './dto';
export declare class LpgPriceController {
    private readonly lpgPriceService;
    constructor(lpgPriceService: LpgPriceService);
    findAll(req: any): Promise<{
        id: string;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
    }[]>;
    update(id: string, dto: UpdateLpgPriceDto, req: any): Promise<{
        id: string;
        pangkalan_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
    }>;
    bulkUpdate(dto: BulkUpdateLpgPricesDto, req: any): Promise<any[]>;
}
