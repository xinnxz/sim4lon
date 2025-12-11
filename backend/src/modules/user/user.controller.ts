import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('role') role?: string,
        @Query('search') search?: string,
    ) {
        const result = await this.userService.findAll({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            role,
            search,
        });

        return { success: true, ...result };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        return { success: true, data: user };
    }

    @Post()
    async create(@Body() body: { email: string; password: string; name: string; role: UserRole; phone?: string }) {
        const user = await this.userService.create(body);
        return { success: true, data: user };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: { name?: string; phone?: string; isActive?: boolean }) {
        const user = await this.userService.update(id, body);
        return { success: true, data: user };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.userService.remove(id);
        return { success: true, ...result };
    }
}
