import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: {
        type?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) {
        const { type, startDate, endDate, limit = 50 } = query;

        const where: any = {};
        if (type) where.type = type;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp.gte = new Date(startDate);
            if (endDate) where.timestamp.lte = new Date(endDate);
        }

        return this.prisma.activityLog.findMany({
            where,
            take: limit,
            orderBy: { timestamp: 'desc' },
        });
    }

    async create(data: {
        orderId?: string;
        type: string;
        title: string;
        pangkalanName?: string;
        detailNumeric?: number;
        iconName?: string;
        orderStatus?: any;
    }) {
        return this.prisma.activityLog.create({ data });
    }
}
