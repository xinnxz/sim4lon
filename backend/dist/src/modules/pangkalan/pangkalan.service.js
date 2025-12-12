"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PangkalanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PangkalanService = class PangkalanService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        const [pangkalans, total] = await Promise.all([
            this.prisma.pangkalans.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    _count: {
                        select: { orders: true },
                    },
                },
            }),
            this.prisma.pangkalans.count({ where }),
        ]);
        return {
            data: pangkalans,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
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
            },
        });
        if (!pangkalan) {
            throw new common_1.NotFoundException('Pangkalan tidak ditemukan');
        }
        return pangkalan;
    }
    async create(dto) {
        const pangkalan = await this.prisma.pangkalans.create({
            data: {
                name: dto.name,
                address: dto.address,
                region: dto.region,
                pic_name: dto.pic_name,
                phone: dto.phone,
                capacity: dto.capacity,
                note: dto.note,
            },
        });
        return pangkalan;
    }
    async update(id, dto) {
        await this.findOne(id);
        const pangkalan = await this.prisma.pangkalans.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });
        return pangkalan;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.pangkalans.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return { message: 'Pangkalan berhasil dihapus' };
    }
};
exports.PangkalanService = PangkalanService;
exports.PangkalanService = PangkalanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PangkalanService);
//# sourceMappingURL=pangkalan.service.js.map