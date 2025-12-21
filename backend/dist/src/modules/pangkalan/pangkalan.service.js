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
exports.PangkalanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const activity_service_1 = require("../activity/activity.service");
let PangkalanService = class PangkalanService {
    prisma;
    activityService;
    constructor(prisma, activityService) {
        this.prisma = prisma;
        this.activityService = activityService;
    }
    async findAll(page = 1, limit = 10, isActive, search) {
        const skip = (page - 1) * limit;
        const where = { deleted_at: null };
        if (isActive !== undefined) {
            where.is_active = isActive;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { region: { contains: search, mode: 'insensitive' } },
                { pic_name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [pangkalans, total, totalActive, totalInactive] = await Promise.all([
            this.prisma.pangkalans.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    _count: {
                        select: { orders: true },
                    },
                    users: {
                        where: { deleted_at: null },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            is_active: true,
                        },
                        take: 1,
                    },
                },
            }),
            this.prisma.pangkalans.count({ where }),
            this.prisma.pangkalans.count({ where: { deleted_at: null, is_active: true } }),
            this.prisma.pangkalans.count({ where: { deleted_at: null, is_active: false } }),
        ]);
        return {
            data: pangkalans,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalActive,
                totalInactive,
                totalAll: totalActive + totalInactive,
            },
        };
    }
    async findOne(id) {
        const pangkalan = await this.prisma.pangkalans.findFirst({
            where: { id, deleted_at: null },
            include: {
                _count: {
                    select: { orders: true },
                },
                users: {
                    where: { deleted_at: null },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        is_active: true,
                    },
                },
            },
        });
        if (!pangkalan) {
            throw new common_1.NotFoundException('Pangkalan tidak ditemukan');
        }
        return pangkalan;
    }
    async create(dto) {
        if ((dto.login_email && !dto.login_password) || (!dto.login_email && dto.login_password)) {
            throw new common_1.BadRequestException('Email login dan password harus diisi keduanya');
        }
        if (dto.login_email) {
            const existingUser = await this.prisma.users.findUnique({
                where: { email: dto.login_email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Email login sudah digunakan');
            }
        }
        const pangkalanCount = await this.prisma.pangkalans.count();
        const pangkalanCode = `PKL-${String(pangkalanCount + 1).padStart(3, '0')}`;
        const pangkalan = await this.prisma.pangkalans.create({
            data: {
                code: pangkalanCode,
                name: dto.name,
                address: dto.address,
                region: dto.region,
                pic_name: dto.pic_name,
                phone: dto.phone,
                email: dto.email,
                capacity: dto.capacity,
                alokasi_bulanan: dto.alokasi_bulanan || 0,
                note: dto.note,
            },
        });
        if (dto.login_email && dto.login_password) {
            const userCount = await this.prisma.users.count();
            const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;
            const hashedPassword = await bcrypt.hash(dto.login_password, 10);
            await this.prisma.users.create({
                data: {
                    code: userCode,
                    email: dto.login_email,
                    password: hashedPassword,
                    name: dto.pic_name || dto.name,
                    phone: dto.phone,
                    role: 'PANGKALAN',
                    pangkalan_id: pangkalan.id,
                },
            });
        }
        await this.activityService.logActivity('system_create', 'Pangkalan Baru Dibuat', {
            description: `Pangkalan ${dto.name} (${pangkalanCode}) berhasil ditambahkan`,
            pangkalanName: dto.name,
        });
        return this.findOne(pangkalan.id);
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const pangkalan = await this.prisma.pangkalans.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });
        await this.activityService.logActivity('system_update', 'Data Pangkalan Diperbarui', {
            description: `Data ${existing.name} berhasil diperbarui`,
            pangkalanName: existing.name,
        });
        return pangkalan;
    }
    async remove(id) {
        const existing = await this.findOne(id);
        await this.prisma.pangkalans.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        await this.activityService.logActivity('system_delete', 'Pangkalan Dihapus', {
            description: `Pangkalan ${existing.name} berhasil dihapus`,
            pangkalanName: existing.name,
        });
        return { message: 'Pangkalan berhasil dihapus' };
    }
};
exports.PangkalanService = PangkalanService;
exports.PangkalanService = PangkalanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_service_1.ActivityService])
], PangkalanService);
//# sourceMappingURL=pangkalan.service.js.map