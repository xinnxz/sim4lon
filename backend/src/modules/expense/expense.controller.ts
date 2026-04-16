import {
    Controller, Get, Post, Put, Delete,
    Body, Param, Query, UseGuards, Req
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

/**
 * ExpenseController - API endpoints untuk pengeluaran pangkalan
 * 
 * Hanya bisa diakses oleh user PANGKALAN
 */
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PANGKALAN')
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) { }

    /**
     * GET /expenses - Get all expenses for pangkalan
     */
    @Get()
    async findAll(
        @Req() req: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.expenseService.findAll(pangkalanId, startDate, endDate);
    }

    /**
     * GET /expenses/summary - Get expense summary (for report)
     */
    @Get('summary')
    async getSummary(
        @Req() req: any,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.expenseService.getSummary(pangkalanId, startDate, endDate);
    }

    /**
     * GET /expenses/:id - Get expense by ID
     */
    @Get(':id')
    async findById(@Req() req: any, @Param('id') id: string) {
        const pangkalanId = req.user.pangkalan_id;
        return this.expenseService.findById(id, pangkalanId);
    }

    /**
     * POST /expenses - Create new expense
     */
    @Post()
    async create(@Req() req: any, @Body() dto: CreateExpenseDto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.expenseService.create(pangkalanId, dto);
    }

    /**
     * PUT /expenses/:id - Update expense
     */
    @Put(':id')
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateExpenseDto,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.expenseService.update(id, pangkalanId, dto);
    }

    /**
     * DELETE /expenses/:id - Delete expense
     */
    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const pangkalanId = req.user.pangkalan_id;
        await this.expenseService.delete(id, pangkalanId);
        return { message: 'Expense deleted successfully' };
    }
}
