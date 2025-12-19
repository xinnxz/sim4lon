import { PrismaService } from '../../prisma';
import { CreateLpgProductDto, UpdateLpgProductDto } from './dto';
export declare class LpgProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(includeInactive?: boolean): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        brand: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        brand: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getStockSummary(): Promise<{
        stock: {
            in: number;
            out: number;
            current: number;
        };
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        brand: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    create(dto: CreateLpgProductDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        brand: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, dto: UpdateLpgProductDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        description: string | null;
        size_kg: import("@prisma/client/runtime/library").Decimal;
        category: import("@prisma/client").$Enums.lpg_category;
        color: string | null;
        brand: string | null;
        selling_price: import("@prisma/client/runtime/library").Decimal;
        cost_price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
