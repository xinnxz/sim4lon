import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PenyaluranService } from './penyaluran.service';
import { CreatePenyaluranDto, UpdatePenyaluranDto, BulkUpdatePenyaluranDto, GetPenyaluranQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { user_role } from '@prisma/client';

@Controller('penyaluran')
@UseGuards(JwtAuthGuard)
export class PenyaluranController {
    constructor(private readonly penyaluranService: PenyaluranService) { }

    @Get()
    findAll(@Query() query: GetPenyaluranQueryDto) {
        return this.penyaluranService.findAll(query);
    }

    @Get('rekapitulasi')
    getRekapitulasi(
        @Query('bulan') bulan: string,
        @Query('tipe_pembayaran') tipePembayaran?: string,
        @Query('lpg_type') lpgType?: string,
    ) {
        return this.penyaluranService.getRekapitulasi(bulan, tipePembayaran, lpgType);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    create(@Body() dto: CreatePenyaluranDto) {
        return this.penyaluranService.create(dto);
    }

    @Post('bulk')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    bulkUpdate(@Body() dto: BulkUpdatePenyaluranDto) {
        return this.penyaluranService.bulkUpdate(dto);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    update(@Param('id') id: string, @Body() dto: UpdatePenyaluranDto) {
        return this.penyaluranService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    delete(@Param('id') id: string) {
        return this.penyaluranService.delete(id);
    }
}
