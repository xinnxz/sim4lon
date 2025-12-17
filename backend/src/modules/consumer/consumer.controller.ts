import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto, UpdateConsumerDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role } from '@prisma/client';

/**
 * ConsumerController
 * 
 * Controller untuk mengelola data konsumen/pelanggan pangkalan.
 * Hanya bisa diakses oleh user dengan role PANGKALAN.
 * 
 * PENJELASAN:
 * - Semua endpoint di-protect dengan JwtAuthGuard dan RolesGuard
 * - pangkalan_id diambil dari JWT token (req.user.pangkalan_id)
 * - Setiap consumer hanya bisa diakses oleh pangkalan yang memilikinya
 */
@Controller('consumers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(user_role.PANGKALAN)  // Only PANGKALAN role can access
export class ConsumerController {
    constructor(private readonly consumerService: ConsumerService) { }

    /**
     * Get all consumers for current pangkalan
     * GET /consumers?page=1&limit=10&search=warung
     */
    @Get()
    findAll(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.findAll(
            pangkalanId,
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            search,
        );
    }

    /**
     * Get consumer stats for dashboard
     * GET /consumers/stats
     */
    @Get('stats')
    getStats(@Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.getStats(pangkalanId);
    }

    /**
     * Get single consumer by ID
     * GET /consumers/:id
     */
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.findOne(id, pangkalanId);
    }

    /**
     * Create new consumer
     * POST /consumers
     */
    @Post()
    create(@Body() dto: CreateConsumerDto, @Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.create(pangkalanId, dto);
    }

    /**
     * Update consumer
     * PUT /consumers/:id
     */
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateConsumerDto,
        @Req() req: any,
    ) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.update(id, pangkalanId, dto);
    }

    /**
     * Delete consumer
     * DELETE /consumers/:id
     */
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.remove(id, pangkalanId);
    }
}
