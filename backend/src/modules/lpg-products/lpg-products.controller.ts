import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LpgProductsService } from './lpg-products.service';
import { CreateLpgProductDto, UpdateLpgProductDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { user_role } from '@prisma/client';

@Controller('lpg-products')
@UseGuards(JwtAuthGuard)
export class LpgProductsController {
    constructor(private readonly lpgProductsService: LpgProductsService) { }

    /**
     * Get all LPG products
     */
    @Get()
    findAll(@Query('includeInactive') includeInactive?: string) {
        return this.lpgProductsService.findAll(includeInactive === 'true');
    }

    /**
     * Get LPG products with stock summary
     */
    @Get('with-stock')
    getWithStock() {
        return this.lpgProductsService.getStockSummary();
    }

    /**
     * Get single product
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.lpgProductsService.findOne(id);
    }

    /**
     * Create new LPG product (Admin only)
     */
    @Post()
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    create(@Body() dto: CreateLpgProductDto) {
        return this.lpgProductsService.create(dto);
    }

    /**
     * Update LPG product (Admin only)
     */
    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateLpgProductDto) {
        return this.lpgProductsService.update(id, dto);
    }

    /**
     * Delete LPG product (Admin only)
     */
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    remove(@Param('id') id: string) {
        return this.lpgProductsService.remove(id);
    }
}
