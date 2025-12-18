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
var LpgPriceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LpgPriceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LpgPriceService = LpgPriceService_1 = class LpgPriceService {
    prisma;
    logger = new common_1.Logger(LpgPriceService_1.name);
    DEFAULT_PRICES = {
        kg3: { cost: 16000, sell: 20000 },
        kg5: { cost: 52000, sell: 60000 },
        kg12: { cost: 142000, sell: 180000 },
        kg50: { cost: 590000, sell: 700000 },
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(pangkalanId) {
        this.logger.log(`[FIND_ALL] pangkalanId: ${pangkalanId}`);
        let prices = await this.prisma.lpg_prices.findMany({
            where: { pangkalan_id: pangkalanId },
            orderBy: { lpg_type: 'asc' },
        });
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
    async createDefaultPrices(pangkalanId) {
        const lpgTypes = ['kg3', 'kg5', 'kg12', 'kg50'];
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
                    is_active: type === 'kg3',
                },
            });
        }
        this.logger.log('[CREATE_DEFAULTS] Default prices created');
    }
    async update(id, pangkalanId, dto) {
        this.logger.log(`[UPDATE] id: ${id}, dto: ${JSON.stringify(dto)}`);
        const price = await this.prisma.lpg_prices.findFirst({
            where: { id, pangkalan_id: pangkalanId },
        });
        if (!price) {
            throw new common_1.NotFoundException('Harga tidak ditemukan');
        }
        return this.prisma.lpg_prices.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });
    }
    async bulkUpdate(pangkalanId, items) {
        this.logger.log(`[BULK_UPDATE] Updating ${items.length} prices`);
        const results = [];
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
    async getSellingPrice(pangkalanId, lpgType) {
        const price = await this.prisma.lpg_prices.findFirst({
            where: { pangkalan_id: pangkalanId, lpg_type: lpgType },
        });
        if (!price) {
            return this.DEFAULT_PRICES[lpgType]?.sell || 20000;
        }
        return Number(price.selling_price);
    }
};
exports.LpgPriceService = LpgPriceService;
exports.LpgPriceService = LpgPriceService = LpgPriceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LpgPriceService);
//# sourceMappingURL=lpg-price.service.js.map