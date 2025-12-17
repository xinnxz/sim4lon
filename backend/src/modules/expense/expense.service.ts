import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

/**
 * ExpenseService - Business logic untuk pengeluaran pangkalan
 * 
 * Mengelola CRUD expense dan aggregate summary untuk laporan
 */
@Injectable()
export class ExpenseService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all expenses for a pangkalan with date filtering
     */
    async findAll(pangkalanId: string, startDate?: string, endDate?: string) {
        const where: any = { pangkalan_id: pangkalanId };

        if (startDate || endDate) {
            where.expense_date = {};
            if (startDate) where.expense_date.gte = new Date(startDate);
            if (endDate) where.expense_date.lte = new Date(endDate);
        }

        return this.prisma.expenses.findMany({
            where,
            orderBy: { expense_date: 'desc' },
        });
    }

    /**
     * Get expense by ID
     */
    async findById(id: string, pangkalanId: string) {
        return this.prisma.expenses.findFirst({
            where: {
                id,
                pangkalan_id: pangkalanId,
            },
        });
    }

    /**
     * Create new expense
     */
    async create(pangkalanId: string, dto: CreateExpenseDto) {
        return this.prisma.expenses.create({
            data: {
                pangkalan_id: pangkalanId,
                category: dto.category,
                amount: dto.amount,
                description: dto.description,
                expense_date: dto.expense_date ? new Date(dto.expense_date) : new Date(),
            },
        });
    }

    /**
     * Update expense
     */
    async update(id: string, pangkalanId: string, dto: UpdateExpenseDto) {
        // Verify expense belongs to pangkalan
        const existing = await this.findById(id, pangkalanId);
        if (!existing) {
            throw new Error('Expense not found');
        }

        return this.prisma.expenses.update({
            where: { id },
            data: {
                ...(dto.category && { category: dto.category }),
                ...(dto.amount !== undefined && { amount: dto.amount }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.expense_date && { expense_date: new Date(dto.expense_date) }),
                updated_at: new Date(),
            },
        });
    }

    /**
     * Delete expense
     */
    async delete(id: string, pangkalanId: string) {
        // Verify expense belongs to pangkalan
        const existing = await this.findById(id, pangkalanId);
        if (!existing) {
            throw new Error('Expense not found');
        }

        return this.prisma.expenses.delete({ where: { id } });
    }

    /**
     * Get expense summary by date range (for report integration)
     */
    async getSummary(pangkalanId: string, startDate: string, endDate: string) {
        const expenses = await this.findAll(pangkalanId, startDate, endDate);

        // Total overall
        const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

        // Group by category
        const byCategory: Record<string, number> = {};
        expenses.forEach(e => {
            byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
        });

        // Group by date
        const byDate: Record<string, number> = {};
        expenses.forEach(e => {
            const dateStr = new Date(e.expense_date).toISOString().split('T')[0];
            byDate[dateStr] = (byDate[dateStr] || 0) + Number(e.amount);
        });

        return {
            total,
            count: expenses.length,
            byCategory,
            byDate,
        };
    }
}
