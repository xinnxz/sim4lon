import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);

        // Set JWT in HttpOnly cookie
        res.cookie('token', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return {
            success: true,
            data: {
                user: result.user,
            },
        };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token');
        return {
            success: true,
            message: 'Logged out',
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@CurrentUser() user: any) {
        const profile = await this.authService.getProfile(user.sub);
        return {
            success: true,
            data: profile,
        };
    }
}
