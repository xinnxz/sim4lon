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
exports.LpgProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
let LpgProductsService = class LpgProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(includeInactive = false) {
        const products = await this.prisma.lpg_products.findMany({
            where: includeInactive ? {} : {
                is_active: true,
                deleted_at: null
            },
            include: {
                prices: {
                    orderBy: { is_default: 'desc' }
                }
            },
            orderBy: [
                { size_kg: 'asc' },
                { name: 'asc' }
            ]
        });
        return products;
    }
    async findOne(id) {
        const product = await this.prisma.lpg_products.findUnique({
            where: { id },
            include: {
                prices: {
                    orderBy: { is_default: 'desc' }
                }
            }
        });
        if (!product || product.deleted_at) {
            throw new common_1.NotFoundException('Produk LPG tidak ditemukan');
        }
        return product;
    }
    async create(dto) {
        const product = await this.prisma.lpg_products.create({
            data: {
                name: dto.name,
                size_kg: dto.size_kg,
                category: dto.category,
                color: dto.color,
                description: dto.description,
                prices: dto.prices && dto.prices.length > 0 ? {
                    create: dto.prices.map((p, idx) => ({
                        label: p.label,
                        price: p.price,
                        is_default: p.is_default ?? idx === 0
                    }))
                } : undefined
            },
            include: {
                prices: true
            }
        });
        return product;
    }
    async update(id, dto) {
        await this.findOne(id);
        const product = await this.prisma.lpg_products.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date()
            },
            include: {
                prices: true
            }
        });
        return product;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.lpg_products.update({
            where: { id },
            data: {
                is_active: false,
                deleted_at: new Date(),
                updated_at: new Date()
            }
        });
        return { message: 'Produk berhasil dihapus' };
    }
    async addPrice(productId, dto) {
        await this.findOne(productId);
        if (dto.is_default) {
            await this.prisma.lpg_prices.updateMany({
                where: { lpg_product_id: productId },
                data: { is_default: false }
            });
        }
        const price = await this.prisma.lpg_prices.create({
            data: {
                lpg_product_id: productId,
                label: dto.label,
                price: dto.price,
                is_default: dto.is_default ?? false
            }
        });
        return price;
    }
    async updatePrice(priceId, dto) {
        const existingPrice = await this.prisma.lpg_prices.findUnique({
            where: { id: priceId }
        });
        if (!existingPrice) {
            throw new common_1.NotFoundException('Harga tidak ditemukan');
        }
        if (dto.is_default) {
            await this.prisma.lpg_prices.updateMany({
                where: {
                    lpg_product_id: existingPrice.lpg_product_id,
                    id: { not: priceId }
                },
                data: { is_default: false }
            });
        }
        const price = await this.prisma.lpg_prices.update({
            where: { id: priceId },
            data: {
                label: dto.label,
                price: dto.price,
                is_default: dto.is_default ?? existingPrice.is_default,
                updated_at: new Date()
            }
        });
        return price;
    }
    async removePrice(priceId) {
        const existingPrice = await this.prisma.lpg_prices.findUnique({
            where: { id: priceId }
        });
        if (!existingPrice) {
            throw new common_1.NotFoundException('Harga tidak ditemukan');
        }
        await this.prisma.lpg_prices.delete({
            where: { id: priceId }
        });
        return { message: 'Harga berhasil dihapus' };
    }
    async getStockSummary() {
        const products = await this.findAll();
        const stockData = await this.prisma.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: {
                qty: true
            }
        });
        const summary = products.map(product => {
            const productStock = stockData.filter(s => s.lpg_product_id === product.id);
            const inQty = productStock.find(s => s.movement_type === 'MASUK')?._sum.qty || 0;
            const outQty = productStock.find(s => s.movement_type === 'KELUAR')?._sum.qty || 0;
            return {
                ...product,
                stock: {
                    in: inQty,
                    out: outQty,
                    current: inQty - outQty
                }
            };
        });
        return summary;
    }
};
exports.LpgProductsService = LpgProductsService;
exports.LpgProductsService = LpgProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], LpgProductsService);
//# sourceMappingURL=lpg-products.service.js.map