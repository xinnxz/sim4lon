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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = { deleted_at: null };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.users.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    is_active: true,
                    avatar_url: true,
                    created_at: true,
                    updated_at: true,
                },
            }),
            this.prisma.users.count({ where }),
        ]);
        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.users.findFirst({
            where: { id, deleted_at: null },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                is_active: true,
                avatar_url: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        return user;
    }
    async create(dto) {
        const existingUser = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.users.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                phone: dto.phone,
                role: dto.role || 'OPERATOR',
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                is_active: true,
                created_at: true,
            },
        });
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        const user = await this.prisma.users.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                is_active: true,
                avatar_url: true,
                updated_at: true,
            },
        });
        return user;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.users.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return { message: 'User berhasil dihapus' };
    }
    async resetPassword(id) {
        await this.findOne(id);
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let newPassword = '';
        for (let i = 0; i < 12; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.users.update({
            where: { id },
            data: {
                password: hashedPassword,
                updated_at: new Date(),
            },
        });
        return {
            message: 'Password berhasil direset',
            newPassword: newPassword
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map