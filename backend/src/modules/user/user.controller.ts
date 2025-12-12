import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { user_role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @Roles(user_role.ADMIN)
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.userService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            search,
        );
    }

    @Get(':id')
    @Roles(user_role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Post()
    @Roles(user_role.ADMIN)
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Put(':id')
    @Roles(user_role.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @Roles(user_role.ADMIN)
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Post(':id/reset-password')
    @Roles(user_role.ADMIN)
    resetPassword(@Param('id') id: string) {
        return this.userService.resetPassword(id);
    }
}
