import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PangkalanService } from './pangkalan.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('pangkalan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class PangkalanController {
    constructor(private readonly pangkalanService: PangkalanService) { }

    @Get()
    async findAll(@Query('search') search?: string, @Query('isActive') isActive?: string) {
        const data = await this.pangkalanService.findAll({
            search,
            isActive: isActive ? isActive === 'true' : undefined,
        });
        return { success: true, data };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const data = await this.pangkalanService.findOne(id);
        return { success: true, data };
    }

    @Get(':id/summary')
    async getSummary(@Param('id') id: string) {
        const data = await this.pangkalanService.getSummary(id);
        return { success: true, data };
    }

    @Post()
    async create(@Body() body: any) {
        const data = await this.pangkalanService.create(body);
        return { success: true, data };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        const data = await this.pangkalanService.update(id, body);
        return { success: true, data };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.pangkalanService.remove(id);
        return { success: true, ...result };
    }
}
