import { LpgProductsService } from './lpg-products.service';
import { CreateLpgProductDto, UpdateLpgProductDto, CreateLpgPriceDto } from './dto';
export declare class LpgProductsController {
    private readonly lpgProductsService;
    constructor(lpgProductsService: LpgProductsService);
    findAll(includeInactive?: string): Promise<({
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            lpg_product_id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
    })[]>;
    getWithStock(): Promise<{
        stock: {
            in: number;
            out: number;
            current: number;
        };
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            lpg_product_id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
        }[];
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            lpg_product_id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
    }>;
    create(dto: CreateLpgProductDto): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            lpg_product_id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
    }>;
    update(id: string, dto: UpdateLpgProductDto): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            lpg_product_id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addPrice(productId: string, dto: CreateLpgPriceDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        label: string;
        lpg_product_id: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        is_default: boolean;
    }>;
    updatePrice(priceId: string, dto: CreateLpgPriceDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        label: string;
        lpg_product_id: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        is_default: boolean;
    }>;
    removePrice(priceId: string): Promise<{
        message: string;
    }>;
}
