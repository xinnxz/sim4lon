import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';
import { LoginDto, RegisterDto, UpdateProfileDto } from './dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private activityService: ActivityService,
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

        // Log system activity for user creation
        await this.activityService.logActivity('system_create', 'User Baru Dibuat', {
            userId: user.id,
            description: `User ${user.name} (${user.role}) telah didaftarkan`,
        });

        return {
            message: 'Registrasi berhasil',
            user,
        };
    }

    async login(dto: LoginDto) {

        // Find user by email with pangkalan info
        const user = await this.prisma.users.findUnique({
            where: { email: dto.email },
            include: {
                pangkalans: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
            },
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

        // Generate unique session ID for single-session login
        // This invalidates any previous sessions
        const sessionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

        // Save session_id to database (invalidates old sessions)
        await this.prisma.users.update({
            where: { id: user.id },
            data: { session_id: sessionId },
        });

        // Generate JWT token with session_id for validation
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            pangkalan_id: user.pangkalan_id,
            session_id: sessionId,  // Include session_id for single-session validation
        };

        const accessToken = this.jwtService.sign(payload);

        // Log user login activity
        await this.activityService.logActivity('user_login', 'User Login', {
            userId: user.id,
            description: `${user.name} berhasil login`,
        });

        return {
            message: 'Login berhasil',
            access_token: accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                pangkalan_id: user.pangkalan_id,
                pangkalan: user.pangkalans,
            },
        };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                code: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                avatar_url: true,
                is_active: true,
                pangkalan_id: true,
                created_at: true,
                updated_at: true,
                pangkalans: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        address: true,
                        phone: true,
                    },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('User tidak ditemukan');
        }

        return user;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.prisma.users.update({
            where: { id: userId },
            data: {
                name: dto.name,
                phone: dto.phone,
                avatar_url: dto.avatar_url,
                updated_at: new Date(),
            },
            select: {
                id: true,
                code: true,
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

        return {
            message: 'Profil berhasil diperbarui',
            user,
        };
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        // Get user with password
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { id: true, password: true },
        });

        if (!user) {
            throw new UnauthorizedException('User tidak ditemukan');
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Kata sandi lama tidak sesuai');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.prisma.users.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                updated_at: new Date(),
            },
        });

        return {
            message: 'Kata sandi berhasil diubah',
        };
    }
}
