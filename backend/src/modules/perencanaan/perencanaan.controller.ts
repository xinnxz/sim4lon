import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PerencanaanService } from './perencanaan.service';
import { CreatePerencanaanDto, UpdatePerencanaanDto, BulkUpdatePerencanaanDto, GetPerencanaanQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { user_role } from '@prisma/client';

@Controller('perencanaan')
@UseGuards(JwtAuthGuard)
export class PerencanaanController {
    constructor(private readonly perencanaanService: PerencanaanService) { }

    /**
     * GET /perencanaan
     * Get all perencanaan with filters
     */
    @Get()
    findAll(@Query() query: GetPerencanaanQueryDto) {
        return this.perencanaanService.findAll(query);
    }

    /**
     * GET /perencanaan/rekapitulasi
     * Get rekapitulasi grid for a month
     */
    @Get('rekapitulasi')
    getRekapitulasi(
        @Query('bulan') bulan: string,
        @Query('kondisi') kondisi?: string,
        @Query('lpg_type') lpgType?: string,
    ) {
        return this.perencanaanService.getRekapitulasi(bulan, kondisi, lpgType);
    }

    /**
     * POST /perencanaan
     * Create single perencanaan entry
     */
    @Post()
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    create(@Body() dto: CreatePerencanaanDto) {
        return this.perencanaanService.create(dto);
    }

    /**
     * POST /perencanaan/bulk
     * Bulk update perencanaan (for grid input)
     */
    @Post('bulk')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    bulkUpdate(@Body() dto: BulkUpdatePerencanaanDto) {
        return this.perencanaanService.bulkUpdate(dto);
    }

    /**
     * PUT /perencanaan/:id
     * Update single entry
     */
    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    update(@Param('id') id: string, @Body() dto: UpdatePerencanaanDto) {
        return this.perencanaanService.update(id, dto);
    }

    /**
     * DELETE /perencanaan/:id
     * Delete entry
     */
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    delete(@Param('id') id: string) {
        return this.perencanaanService.delete(id);
    }

    /**
     * POST /perencanaan/auto-generate
     * Auto-generate perencanaan from pangkalan's alokasi_bulanan
     */
    @Post('auto-generate')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN, user_role.OPERATOR)
    autoGenerate(
        @Body() body: { bulan: string; lpg_type?: string; kondisi?: string; overwrite?: boolean }
    ) {
        return this.perencanaanService.autoGenerate(
            body.bulan,
            body.lpg_type || 'kg3',
            body.kondisi || 'NORMAL',
            body.overwrite || false
        );
    }
}
