import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PenerimaanService } from './penerimaan.service';
import { CreatePenerimaanDto, GetPenerimaanQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { user_role } from '@prisma/client';

@Controller('penerimaan')
@UseGuards(JwtAuthGuard)
export class PenerimaanController {
    constructor(private readonly penerimaanService: PenerimaanService) { }

    @Get()
    findAll(@Query() query: GetPenerimaanQueryDto) {
        return this.penerimaanService.findAll(query);
    }

    @Get('in-out-agen')
    getInOutAgen(@Query('bulan') bulan: string) {
        return this.penerimaanService.getInOutAgen(bulan);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    create(@Body() dto: CreatePenerimaanDto) {
        return this.penerimaanService.create(dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    delete(@Param('id') id: string) {
        return this.penerimaanService.delete(id);
    }
}
