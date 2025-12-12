import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateActivityLogDto } from './dto';

@Injectable()
export class ActivityService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, type?: string, userId?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (type) where.type = type;
        if (userId) where.user_id = userId;

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

    async create(dto: CreateActivityLogDto) {
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

    async getByType(type: string, limit = 20) {
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

    // Helper method to log activity from other services
    async logActivity(
        type: string,
        title: string,
        options?: {
            userId?: string;
            orderId?: string;
            description?: string;
            pangkalanName?: string;
            detailNumeric?: number;
            iconName?: string;
            orderStatus?: any;
        },
    ) {
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
}
