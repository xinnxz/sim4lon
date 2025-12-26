import { IsString, IsOptional, IsNumber, Min, IsIn, IsDateString } from 'class-validator';

/**
 * Expense Categories:
 * - OPERASIONAL: Biaya operasional umum
 * - TRANSPORT: BBM, ojek, transportasi
 * - SEWA: Sewa tempat, alat
 * - LISTRIK: Listrik, air
 * - GAJI: Gaji karyawan
 * - LAINNYA: Pengeluaran lainnya
 */
export type ExpenseCategory = 'OPERASIONAL' | 'TRANSPORT' | 'SEWA' | 'LISTRIK' | 'GAJI' | 'LAINNYA';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    'OPERASIONAL', 'TRANSPORT', 'SEWA', 'LISTRIK', 'GAJI', 'LAINNYA'
];

/**
 * DTO untuk membuat expense baru
 */
export class CreateExpenseDto {
    @IsIn(EXPENSE_CATEGORIES)
    category: ExpenseCategory;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    expense_date?: string; // Default to today if not provided
}

/**
 * DTO untuk update expense
 */
export class UpdateExpenseDto {
    @IsOptional()
    @IsIn(EXPENSE_CATEGORIES)
    category?: ExpenseCategory;

    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    expense_date?: string;
}
