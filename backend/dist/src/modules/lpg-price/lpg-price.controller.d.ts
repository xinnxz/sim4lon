import { LpgPriceService } from './lpg-price.service';
import { UpdateLpgPriceDto, BulkUpdateLpgPricesDto } from './dto';
export declare class LpgPriceController {
    private readonly lpgPriceService;
    constructor(lpgPriceService: LpgPriceService);
    findAll(req: any): Promise<{
        cost_price: import("@prisma/client/runtime/library").Decimal;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        is_active: boolean;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
    }[]>;
    update(id: string, dto: UpdateLpgPriceDto, req: any): Promise<{
        cost_price: import("@prisma/client/runtime/library").Decimal;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        is_active: boolean;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
    }>;
    bulkUpdate(dto: BulkUpdateLpgPricesDto, req: any): Promise<any[]>;
}
