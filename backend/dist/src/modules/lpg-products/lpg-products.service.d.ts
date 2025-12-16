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
            cost_price: import("@prisma/client/runtime/library").Decimal | null;
            label: string;
            price: import("@prisma/client/runtime/library").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    findOne(id: string): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            cost_price: import("@prisma/client/runtime/library").Decimal | null;
            label: string;
            price: import("@prisma/client/runtime/library").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
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
            cost_price: import("@prisma/client/runtime/library").Decimal | null;
            label: string;
            price: import("@prisma/client/runtime/library").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    create(dto: CreateLpgProductDto): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            cost_price: import("@prisma/client/runtime/library").Decimal | null;
            label: string;
            price: import("@prisma/client/runtime/library").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, dto: UpdateLpgProductDto): Promise<{
        prices: {
            id: string;
            created_at: Date;
            updated_at: Date;
            cost_price: import("@prisma/client/runtime/library").Decimal | null;
            label: string;
            price: import("@prisma/client/runtime/library").Decimal;
            is_default: boolean;
            lpg_product_id: string;
        }[];
    } & {
        id: string;
        is_active: boolean;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addPrice(productId: string, dto: CreateLpgPriceDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        label: string;
        price: import("@prisma/client/runtime/library").Decimal;
        is_default: boolean;
        lpg_product_id: string;
    }>;
    updatePrice(priceId: string, dto: CreateLpgPriceDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        label: string;
        price: import("@prisma/client/runtime/library").Decimal;
        is_default: boolean;
        lpg_product_id: string;
    }>;
    removePrice(priceId: string): Promise<{
        message: string;
    }>;
}
