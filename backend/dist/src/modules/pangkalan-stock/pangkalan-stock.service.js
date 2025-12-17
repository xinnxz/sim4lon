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
exports.PangkalanStockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const dto_1 = require("./dto");
let PangkalanStockService = class PangkalanStockService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateStock(pangkalanId, lpgType) {
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
    async getStockLevels(pangkalanId) {
        const stocks = await Promise.all(dto_1.LPG_TYPES.map(async (lpgType) => {
            const stock = await this.getOrCreateStock(pangkalanId, lpgType);
            const status = stock.qty <= stock.critical_level ? 'KRITIS' :
                stock.qty <= stock.warning_level ? 'RENDAH' : 'AMAN';
            return {
                id: stock.id,
                lpg_type: stock.lpg_type,
                qty: stock.qty,
                warning_level: stock.warning_level,
                critical_level: stock.critical_level,
                status,
                updated_at: stock.updated_at,
            };
        }));
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
    async receiveStock(pangkalanId, dto) {
        const stock = await this.getOrCreateStock(pangkalanId, dto.lpg_type);
        const updatedStock = await this.prisma.pangkalan_stocks.update({
            where: { id: stock.id },
            data: {
                qty: stock.qty + dto.qty,
                updated_at: new Date(),
            },
        });
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
    async deductStock(pangkalanId, lpgType, qty, referenceId) {
        const stock = await this.getOrCreateStock(pangkalanId, lpgType);
        if (stock.qty < qty) {
            throw new common_1.BadRequestException(`Stok ${lpgType} tidak cukup (${stock.qty} < ${qty})`);
        }
        await this.prisma.pangkalan_stocks.update({
            where: { id: stock.id },
            data: {
                qty: stock.qty - qty,
                updated_at: new Date(),
            },
        });
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
    async adjustStock(pangkalanId, dto) {
        const stock = await this.getOrCreateStock(pangkalanId, dto.lpg_type);
        const difference = dto.actual_qty - stock.qty;
        await this.prisma.pangkalan_stocks.update({
            where: { id: stock.id },
            data: {
                qty: dto.actual_qty,
                updated_at: new Date(),
            },
        });
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
    async getMovements(pangkalanId, startDate, endDate, limit = 50) {
        const where = { pangkalan_id: pangkalanId };
        if (startDate || endDate) {
            where.movement_date = {};
            if (startDate)
                where.movement_date.gte = new Date(startDate);
            if (endDate)
                where.movement_date.lte = new Date(endDate);
        }
        const movements = await this.prisma.pangkalan_stock_movements.findMany({
            where,
            orderBy: { movement_date: 'desc' },
            take: limit,
        });
        return movements;
    }
    async updateLevels(pangkalanId, dto) {
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
};
exports.PangkalanStockService = PangkalanStockService;
exports.PangkalanStockService = PangkalanStockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PangkalanStockService);
//# sourceMappingURL=pangkalan-stock.service.js.map