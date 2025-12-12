import { lpg_category } from '@prisma/client';
export declare class LpgPriceDto {
    label: string;
    price: number;
    is_default?: boolean;
}
export declare class CreateLpgProductDto {
    name: string;
    size_kg: number;
    category: lpg_category;
    color?: string;
    description?: string;
    prices?: LpgPriceDto[];
}
export declare class UpdateLpgProductDto {
    name?: string;
    size_kg?: number;
    category?: lpg_category;
    color?: string;
    description?: string;
    is_active?: boolean;
}
export declare class CreateLpgPriceDto {
    label: string;
    price: number;
    is_default?: boolean;
}
