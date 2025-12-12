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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
const dto_1 = require("./dto");
let StockService = class StockService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHistory(page = 1, limit = 10, lpgType, movementType) {
        const skip = (page - 1) * limit;
        const where = {};
        if (lpgType)
            where.lpg_type = (0, dto_1.mapLpgTypeToEnum)(lpgType);
        if (movementType)
            where.movement_type = (0, dto_1.mapMovementTypeToEnum)(movementType);
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
    async createMovement(dto, userId) {
        console.log('=== createMovement called ===');
        console.log('DTO:', JSON.stringify(dto));
        console.log('userId:', userId);
        try {
            const movementTypeEnum = (0, dto_1.mapMovementTypeToEnum)(dto.movement_type);
            console.log('Mapped movement_type:', movementTypeEnum);
            const data = {
                movement_type: movementTypeEnum,
                qty: dto.qty,
                note: dto.note,
                recorded_by_user_id: userId,
            };
            if (dto.lpg_product_id) {
                data.lpg_product_id = dto.lpg_product_id;
                console.log('Using lpg_product_id:', dto.lpg_product_id);
            }
            if (dto.lpg_type) {
                const lpgTypeEnum = (0, dto_1.mapLpgTypeToEnum)(dto.lpg_type);
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
        }
        catch (error) {
            console.error('=== createMovement ERROR ===');
            console.error('Error:', error);
            throw error;
        }
    }
    async getSummary() {
        const stockData = await this.prisma.stock_histories.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: {
                lpg_type: { not: null }
            },
            _sum: {
                qty: true,
            },
        });
        const summary = {};
        for (const data of stockData) {
            const type = data.lpg_type;
            if (!type)
                continue;
            if (!summary[type]) {
                summary[type] = { in: 0, out: 0, current: 0 };
            }
            if (data.movement_type === 'MASUK') {
                summary[type].in = data._sum.qty || 0;
            }
            else {
                summary[type].out = data._sum.qty || 0;
            }
        }
        for (const type of Object.keys(summary)) {
            summary[type].current = summary[type].in - summary[type].out;
        }
        return summary;
    }
    async getHistoryByType(lpgType, limit = 20) {
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
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], StockService);
//# sourceMappingURL=stock.service.js.map