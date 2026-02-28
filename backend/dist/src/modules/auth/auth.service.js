"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = require("../../prisma");
const activity_service_1 = require("../activity/activity.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    activityService;
    constructor(prisma, jwtService, activityService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.activityService = activityService;
    }
    async register(dto) {
        const existingUser = await this.prisma.users.findFirst({
            where: {
                email: dto.email,
                deleted_at: null,
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const userCount = await this.prisma.users.count();
        const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;
        const user = await this.prisma.users.create({
            data: {
                code: userCode,
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
        await this.activityService.logActivity('system_create', 'User Baru Dibuat', {
            userId: user.id,
            description: `User ${user.name} (${user.role}) telah didaftarkan`,
        });
        return {
            message: 'Registrasi berhasil',
            user,
        };
    }
    async registerPangkalan(dto) {
        const existingUser = await this.prisma.users.findFirst({
            where: { email: dto.email, deleted_at: null },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const pangkalanCount = await this.prisma.pangkalans.count();
        const pangkalanCode = `PKL-${String(pangkalanCount + 1).padStart(3, '0')}`;
        const userCount = await this.prisma.users.count();
        const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;
        const trialExpiry = new Date();
        trialExpiry.setDate(trialExpiry.getDate() + 14);
        const result = await this.prisma.$transaction(async (tx) => {
            const pangkalan = await tx.pangkalans.create({
                data: {
                    code: pangkalanCode,
                    name: dto.pangkalan_name,
                    address: dto.address,
                    region: dto.region || null,
                    pic_name: dto.owner_name,
                    phone: dto.phone || null,
                    email: dto.email,
                    is_active: true,
                },
            });
            const user = await tx.users.create({
                data: {
                    code: userCode,
                    email: dto.email,
                    password: hashedPassword,
                    name: dto.owner_name,
                    phone: dto.phone || null,
                    role: 'PANGKALAN',
                    pangkalan_id: pangkalan.id,
                },
            });
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
        });
        try {
            await this.prisma.subscriptions.create({
                data: {
                    pangkalan_id: result.pangkalan.id,
                    plan: 'FREE',
                    status: 'TRIAL',
                    expires_at: trialExpiry,
                },
            });
        }
        catch (e) {
            console.warn('Subscription creation skipped (table may not exist):', e);
        }
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
    async login(dto) {
        const user = await this.prisma.users.findFirst({
            where: {
                email: dto.email,
                deleted_at: null,
            },
            include: {
                pangkalans: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        is_active: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('Akun tidak aktif');
        }
        if (user.role === 'PANGKALAN' && user.pangkalans && !user.pangkalans.is_active) {
            throw new common_1.UnauthorizedException('Pangkalan Anda sudah dinonaktifkan. Hubungi agen untuk informasi lebih lanjut.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        const sessionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        await this.prisma.users.update({
            where: { id: user.id },
            data: { session_id: sessionId },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            pangkalan_id: user.pangkalan_id,
            session_id: sessionId,
        };
        const accessToken = this.jwtService.sign(payload);
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
    async getProfile(userId) {
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
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        }
        return user;
    }
    async updateProfile(userId, dto) {
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
        if (existingUser?.role === 'PANGKALAN' && existingUser?.pangkalan_id) {
            const pangkalanUpdateData = {};
            if (dto.name)
                pangkalanUpdateData.pic_name = dto.name;
            if (dto.phone)
                pangkalanUpdateData.phone = dto.phone;
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
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { id: true, password: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Kata sandi lama tidak sesuai');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        jwt_1.JwtService,
        activity_service_1.ActivityService])
], AuthService);
//# sourceMappingURL=auth.service.js.map