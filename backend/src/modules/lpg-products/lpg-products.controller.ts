import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LpgProductsService } from './lpg-products.service';
import { CreateLpgProductDto, UpdateLpgProductDto, CreateLpgPriceDto } from './dto';
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

    // ==================== PRICES ====================

    /**
     * Add price variant to product (Admin only)
     */
    @Post(':productId/prices')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    addPrice(
        @Param('productId') productId: string,
        @Body() dto: CreateLpgPriceDto,
    ) {
        return this.lpgProductsService.addPrice(productId, dto);
    }

    /**
     * Update price variant (Admin only)
     */
    @Put('prices/:priceId')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    updatePrice(
        @Param('priceId') priceId: string,
        @Body() dto: CreateLpgPriceDto,
    ) {
        return this.lpgProductsService.updatePrice(priceId, dto);
    }

    /**
     * Delete price variant (Admin only)
     */
    @Delete('prices/:priceId')
    @UseGuards(RolesGuard)
    @Roles(user_role.ADMIN)
    removePrice(@Param('priceId') priceId: string) {
        return this.lpgProductsService.removePrice(priceId);
    }
}
