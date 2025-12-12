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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrderService = class OrderService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, status, pangkalanId, driverId) {
        const skip = (page - 1) * limit;
        const where = { deleted_at: null };
        if (status)
            where.current_status = status;
        if (pangkalanId)
            where.pangkalan_id = pangkalanId;
        if (driverId)
            where.driver_id = driverId;
        const [orders, total] = await Promise.all([
            this.prisma.orders.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    pangkalans: {
                        select: { id: true, name: true, region: true },
                    },
                    drivers: {
                        select: { id: true, name: true },
                    },
                    order_items: true,
                    order_payment_details: true,
                },
            }),
            this.prisma.orders.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const order = await this.prisma.orders.findFirst({
            where: { id, deleted_at: null },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
                order_payment_details: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
                invoices: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order tidak ditemukan');
        }
        return order;
    }
    async create(dto) {
        const totalAmount = dto.items.reduce((sum, item) => sum + item.price_per_unit * item.qty, 0);
        const order = await this.prisma.orders.create({
            data: {
                pangkalan_id: dto.pangkalan_id,
                driver_id: dto.driver_id,
                note: dto.note,
                total_amount: totalAmount,
                current_status: 'DRAFT',
                order_items: {
                    create: dto.items.map((item) => ({
                        lpg_type: item.lpg_type,
                        label: item.label,
                        price_per_unit: item.price_per_unit,
                        qty: item.qty,
                        sub_total: item.price_per_unit * item.qty,
                    })),
                },
                timeline_tracks: {
                    create: {
                        status: 'DRAFT',
                        description: 'Order dibuat',
                    },
                },
            },
            include: {
                pangkalans: true,
                order_items: true,
                timeline_tracks: true,
            },
        });
        return order;
    }
    async update(id, dto) {
        await this.findOne(id);
        const order = await this.prisma.orders.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
            },
        });
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.findOne(id);
        this.validateStatusTransition(order.current_status, dto.status);
        const updated = await this.prisma.orders.update({
            where: { id },
            data: {
                current_status: dto.status,
                updated_at: new Date(),
                timeline_tracks: {
                    create: {
                        status: dto.status,
                        description: dto.description,
                        note: dto.note,
                    },
                },
            },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.orders.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return { message: 'Order berhasil dihapus' };
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            DRAFT: ['MENUNGGU_PEMBAYARAN', 'BATAL'],
            MENUNGGU_PEMBAYARAN: ['DIPROSES', 'BATAL'],
            DIPROSES: ['SIAP_KIRIM', 'BATAL'],
            SIAP_KIRIM: ['DIKIRIM', 'BATAL'],
            DIKIRIM: ['SELESAI', 'BATAL'],
            SELESAI: [],
            BATAL: [],
        };
        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new common_1.BadRequestException(`Tidak dapat mengubah status dari ${currentStatus} ke ${newStatus}`);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map