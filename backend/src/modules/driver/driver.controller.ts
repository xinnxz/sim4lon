import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto, UpdateDriverDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';

@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriverController {
    constructor(private readonly driverService: DriverService) { }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('is_active') isActive?: string,
    ) {
        return this.driverService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            isActive !== undefined ? isActive === 'true' : undefined,
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.driverService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateDriverDto) {
        return this.driverService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
        return this.driverService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.driverService.remove(id);
    }
}
