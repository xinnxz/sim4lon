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
exports.ConsumerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConsumerService = class ConsumerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(pangkalanId, page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = {
            pangkalan_id: pangkalanId,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [consumers, total] = await Promise.all([
            this.prisma.consumers.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    _count: {
                        select: { consumer_orders: true },
                    },
                },
            }),
            this.prisma.consumers.count({ where }),
        ]);
        return {
            data: consumers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, pangkalanId) {
        const consumer = await this.prisma.consumers.findFirst({
            where: { id },
            include: {
                _count: {
                    select: { consumer_orders: true },
                },
            },
        });
        if (!consumer) {
            throw new common_1.NotFoundException('Pelanggan tidak ditemukan');
        }
        if (consumer.pangkalan_id !== pangkalanId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke data ini');
        }
        return consumer;
    }
    async create(pangkalanId, dto) {
        const consumer = await this.prisma.consumers.create({
            data: {
                pangkalan_id: pangkalanId,
                name: dto.name,
                nik: dto.nik,
                kk: dto.kk,
                consumer_type: dto.consumer_type || 'RUMAH_TANGGA',
                phone: dto.phone,
                address: dto.address,
                note: dto.note,
            },
        });
        return consumer;
    }
    async update(id, pangkalanId, dto) {
        await this.findOne(id, pangkalanId);
        const consumer = await this.prisma.consumers.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });
        return consumer;
    }
    async remove(id, pangkalanId) {
        await this.findOne(id, pangkalanId);
        const orderCount = await this.prisma.consumer_orders.count({
            where: { consumer_id: id },
        });
        if (orderCount > 0) {
            await this.prisma.consumers.update({
                where: { id },
                data: { is_active: false },
            });
            return { message: 'Pelanggan dinonaktifkan karena memiliki riwayat pesanan' };
        }
        await this.prisma.consumers.delete({
            where: { id },
        });
        return { message: 'Pelanggan berhasil dihapus' };
    }
    async getStats(pangkalanId) {
        const [total, active, rumahTangga, warung, withNik] = await Promise.all([
            this.prisma.consumers.count({
                where: { pangkalan_id: pangkalanId },
            }),
            this.prisma.consumers.count({
                where: { pangkalan_id: pangkalanId, is_active: true },
            }),
            this.prisma.consumers.count({
                where: { pangkalan_id: pangkalanId, consumer_type: 'RUMAH_TANGGA' },
            }),
            this.prisma.consumers.count({
                where: { pangkalan_id: pangkalanId, consumer_type: 'WARUNG' },
            }),
            this.prisma.consumers.count({
                where: {
                    pangkalan_id: pangkalanId,
                    nik: { not: null }
                },
            }),
        ]);
        return {
            total,
            active,
            inactive: total - active,
            rumahTangga,
            warung,
            withNik,
        };
    }
};
exports.ConsumerService = ConsumerService;
exports.ConsumerService = ConsumerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsumerService);
//# sourceMappingURL=consumer.service.js.map