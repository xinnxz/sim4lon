import { LpgProductsService } from './lpg-products.service';
import { CreateLpgProductDto, UpdateLpgProductDto } from './dto';
export declare class LpgProductsController {
    private readonly lpgProductsService;
    constructor(lpgProductsService: LpgProductsService);
    findAll(includeInactive?: string): Promise<{
        name: string;
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        category: import("@prisma/client").$Enums.lpg_category;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        color: string | null;
    }[]>;
    getWithStock(): Promise<{
        stock: {
            in: number;
            out: number;
            current: number;
        };
        name: string;
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        category: import("@prisma/client").$Enums.lpg_category;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        category: import("@prisma/client").$Enums.lpg_category;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        color: string | null;
    }>;
    create(dto: CreateLpgProductDto): Promise<{
        name: string;
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        category: import("@prisma/client").$Enums.lpg_category;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        color: string | null;
    }>;
    update(id: string, dto: UpdateLpgProductDto): Promise<{
        name: string;
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        category: import("@prisma/client").$Enums.lpg_category;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        color: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
