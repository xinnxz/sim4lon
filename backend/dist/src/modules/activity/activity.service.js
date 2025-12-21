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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
let ActivityService = class ActivityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, type, userId) {
        const skip = (page - 1) * limit;
        const where = {
            NOT: {
                type: { in: ['order_delivered', 'order_status_updated'] },
            },
        };
        if (type) {
            const prefix = type.split('_')[0].toLowerCase();
            if (prefix === 'system' || prefix === 'user') {
                where.OR = [
                    { type: { startsWith: 'user_', mode: 'insensitive' } },
                    { type: { startsWith: 'system_', mode: 'insensitive' } },
                ];
            }
            else if (prefix === 'order') {
                where.OR = [
                    { type: { equals: 'order_created', mode: 'insensitive' } },
                    { type: { equals: 'order_completed', mode: 'insensitive' } },
                    { type: { equals: 'order_cancelled', mode: 'insensitive' } },
                ];
            }
            else {
                where.type = { startsWith: prefix + '_', mode: 'insensitive' };
            }
        }
        if (userId)
            where.user_id = userId;
        const [logs, total] = await Promise.all([
            this.prisma.activity_logs.findMany({
                where,
                skip,
                take: limit,
                orderBy: { timestamp: 'desc' },
                include: {
                    users: {
                        select: { id: true, name: true },
                    },
                    orders: {
                        select: { id: true, pangkalans: { select: { name: true } } },
                    },
                },
            }),
            this.prisma.activity_logs.count({ where }),
        ]);
        return {
            data: logs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async create(dto) {
        const log = await this.prisma.activity_logs.create({
            data: {
                user_id: dto.user_id,
                order_id: dto.order_id,
                type: dto.type,
                title: dto.title,
                description: dto.description,
                pangkalan_name: dto.pangkalan_name,
                detail_numeric: dto.detail_numeric,
                icon_name: dto.icon_name,
                order_status: dto.order_status,
            },
        });
        return log;
    }
    async getRecent(limit = 10) {
        const logs = await this.prisma.activity_logs.findMany({
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: {
                users: {
                    select: { id: true, name: true },
                },
                orders: {
                    select: { id: true, pangkalans: { select: { name: true } } },
                },
            },
        });
        return logs;
    }
    async getByType(type, limit = 20) {
        const logs = await this.prisma.activity_logs.findMany({
            where: { type },
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: {
                users: {
                    select: { id: true, name: true },
                },
                orders: {
                    select: { id: true, pangkalans: { select: { name: true } } },
                },
            },
        });
        return logs;
    }
    async logActivity(type, title, options) {
        return this.create({
            type,
            title,
            user_id: options?.userId,
            order_id: options?.orderId,
            description: options?.description,
            pangkalan_name: options?.pangkalanName,
            detail_numeric: options?.detailNumeric,
            icon_name: options?.iconName,
            order_status: options?.orderStatus,
        });
    }
    async seedSampleActivities() {
        const user = await this.prisma.users.findFirst();
        if (!user) {
            throw new Error('No users found. Please seed users first.');
        }
        const activities = [
            { type: 'ORDER_NEW', title: 'Pesanan Baru Dibuat', description: 'Pesanan untuk Pangkalan Maju Jaya - 50 tabung LPG 3kg', pangkalan_name: 'Pangkalan Maju Jaya', detail_numeric: 50, icon_name: 'ShoppingCart', offsetMins: 5 },
            { type: 'PAYMENT_RECEIVED', title: 'Pembayaran Diterima', description: 'Pembayaran lunas dari Pangkalan Sejahtera - Rp 2.500.000', pangkalan_name: 'Pangkalan Sejahtera', detail_numeric: 2500000, icon_name: 'Banknote', offsetMins: 30 },
            { type: 'STOCK_IN', title: 'Stok Masuk', description: 'Penerimaan stok LPG 3kg dari supplier', detail_numeric: 200, icon_name: 'PackagePlus', offsetMins: 60 },
            { type: 'ORDER_COMPLETED', title: 'Pesanan Selesai', description: 'Pesanan telah selesai - Pangkalan Bersama', pangkalan_name: 'Pangkalan Bersama', detail_numeric: 100, icon_name: 'CheckCircle2', offsetMins: 120 },
            { type: 'STOCK_OUT', title: 'Stok Keluar', description: 'Pengiriman ke Pangkalan ABC - LPG 12kg', detail_numeric: 30, icon_name: 'PackageMinus', offsetMins: 180 },
            { type: 'ORDER_NEW', title: 'Pesanan Baru Dibuat', description: 'Pesanan untuk Pangkalan Sentosa - 25 tabung LPG 12kg', pangkalan_name: 'Pangkalan Sentosa', detail_numeric: 25, icon_name: 'ShoppingCart', offsetMins: 240 },
            { type: 'PAYMENT_RECEIVED', title: 'Pembayaran Diterima', description: 'DP 50% dari Pangkalan XYZ - Rp 1.000.000', pangkalan_name: 'Pangkalan XYZ', detail_numeric: 1000000, icon_name: 'Banknote', offsetMins: 300 },
            { type: 'STOCK_IN', title: 'Stok Masuk', description: 'Penerimaan stok LPG 12kg dari supplier utama', detail_numeric: 100, icon_name: 'PackagePlus', offsetMins: 1440 },
            { type: 'ORDER_CANCELLED', title: 'Pesanan Dibatalkan', description: 'Pesanan dari Pangkalan Lama dibatalkan atas permintaan pelanggan', pangkalan_name: 'Pangkalan Lama', detail_numeric: 10, icon_name: 'XCircle', offsetMins: 2880 },
            { type: 'ORDER_COMPLETED', title: 'Pesanan Selesai', description: 'Pengiriman sukses ke Pangkalan Prima', pangkalan_name: 'Pangkalan Prima', detail_numeric: 75, icon_name: 'CheckCircle2', offsetMins: 4320 },
        ];
        const created = [];
        for (const act of activities) {
            const log = await this.prisma.activity_logs.create({
                data: {
                    user_id: user.id,
                    type: act.type,
                    title: act.title,
                    description: act.description,
                    pangkalan_name: act.pangkalan_name,
                    detail_numeric: act.detail_numeric,
                    icon_name: act.icon_name,
                    timestamp: new Date(Date.now() - act.offsetMins * 60 * 1000),
                },
            });
            created.push(log);
        }
        return { message: `Created ${created.length} sample activities`, count: created.length };
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map