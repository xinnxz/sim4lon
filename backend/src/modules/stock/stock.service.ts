import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateStockMovementDto, mapLpgTypeToEnum, mapMovementTypeToEnum } from './dto';
import { lpg_type, stock_movement_type } from '@prisma/client';

@Injectable()
export class StockService {
    constructor(private prisma: PrismaService) { }

    async getHistory(
        page = 1,
        limit = 10,
        lpgType?: string,
        movementType?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (lpgType) where.lpg_type = mapLpgTypeToEnum(lpgType) as lpg_type;
        if (movementType) where.movement_type = mapMovementTypeToEnum(movementType) as stock_movement_type;

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
        console.log('=== createMovement called ===');
        console.log('DTO:', JSON.stringify(dto));
        console.log('userId:', userId);

        try {
            const movementTypeEnum = mapMovementTypeToEnum(dto.movement_type) as stock_movement_type;
            console.log('Mapped movement_type:', movementTypeEnum);

            // Build data object - support both legacy lpg_type and new lpg_product_id
            const data: any = {
                movement_type: movementTypeEnum,
                qty: dto.qty,
                note: dto.note,
                recorded_by_user_id: userId,
            };

            // If lpg_product_id is provided, use it (for dynamic products)
            if (dto.lpg_product_id) {
                data.lpg_product_id = dto.lpg_product_id;
                console.log('Using lpg_product_id:', dto.lpg_product_id);
            }

            // If lpg_type is provided, also set it (for legacy compatibility)
            if (dto.lpg_type) {
                const lpgTypeEnum = mapLpgTypeToEnum(dto.lpg_type) as lpg_type;
                data.lpg_type = lpgTypeEnum;
                console.log('Also setting lpg_type:', lpgTypeEnum);
            }

            const history = await this.prisma.stock_histories.create({
                data,
                include: {
                    users: {
                        select: { id: true, name: true },
                    },
                },
            });

            console.log('Created successfully:', history.id);
            return history;
        } catch (error) {
            console.error('=== createMovement ERROR ===');
            console.error('Error:', error);
            throw error;
        }
    }

    async getSummary() {
        // Get current stock for each LPG type
        const stockData = await this.prisma.stock_histories.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: {
                lpg_type: { not: null } // Only include entries with lpg_type
            },
            _sum: {
                qty: true,
            },
        });

        // Calculate net stock for each type
        const summary: Record<string, { in: number; out: number; current: number }> = {};

        for (const data of stockData) {
            const type = data.lpg_type;
            if (!type) continue; // Skip null types

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
