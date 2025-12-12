import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PangkalanService } from './pangkalan.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';

@Controller('pangkalans')
@UseGuards(JwtAuthGuard)
export class PangkalanController {
    constructor(private readonly pangkalanService: PangkalanService) { }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('is_active') isActive?: string,
        @Query('search') search?: string,
    ) {
        return this.pangkalanService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            isActive !== undefined ? isActive === 'true' : undefined,
            search,
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pangkalanService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreatePangkalanDto) {
        return this.pangkalanService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePangkalanDto) {
        return this.pangkalanService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pangkalanService.remove(id);
    }
}
