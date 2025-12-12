import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateStockMovementDto } from './dto';
import { lpg_type, stock_movement_type } from '@prisma/client';

@Injectable()
export class StockService {
    constructor(private prisma: PrismaService) { }

    async getHistory(
        page = 1,
        limit = 10,
        lpgType?: lpg_type,
        movementType?: stock_movement_type,
    ) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (lpgType) where.lpg_type = lpgType;
        if (movementType) where.movement_type = movementType;

        const [histories, total] = await Promise.all([
            this.prisma.stock_histories.findMany({
                where,
                skip,
                take: limit,
                orderBy: { timestamp: 'desc' },
                include: {
                    users: {
                        select: { id: true, name: true },
                    },
                },
            }),
            this.prisma.stock_histories.count({ where }),
        ]);

        return {
            data: histories,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createMovement(dto: CreateStockMovementDto, userId: string) {
        const history = await this.prisma.stock_histories.create({
            data: {
                lpg_type: dto.lpg_type,
                movement_type: dto.movement_type,
                qty: dto.qty,
                note: dto.note,
                recorded_by_user_id: userId,
            },
            include: {
                users: {
                    select: { id: true, name: true },
                },
            },
        });

        return history;
    }

    async getSummary() {
        // Get current stock for each LPG type
        const stockData = await this.prisma.stock_histories.groupBy({
            by: ['lpg_type', 'movement_type'],
            _sum: {
                qty: true,
            },
        });

        // Calculate net stock for each type
        const summary: Record<string, { in: number; out: number; current: number }> = {};

        for (const data of stockData) {
            const type = data.lpg_type;
            if (!summary[type]) {
                summary[type] = { in: 0, out: 0, current: 0 };
            }

            if (data.movement_type === 'MASUK') {
                summary[type].in = data._sum.qty || 0;
            } else {
                summary[type].out = data._sum.qty || 0;
            }
        }

        // Calculate current stock
        for (const type of Object.keys(summary)) {
            summary[type].current = summary[type].in - summary[type].out;
        }

        return summary;
    }

    async getHistoryByType(lpgType: lpg_type, limit = 20) {
        const histories = await this.prisma.stock_histories.findMany({
            where: { lpg_type: lpgType },
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: {
                users: {
                    select: { id: true, name: true },
                },
            },
        });

        return histories;
    }
}
