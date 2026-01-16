import { PrismaService } from '../../prisma';
import { CreateLpgProductDto, UpdateLpgProductDto } from './dto';
export declare class LpgProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(includeInactive?: boolean): Promise<{
        id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        is_active: boolean;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        image_url: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        brand: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        is_active: boolean;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        image_url: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        brand: string | null;
    }>;
    getStockSummary(): Promise<{
        stock: {
            in: number;
            out: number;
            current: number;
        };
        id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        is_active: boolean;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        image_url: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        brand: string | null;
    }[]>;
    create(dto: CreateLpgProductDto): Promise<{
        id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        is_active: boolean;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        image_url: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        brand: string | null;
    }>;
    update(id: string, dto: UpdateLpgProductDto): Promise<{
        id: string;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        is_active: boolean;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        image_url: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        brand: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
