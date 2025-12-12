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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DriverService = class DriverService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, isActive) {
        const skip = (page - 1) * limit;
        const where = { deleted_at: null };
        if (isActive !== undefined) {
            where.is_active = isActive;
        }
        const [drivers, total] = await Promise.all([
            this.prisma.drivers.findMany({
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
            this.prisma.drivers.count({ where }),
        ]);
        return {
            data: drivers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const driver = await this.prisma.drivers.findFirst({
            where: { id, deleted_at: null },
            include: {
                _count: {
                    select: { orders: true },
                },
            },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver tidak ditemukan');
        }
        return driver;
    }
    async create(dto) {
        const driver = await this.prisma.drivers.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                vehicle_id: dto.vehicle_id,
                note: dto.note,
            },
        });
        return driver;
    }
    async update(id, dto) {
        await this.findOne(id);
        const driver = await this.prisma.drivers.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });
        return driver;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.drivers.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return { message: 'Driver berhasil dihapus' };
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DriverService);
//# sourceMappingURL=driver.service.js.map