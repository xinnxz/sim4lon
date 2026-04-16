import { PrismaService } from '../../prisma/prisma.service';
import { UpdateLpgPriceDto, LpgPriceItemDto } from './dto';
import { lpg_type } from '@prisma/client';
export declare class LpgPriceService {
    private prisma;
    private readonly logger;
    private readonly DEFAULT_PRICES;
    constructor(prisma: PrismaService);
    findAll(pangkalanId: string): Promise<{
        id: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        updated_at: Date;
        is_active: boolean;
        selling_price: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    createDefaultPrices(pangkalanId: string): Promise<void>;
    update(id: string, pangkalanId: string, dto: UpdateLpgPriceDto): Promise<{
        id: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        updated_at: Date;
        is_active: boolean;
        selling_price: import("@prisma/client/runtime/library").Decimal;
    }>;
    bulkUpdate(pangkalanId: string, items: LpgPriceItemDto[]): Promise<any[]>;
    getSellingPrice(pangkalanId: string, lpgType: lpg_type): Promise<number>;
}
