import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReceiveStockDto, AdjustStockDto, UpdateStockLevelsDto, LpgType, LPG_TYPES, toFrontendFormat } from './dto';

/**
 * PangkalanStockService - Business logic untuk manajemen stok pangkalan
 * 
 * Features:
 * - Get current stock levels per LPG type
 * - Receive stock from agen (MASUK)
 * - Deduct stock on sale (KELUAR) - called by ConsumerOrderService
 * - Stock opname adjustment
 * - Stock movement history
 */
@Injectable()
export class PangkalanStockService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get or create stock record for a pangkalan
     */
    private async getOrCreateStock(pangkalanId: string, lpgType: LpgType) {
        let stock = await this.prisma.pangkalan_stocks.findFirst({
            where: { pangkalan_id: pangkalanId, lpg_type: lpgType },
        });

        if (!stock) {
            stock = await this.prisma.pangkalan_stocks.create({
                data: {
                    pangkalan_id: pangkalanId,
                    lpg_type: lpgType,
                    qty: 0,
                },
            });
        }

        return stock;
    }

    /**
     * Get all stock levels for a pangkalan
     */
    async getStockLevels(pangkalanId: string) {
        // Ensure all LPG types have a record
        const stocks = await Promise.all(
            LPG_TYPES.map(async (lpgType) => {
                const stock = await this.getOrCreateStock(pangkalanId, lpgType);
                const status =
                    stock.qty <= stock.critical_level ? 'KRITIS' :
                        stock.qty <= stock.warning_level ? 'RENDAH' : 'AMAN';

                return {
                    id: stock.id,
                    lpg_type: toFrontendFormat(stock.lpg_type), // Return in frontend format (3kg)
                    qty: stock.qty,
                    warning_level: stock.warning_level,
                    critical_level: stock.critical_level,
                    status,
                    updated_at: stock.updated_at,
                };
            })
        );

        const totalStock = stocks.reduce((sum, s) => sum + s.qty, 0);
        const hasWarning = stocks.some(s => s.status === 'RENDAH');
        const hasCritical = stocks.some(s => s.status === 'KRITIS');

        return {
            stocks,
            summary: {
                total: totalStock,
                hasWarning,
                hasCritical,
            },
        };
    }

    /**
     * Receive stock from agen (MASUK)
     */
    async receiveStock(pangkalanId: string, dto: ReceiveStockDto) {
        const stock = await this.getOrCreateStock(pangkalanId, dto.lpg_type);

        // Update stock qty
        const updatedStock = await this.prisma.pangkalan_stocks.update({
            where: { id: stock.id },
            data: {
                qty: stock.qty + dto.qty,
                updated_at: new Date(),
            },
        });

        // Record movement
        await this.prisma.pangkalan_stock_movements.create({
            data: {
                pangkalan_id: pangkalanId,
                lpg_type: dto.lpg_type,
                movement_type: 'MASUK',
                qty: dto.qty,
                source: 'AGEN',
                note: dto.note,
                movement_date: dto.movement_date ? new Date(dto.movement_date) : new Date(),
            },
        });

        return {
            message: `Stok ${dto.lpg_type} berhasil ditambahkan`,
            newQty: updatedStock.qty,
        };
    }

    /**
     * Deduct stock on sale (KELUAR) - called internally
     */
    async deductStock(pangkalanId: string, lpgType: LpgType, qty: number, referenceId?: string) {
        const stock = await this.getOrCreateStock(pangkalanId, lpgType);

        if (stock.qty < qty) {
            throw new BadRequestException(`Stok ${lpgType} tidak cukup (${stock.qty} < ${qty})`);
        }

        // Update stock qty
        await this.prisma.pangkalan_stocks.update({
            where: { id: stock.id },
            data: {
                qty: stock.qty - qty,
                updated_at: new Date(),
            },
        });

        // Record movement
        await this.prisma.pangkalan_stock_movements.create({
            data: {
                pangkalan_id: pangkalanId,
                lpg_type: lpgType,
                movement_type: 'KELUAR',
                qty: qty,
                source: 'PENJUALAN',
                reference_id: referenceId,
            },
        });

        return true;
    }

    /**
     * Stock opname - adjust stock to actual count
     */
    async adjustStock(pangkalanId: string, dto: AdjustStockDto) {
        const stock = await this.getOrCreateStock(pangkalanId, dto.lpg_type);
        const difference = dto.actual_qty - stock.qty;

        // Update stock qty
        await this.prisma.pangkalan_stocks.update({
            where: { id: stock.id },
            data: {
                qty: dto.actual_qty,
                updated_at: new Date(),
            },
        });

        // Record movement
        await this.prisma.pangkalan_stock_movements.create({
            data: {
                pangkalan_id: pangkalanId,
                lpg_type: dto.lpg_type,
                movement_type: 'OPNAME',
                qty: Math.abs(difference),
                source: 'OPNAME',
                note: dto.note || `Koreksi: ${stock.qty} → ${dto.actual_qty} (${difference > 0 ? '+' : ''}${difference})`,
            },
        });

        return {
            message: `Stock opname ${dto.lpg_type} berhasil`,
            oldQty: stock.qty,
            newQty: dto.actual_qty,
            difference,
        };
    }

    /**
     * Get stock movement history
     */
    async getMovements(pangkalanId: string, startDate?: string, endDate?: string, limit = 50) {
        const where: any = { pangkalan_id: pangkalanId };

        if (startDate || endDate) {
            where.movement_date = {};
            if (startDate) where.movement_date.gte = new Date(startDate);
            if (endDate) where.movement_date.lte = new Date(endDate);
        }

        const movements = await this.prisma.pangkalan_stock_movements.findMany({
            where,
            orderBy: { movement_date: 'desc' },
            take: limit,
        });

        return movements;
    }

    /**
     * Update stock alert levels
     */
    async updateLevels(pangkalanId: string, dto: UpdateStockLevelsDto) {
        const stock = await this.getOrCreateStock(pangkalanId, dto.lpg_type);

        return this.prisma.pangkalan_stocks.update({
            where: { id: stock.id },
            data: {
                ...(dto.warning_level !== undefined && { warning_level: dto.warning_level }),
                ...(dto.critical_level !== undefined && { critical_level: dto.critical_level }),
                updated_at: new Date(),
            },
        });
    }
}
