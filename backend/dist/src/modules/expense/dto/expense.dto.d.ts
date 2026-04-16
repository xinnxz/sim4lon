export type ExpenseCategory = 'OPERASIONAL' | 'TRANSPORT' | 'SEWA' | 'LISTRIK' | 'GAJI' | 'LAINNYA';
export declare const EXPENSE_CATEGORIES: ExpenseCategory[];
export declare class CreateExpenseDto {
    category: ExpenseCategory;
    amount: number;
    description?: string;
    expense_date?: string;
}
export declare class UpdateExpenseDto {
    category?: ExpenseCategory;
    amount?: number;
    description?: string;
    expense_date?: string;
}
