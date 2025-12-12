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
        const where = {};
        if (type)
            where.type = type;
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
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map