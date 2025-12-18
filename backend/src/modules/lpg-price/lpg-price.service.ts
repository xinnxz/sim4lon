import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateLpgPriceDto, LpgPriceItemDto } from './dto';
import { lpg_type } from '@prisma/client';

/**
 * LpgPriceService
 * 
 * Service untuk mengelola harga default LPG per pangkalan.
 * 
 * PENJELASAN:
 * - Setiap pangkalan memiliki harga sendiri untuk tiap tipe LPG
 * - cost_price = Harga modal/beli (HPP)
 * - selling_price = Harga jual ke konsumen
 */
@Injectable()
export class LpgPriceService {
    private readonly logger = new Logger(LpgPriceService.name);

    // Default harga jika belum ada setting
    private readonly DEFAULT_PRICES: Record<lpg_type, { cost: number; sell: number }> = {
        kg3: { cost: 16000, sell: 20000 },
        kg5: { cost: 52000, sell: 60000 },
        kg12: { cost: 142000, sell: 180000 },
        kg50: { cost: 590000, sell: 700000 },
    };

    constructor(private prisma: PrismaService) { }

    /**
     * Get all LPG prices for a pangkalan
     * If prices don't exist, create default ones
     */
    async findAll(pangkalanId: string) {
        this.logger.log(`[FIND_ALL] pangkalanId: ${pangkalanId}`);

        // Get existing prices
        let prices = await this.prisma.lpg_prices.findMany({
            where: { pangkalan_id: pangkalanId },
            orderBy: { lpg_type: 'asc' },
        });

        // If no prices exist, create defaults
        if (prices.length === 0) {
            this.logger.log('[FIND_ALL] No prices found, creating defaults');
            await this.createDefaultPrices(pangkalanId);
            prices = await this.prisma.lpg_prices.findMany({
                where: { pangkalan_id: pangkalanId },
                orderBy: { lpg_type: 'asc' },
            });
        }

        return prices;
    }

    /**
     * Create default prices for all LPG types
     */
    async createDefaultPrices(pangkalanId: string) {
        const lpgTypes: lpg_type[] = ['kg3', 'kg5', 'kg12', 'kg50'];

        for (const type of lpgTypes) {
            const defaultPrice = this.DEFAULT_PRICES[type];

            await this.prisma.lpg_prices.upsert({
                where: {
                    pangkalan_id_lpg_type: {
                        pangkalan_id: pangkalanId,
                        lpg_type: type,
                    },
                },
                update: {},
                create: {
                    pangkalan_id: pangkalanId,
                    lpg_type: type,
                    cost_price: defaultPrice.cost,
                    selling_price: defaultPrice.sell,
                    is_active: type === 'kg3', // Only 3kg active by default
                },
            });
        }

        this.logger.log('[CREATE_DEFAULTS] Default prices created');
    }

    /**
     * Update a single price entry
     */
    async update(id: string, pangkalanId: string, dto: UpdateLpgPriceDto) {
        this.logger.log(`[UPDATE] id: ${id}, dto: ${JSON.stringify(dto)}`);

        const price = await this.prisma.lpg_prices.findFirst({
            where: { id, pangkalan_id: pangkalanId },
        });

        if (!price) {
            throw new NotFoundException('Harga tidak ditemukan');
        }

        return this.prisma.lpg_prices.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });
    }

    /**
     * Bulk update all prices
     */
    async bulkUpdate(pangkalanId: string, items: LpgPriceItemDto[]) {
        this.logger.log(`[BULK_UPDATE] Updating ${items.length} prices`);

        const results: any[] = [];

        for (const item of items) {
            const result = await this.prisma.lpg_prices.upsert({
                where: {
                    pangkalan_id_lpg_type: {
                        pangkalan_id: pangkalanId,
                        lpg_type: item.lpg_type,
                    },
                },
                update: {
                    cost_price: item.cost_price,
                    selling_price: item.selling_price,
                    is_active: item.is_active ?? true,
                    updated_at: new Date(),
                },
                create: {
                    pangkalan_id: pangkalanId,
                    lpg_type: item.lpg_type,
                    cost_price: item.cost_price,
                    selling_price: item.selling_price,
                    is_active: item.is_active ?? true,
                },
            });
            results.push(result);
        }

        this.logger.log('[BULK_UPDATE] Success');
        return results;
    }

    /**
     * Get selling price for a specific LPG type
     * Used by consumer-order service
     */
    async getSellingPrice(pangkalanId: string, lpgType: lpg_type): Promise<number> {
        const price = await this.prisma.lpg_prices.findFirst({
            where: { pangkalan_id: pangkalanId, lpg_type: lpgType },
        });

        if (!price) {
            // Return default if not found
            return this.DEFAULT_PRICES[lpgType]?.sell || 20000;
        }

        return Number(price.selling_price);
    }
}
