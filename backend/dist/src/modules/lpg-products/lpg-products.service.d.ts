import { PrismaService } from '../../prisma';
import { CreateLpgProductDto, UpdateLpgProductDto, CreateLpgPriceDto } from './dto';
export declare class LpgProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(includeInactive?: boolean): Promise<({
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        name: string;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        description: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        name: string;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        description: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    create(dto: CreateLpgProductDto): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        name: string;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        description: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    update(id: string, dto: UpdateLpgProductDto): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            label: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        name: string;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        description: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addPrice(productId: string, dto: CreateLpgPriceDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        label: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        is_default: boolean;
        lpg_product_id: string;
    }>;
    updatePrice(priceId: string, dto: CreateLpgPriceDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        label: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        is_default: boolean;
        lpg_product_id: string;
    }>;
    removePrice(priceId: string): Promise<{
        message: string;
    }>;
    getStockSummary(): Promise<{
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
            price: import("@prisma/client-runtime-utils").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
        id: string;
        name: string;
        size_kg: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        description: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }[]>;
}
