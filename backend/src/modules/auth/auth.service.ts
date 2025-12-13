import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if email already exists
        const existingUser = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email sudah terdaftar');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Generate user code (USR-001, USR-002, etc.)
        const userCount = await this.prisma.users.count();
        const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;

        // Create user
        const user = await this.prisma.users.create({
            data: {
                code: userCode,  // Required display code
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                phone: dto.phone,
                role: dto.role || 'OPERATOR',
            },
            select: {
                id: true,
                code: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
            },
        });

        return {
            message: 'Registrasi berhasil',
            user,
        };
    }

    async login(dto: LoginDto) {

        // Find user by email
        const user = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // Check if user is active
        if (!user.is_active) {
            throw new UnauthorizedException('Akun tidak aktif');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            message: 'Login berhasil',
            access_token: accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                avatar_url: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User tidak ditemukan');
        }

        return user;
    }
}
