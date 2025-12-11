import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DriverController {
    constructor(private readonly driverService: DriverService) { }

    @Get()
    async findAll() {
        const drivers = await this.driverService.findAll();
        return { success: true, data: drivers };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const driver = await this.driverService.findOne(id);
        return { success: true, data: driver };
    }

    @Post()
    async create(@Body() body: { userId: string; name: string; phone?: string; vehicleId?: string; note?: string }) {
        const driver = await this.driverService.create(body);
        return { success: true, data: driver };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        const driver = await this.driverService.update(id, body);
        return { success: true, data: driver };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.driverService.remove(id);
        return { success: true, ...result };
    }
}
