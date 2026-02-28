import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';
import { LoginDto, RegisterDto, RegisterPangkalanDto, UpdateProfileDto } from './dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private activityService: ActivityService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if email already exists (exclude soft-deleted users)
        const existingUser = await this.prisma.users.findFirst({
            where: {
                email: dto.email,
                deleted_at: null,  // Exclude soft-deleted users
            },
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

    /**
     * Self-registration untuk pangkalan baru
     * 
     * Transaction:
     * 1. Create pangkalan record
     * 2. Create user (role=PANGKALAN) linked to pangkalan
     * 3. Create FREE subscription (trial 14 hari)
     * 4. Setup default LPG prices
     * 5. Auto-login (return JWT)
     */
    async registerPangkalan(dto: RegisterPangkalanDto) {
        // Check if email already exists
        const existingUser = await this.prisma.users.findFirst({
            where: { email: dto.email, deleted_at: null },
        });

        if (existingUser) {
            throw new ConflictException('Email sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Generate codes
        const pangkalanCount = await this.prisma.pangkalans.count();
        const pangkalanCode = `PKL-${String(pangkalanCount + 1).padStart(3, '0')}`;
        const userCount = await this.prisma.users.count();
        const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;

        // Trial period: 14 days
        const trialExpiry = new Date();
        trialExpiry.setDate(trialExpiry.getDate() + 14);

        // Atomic transaction: create everything or nothing
        const result = await this.prisma.$transaction(async (tx: any) => {
            // 1. Create pangkalan
            const pangkalan = await tx.pangkalans.create({
                data: {
                    code: pangkalanCode,
                    name: dto.pangkalan_name,
                    address: dto.address,
                    region: dto.region,
                    pic_name: dto.owner_name,
                    phone: dto.phone,
                    email: dto.email,
                    is_active: true,
                },
            });

            // 2. Create user linked to pangkalan
            const user = await tx.users.create({
                data: {
                    code: userCode,
                    email: dto.email,
                    password: hashedPassword,
                    name: dto.owner_name,
                    phone: dto.phone,
                    role: 'PANGKALAN',
                    pangkalan_id: pangkalan.id,
                },
            });

            // 3. Create FREE subscription (14-day trial)
            // Note: Needs `prisma generate` after migration for type safety
            await tx.subscriptions.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    plan: 'FREE',
                    status: 'TRIAL',
                    expires_at: trialExpiry,
                },
            });

            // 4. Setup default LPG price (3kg subsidi)
            await tx.lpg_prices.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    lpg_type: 'kg3',
                    cost_price: 13250,
                    selling_price: 16000,
                    is_active: true,
                },
            });

            return { pangkalan, user };
        }) as { pangkalan: any; user: any };

        // 5. Auto-login: generate JWT
        const sessionId = `${result.user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

        await this.prisma.users.update({
            where: { id: result.user.id },
            data: { session_id: sessionId },
        });

        const payload = {
            sub: result.user.id,
            email: result.user.email,
            role: result.user.role,
            pangkalan_id: result.pangkalan.id,
            session_id: sessionId,
        };

        const accessToken = this.jwtService.sign(payload);

        // Log activity
        await this.activityService.logActivity('system_create', 'Pangkalan Baru Terdaftar', {
            userId: result.user.id,
            description: `Pangkalan ${result.pangkalan.name} (${pangkalanCode}) didaftarkan oleh ${dto.owner_name}`,
        });

        return {
            message: 'Registrasi pangkalan berhasil! Selamat datang di SIM4LON 🎉',
            access_token: accessToken,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role,
                pangkalan_id: result.pangkalan.id,
                pangkalan: {
                    id: result.pangkalan.id,
                    code: result.pangkalan.code,
                    name: result.pangkalan.name,
                },
            },
            trial_expires_at: trialExpiry.toISOString(),
        };
    }

    async login(dto: LoginDto) {

        // Find user by email with pangkalan info
        // Note: findUnique doesn't support deleted_at filter, so we use findFirst
        const user = await this.prisma.users.findFirst({
            where: {
                email: dto.email,
                deleted_at: null,  // Exclude soft-deleted users
            },
            include: {
                pangkalans: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        is_active: true,  // For pangkalan status validation
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

        // Check if pangkalan is active (for PANGKALAN role users)
        // Best practice: Block login if the associated pangkalan is deactivated


        if (user.role === 'PANGKALAN' && user.pangkalans && !user.pangkalans.is_active) {
            throw new UnauthorizedException('Pangkalan Anda sudah dinonaktifkan. Hubungi agen untuk informasi lebih lanjut.');
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
                        region: true,
                        pic_name: true,
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
        // First get user to check role and pangkalan_id
        const existingUser = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { role: true, pangkalan_id: true },
        });

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
                pangkalan_id: true,
            },
        });

        // Auto-sync to pangkalans table if user is PANGKALAN
        if (existingUser?.role === 'PANGKALAN' && existingUser?.pangkalan_id) {
            const pangkalanUpdateData: any = {};
            if (dto.name) pangkalanUpdateData.pic_name = dto.name;
            if (dto.phone) pangkalanUpdateData.phone = dto.phone;

            if (Object.keys(pangkalanUpdateData).length > 0) {
                await this.prisma.pangkalans.update({
                    where: { id: existingUser.pangkalan_id },
                    data: pangkalanUpdateData,
                });
            }
        }

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
