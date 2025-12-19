import { lpg_category } from '@prisma/client';
export declare class CreateLpgProductDto {
    name: string;
    size_kg: number;
    category: lpg_category;
    color?: string;
    description?: string;
    selling_price: number;
    cost_price: number;
}
export declare class UpdateLpgProductDto {
    name?: string;
    size_kg?: number;
    category?: lpg_category;
    color?: string;
    brand?: string;
    description?: string;
    selling_price?: number;
    cost_price?: number;
    is_active?: boolean;
}
