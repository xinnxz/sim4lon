import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LpgType, StockMovementType } from '@prisma/client';

@Injectable()
export class StockService {
    constructor(private prisma: PrismaService) { }

    async getSummary() {
        // Get all stock movements grouped by lpgType
        const movements = await this.prisma.stockHistory.groupBy({
            by: ['lpgType', 'movementType'],
            _sum: { qty: true },
        });

        // Calculate current stock for each type
        const stockMap = new Map<LpgType, number>();

        for (const lpgType of [LpgType.kg3, LpgType.kg12, LpgType.kg50]) {
            stockMap.set(lpgType, 0);
        }

        for (const m of movements) {
            const current = stockMap.get(m.lpgType) || 0;
            const qty = m._sum.qty || 0;

            if (m.movementType === StockMovementType.MASUK) {
                stockMap.set(m.lpgType, current + qty);
            } else {
                stockMap.set(m.lpgType, current - qty);
            }
        }

        // Get last update for each type
        const lastUpdates = await this.prisma.stockHistory.groupBy({
            by: ['lpgType'],
            _max: { timestamp: true },
        });

        const labels = {
            [LpgType.kg3]: 'LPG 3 Kg',
            [LpgType.kg12]: 'LPG 12 Kg',
            [LpgType.kg50]: 'LPG 50 Kg',
        };

        return Array.from(stockMap.entries()).map(([lpgType, currentStock]) => ({
            lpgType,
            label: labels[lpgType],
            currentStock,
            lastUpdate: lastUpdates.find((u) => u.lpgType === lpgType)?._max.timestamp || null,
        }));
    }

    async recordMovement(data: {
        pangkalanId: string;
        lpgType: LpgType;
        movementType: StockMovementType;
        qty: number;
        note?: string;
    }) {
        const movement = await this.prisma.stockHistory.create({
            data: {
                pangkalanId: data.pangkalanId,
                lpgType: data.lpgType,
                movementType: data.movementType,
                qty: data.qty,
                note: data.note,
            },
        });

        // Get new stock count
        const summary = await this.getSummary();
        const newStock = summary.find((s) => s.lpgType === data.lpgType)?.currentStock || 0;

        return {
            ...movement,
            newStock,
        };
    }

    async getHistory(query: {
        lpgType?: LpgType;
        movementType?: StockMovementType;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) {
        const { lpgType, movementType, startDate, endDate, limit = 50 } = query;

        const where: any = {};
        if (lpgType) where.lpgType = lpgType;
        if (movementType) where.movementType = movementType;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp.gte = new Date(startDate);
            if (endDate) where.timestamp.lte = new Date(endDate);
        }

        return this.prisma.stockHistory.findMany({
            where,
            take: limit,
            orderBy: { timestamp: 'desc' },
        });
    }
}
