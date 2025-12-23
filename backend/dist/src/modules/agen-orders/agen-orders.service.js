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
exports.AgenOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_service_1 = require("../activity/activity.service");
let AgenOrdersService = class AgenOrdersService {
    prisma;
    activityService;
    constructor(prisma, activityService) {
        this.prisma = prisma;
        this.activityService = activityService;
    }
    async generateCode() {
        const lastOrder = await this.prisma.agen_orders.findFirst({
            orderBy: { created_at: 'desc' },
            select: { code: true },
        });
        if (!lastOrder) {
            return 'AO-001';
        }
        const lastNum = parseInt(lastOrder.code.replace('AO-', ''), 10);
        return `AO-${String(lastNum + 1).padStart(3, '0')}`;
    }
    async create(pangkalanId, dto) {
        const pangkalan = await this.prisma.pangkalans.findUnique({
            where: { id: pangkalanId },
            select: { agen_id: true, name: true, code: true },
        });
        const code = await this.generateCode();
        const order = await this.prisma.agen_orders.create({
            data: {
                code,
                pangkalan_id: pangkalanId,
                agen_id: pangkalan?.agen_id || null,
                lpg_type: dto.lpg_type,
                qty_ordered: dto.qty,
                note: dto.note,
                status: 'PENDING',
            },
            include: {
                agen: { select: { name: true, phone: true } },
            },
        });
        await this.activityService.logActivity('agen_order_created', `Pesanan Baru dari ${pangkalan?.name || 'Pangkalan'}`, {
            pangkalanName: pangkalan?.name,
            detailNumeric: dto.qty,
            description: `${pangkalan?.code || 'PKL'} memesan ${dto.qty} tabung LPG ${dto.lpg_type}`,
            iconName: 'ShoppingCart',
        });
        return order;
    }
    async findAll(pangkalanId, status) {
        const where = { pangkalan_id: pangkalanId };
        if (status && status !== 'all') {
            where.status = status;
        }
        return this.prisma.agen_orders.findMany({
            where,
            orderBy: { order_date: 'desc' },
            include: {
                agen: { select: { name: true, phone: true } },
            },
        });
    }
    async findOne(id, pangkalanId) {
        const order = await this.prisma.agen_orders.findFirst({
            where: { id, pangkalan_id: pangkalanId },
            include: {
                agen: { select: { name: true, phone: true } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order tidak ditemukan');
        }
        return order;
    }
    async receive(id, pangkalanId, dto) {
        const order = await this.findOne(id, pangkalanId);
        if (order.status === 'DITERIMA') {
            throw new common_1.BadRequestException('Order sudah diterima sebelumnya');
        }
        if (order.status === 'BATAL') {
            throw new common_1.BadRequestException('Order sudah dibatalkan');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.agen_orders.update({
                where: { id },
                data: {
                    status: 'DITERIMA',
                    qty_received: dto.qty_received,
                    received_date: new Date(),
                    note: dto.note || order.note,
                },
            });
            await tx.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pangkalanId,
                    lpg_type: order.lpg_type,
                    movement_type: 'IN',
                    qty: dto.qty_received,
                    source: 'AGEN_DELIVERY',
                    reference_id: id,
                    note: `Terima dari agen: ${dto.qty_received} tabung (Order: ${order.code})`,
                },
            });
            const existingStock = await tx.pangkalan_stocks.findFirst({
                where: {
                    pangkalan_id: pangkalanId,
                    lpg_type: order.lpg_type,
                },
            });
            if (existingStock) {
                await tx.pangkalan_stocks.update({
                    where: { id: existingStock.id },
                    data: {
                        qty: { increment: dto.qty_received },
                        updated_at: new Date(),
                    },
                });
            }
            else {
                await tx.pangkalan_stocks.create({
                    data: {
                        pangkalan_id: pangkalanId,
                        lpg_type: order.lpg_type,
                        qty: dto.qty_received,
                    },
                });
            }
            return updatedOrder;
        });
    }
    async cancel(id, pangkalanId) {
        const order = await this.findOne(id, pangkalanId);
        if (order.status === 'DITERIMA') {
            throw new common_1.BadRequestException('Order yang sudah diterima tidak bisa dibatalkan');
        }
        if (order.status === 'BATAL') {
            throw new common_1.BadRequestException('Order sudah dibatalkan');
        }
        return this.prisma.agen_orders.update({
            where: { id },
            data: { status: 'BATAL' },
        });
    }
    async getStats(pangkalanId) {
        const [pending, dikirim, diterima, batal] = await Promise.all([
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'PENDING' } }),
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'DIKIRIM' } }),
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'DITERIMA' } }),
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'BATAL' } }),
        ]);
        return { pending, dikirim, diterima, batal, total: pending + dikirim + diterima + batal };
    }
    async findAllForAgen(status) {
        const where = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        return this.prisma.agen_orders.findMany({
            where,
            orderBy: { order_date: 'desc' },
            include: {
                pangkalans: { select: { code: true, name: true, phone: true } },
                agen: { select: { name: true } },
            },
        });
    }
    async getStatsForAgen() {
        const [pending, dikirim, diterima, batal] = await Promise.all([
            this.prisma.agen_orders.count({ where: { status: 'PENDING' } }),
            this.prisma.agen_orders.count({ where: { status: 'DIKIRIM' } }),
            this.prisma.agen_orders.count({ where: { status: 'DITERIMA' } }),
            this.prisma.agen_orders.count({ where: { status: 'BATAL' } }),
        ]);
        return { pending, dikirim, diterima, batal, total: pending + dikirim + diterima + batal };
    }
    async confirmOrder(id) {
        const order = await this.prisma.agen_orders.findUnique({
            where: { id },
            include: { pangkalans: { select: { name: true } } },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order tidak ditemukan');
        }
        if (order.status !== 'PENDING') {
            throw new common_1.BadRequestException('Hanya order PENDING yang bisa dikonfirmasi');
        }
        const updated = await this.prisma.agen_orders.update({
            where: { id },
            data: {
                status: 'DITERIMA',
                received_date: new Date(),
            },
        });
        await this.activityService.logActivity('agen_order_confirmed', `Pesanan ${order.code} dikonfirmasi`, {
            pangkalanName: order.pangkalans?.name,
            detailNumeric: order.qty_ordered,
            description: `Pesanan ${order.qty_ordered} tabung dari ${order.pangkalans?.name} dikonfirmasi oleh agen`,
            iconName: 'CheckCircle',
        });
        return updated;
    }
    async completeOrder(id, dto) {
        const order = await this.prisma.agen_orders.findUnique({
            where: { id },
            include: { pangkalans: { select: { name: true } } },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order tidak ditemukan');
        }
        if (order.status !== 'DIKIRIM' && order.status !== 'PENDING') {
            throw new common_1.BadRequestException('Order tidak bisa diselesaikan');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.agen_orders.update({
                where: { id },
                data: {
                    status: 'DITERIMA',
                    qty_received: dto.qty_received,
                    received_date: new Date(),
                },
            });
            const existingStock = await tx.pangkalan_stocks.findFirst({
                where: { pangkalan_id: order.pangkalan_id, lpg_type: order.lpg_type },
            });
            if (existingStock) {
                await tx.pangkalan_stocks.update({
                    where: { id: existingStock.id },
                    data: { qty: { increment: dto.qty_received } },
                });
            }
            else {
                await tx.pangkalan_stocks.create({
                    data: {
                        pangkalan_id: order.pangkalan_id,
                        lpg_type: order.lpg_type,
                        qty: dto.qty_received,
                    },
                });
            }
            await tx.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: order.pangkalan_id,
                    lpg_type: order.lpg_type,
                    movement_type: 'MASUK',
                    qty: dto.qty_received,
                    source: 'AGEN',
                    reference_id: id,
                    note: `Terima dari agen - ${order.code}`,
                },
            });
            return updated;
        });
    }
    async cancelFromAgen(id) {
        const order = await this.prisma.agen_orders.findUnique({
            where: { id },
            include: { pangkalans: { select: { name: true } } },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order tidak ditemukan');
        }
        if (order.status === 'DITERIMA') {
            throw new common_1.BadRequestException('Order yang sudah diterima tidak bisa dibatalkan');
        }
        const updated = await this.prisma.agen_orders.update({
            where: { id },
            data: { status: 'BATAL' },
        });
        await this.activityService.logActivity('agen_order_cancelled', `Pesanan ${order.code} ditolak`, {
            pangkalanName: order.pangkalans?.name,
            description: `Pesanan dari ${order.pangkalans?.name} ditolak oleh agen`,
            iconName: 'XCircle',
        });
        return updated;
    }
};
exports.AgenOrdersService = AgenOrdersService;
exports.AgenOrdersService = AgenOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_service_1.ActivityService])
], AgenOrdersService);
//# sourceMappingURL=agen-orders.service.js.map