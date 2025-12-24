import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    pangkalan_id?: string;
    session_id?: string;  // For single-session validation
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        const options: StrategyOptionsWithoutRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-key',
        };
        super(options);
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.users.findUnique({
            where: { id: payload.sub },
            include: {
                pangkalans: {
                    select: {
                        is_active: true,
                    },
                },
            },
        });

        if (!user || !user.is_active) {
            throw new UnauthorizedException('User tidak ditemukan atau tidak aktif');
        }

        // Check if pangkalan is active (for PANGKALAN role users)
        // Force logout if pangkalan is deactivated while user is logged in
        if (user.role === 'PANGKALAN' && user.pangkalans && !user.pangkalans.is_active) {
            throw new UnauthorizedException('Pangkalan Anda sudah dinonaktifkan. Silakan hubungi agen.');
        }

        // TEMPORARILY DISABLED FOR TESTING - Enable for production
        // Single-session validation: check if JWT session_id matches DB session_id
        // if (payload.session_id && user.session_id && payload.session_id !== user.session_id) {
        //     throw new UnauthorizedException('Sesi tidak valid. Anda mungkin sudah login di perangkat lain.');
        // }

        return user;
    }
}
