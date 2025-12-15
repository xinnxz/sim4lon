import { Controller, Post, Body, Get, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdateProfileDto } from './dto';
import { JwtAuthGuard } from './guards';
import { CurrentUser, Public } from './decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser('id') userId: string) {
        return this.authService.getProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
        return this.authService.updateProfile(userId, dto);
    }
}
