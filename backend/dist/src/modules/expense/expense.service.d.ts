import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
export declare class ExpenseService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(pangkalanId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    }[]>;
    findById(id: string, pangkalanId: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    } | null>;
    create(pangkalanId: string, dto: CreateExpenseDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    }>;
    update(id: string, pangkalanId: string, dto: UpdateExpenseDto): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    }>;
    delete(id: string, pangkalanId: string): Promise<{
        id: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: string;
        expense_date: Date;
    }>;
    getSummary(pangkalanId: string, startDate: string, endDate: string): Promise<{
        total: number;
        count: number;
        byCategory: Record<string, number>;
        byDate: Record<string, number>;
    }>;
}
