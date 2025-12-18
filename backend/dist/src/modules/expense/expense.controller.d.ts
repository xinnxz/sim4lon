import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    findAll(req: any, startDate?: string, endDate?: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    }[]>;
    getSummary(req: any, startDate: string, endDate: string): Promise<{
        total: number;
        count: number;
        byCategory: Record<string, number>;
        byDate: Record<string, number>;
    }>;
    findById(req: any, id: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    } | null>;
    create(req: any, dto: CreateExpenseDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    }>;
    update(req: any, id: string, dto: UpdateExpenseDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    }>;
    delete(req: any, id: string): Promise<{
        message: string;
    }>;
}
