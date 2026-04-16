"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ExpenseService = class ExpenseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(pangkalanId, startDate, endDate) {
        const where = { pangkalan_id: pangkalanId };
        if (startDate || endDate) {
            where.expense_date = {};
            if (startDate)
                where.expense_date.gte = new Date(startDate);
            if (endDate)
                where.expense_date.lte = new Date(endDate);
        }
        return this.prisma.expenses.findMany({
            where,
            orderBy: { expense_date: 'desc' },
        });
    }
    async findById(id, pangkalanId) {
        return this.prisma.expenses.findFirst({
            where: {
                id,
                pangkalan_id: pangkalanId,
            },
        });
    }
    async create(pangkalanId, dto) {
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
    async update(id, pangkalanId, dto) {
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
    async delete(id, pangkalanId) {
        const existing = await this.findById(id, pangkalanId);
        if (!existing) {
            throw new Error('Expense not found');
        }
        return this.prisma.expenses.delete({ where: { id } });
    }
    async getSummary(pangkalanId, startDate, endDate) {
        const expenses = await this.findAll(pangkalanId, startDate, endDate);
        const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const byCategory = {};
        expenses.forEach(e => {
            byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
        });
        const byDate = {};
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
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map