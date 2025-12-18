import { Controller, Get, Put, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { LpgPriceService } from './lpg-price.service';
import { UpdateLpgPriceDto, BulkUpdateLpgPricesDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role } from '@prisma/client';

/**
 * LpgPriceController
 * 
 * Controller untuk mengelola harga default LPG per pangkalan.
 * Hanya bisa diakses oleh user dengan role PANGKALAN.
 */
@Controller('lpg-prices')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(user_role.PANGKALAN)
export class LpgPriceController {
    constructor(private readonly lpgPriceService: LpgPriceService) { }

    /**
     * Get all LPG prices for current pangkalan
     * GET /lpg-prices
     */
    @Get()
    findAll(@Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.lpgPriceService.findAll(pangkalanId);
    }

    /**
     * Update a single price
     * PUT /lpg-prices/:id
     */
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateLpgPriceDto,
        @Req() req: any,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.lpgPriceService.update(id, pangkalanId, dto);
    }

    /**
     * Bulk update all prices
     * POST /lpg-prices/bulk
     */
    @Post('bulk')
    bulkUpdate(
        @Body() dto: BulkUpdateLpgPricesDto,
        @Req() req: any,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.lpgPriceService.bulkUpdate(pangkalanId, dto.prices);
    }
}
