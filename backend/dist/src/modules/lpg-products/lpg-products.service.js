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
        return this.prisma.lpg_products.findMany({
            where: {
                deleted_at: null,
                ...(includeInactive ? {} : { is_active: true }),
            },
            include: {
                prices: true,
            },
            orderBy: { size_kg: 'asc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.lpg_products.findUnique({
            where: { id },
            include: {
                prices: true,
            },
        });
        if (!product || product.deleted_at) {
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        }
        return product;
    }
    async getStockSummary() {
        const products = await this.findAll();
        return Promise.all(products.map(async (product) => {
            const stockIn = await this.prisma.stock_histories.aggregate({
                where: {
                    lpg_product_id: product.id,
                    movement_type: 'MASUK',
                },
                _sum: { qty: true },
            });
            const stockOut = await this.prisma.stock_histories.aggregate({
                where: {
                    lpg_product_id: product.id,
                    movement_type: 'KELUAR',
                },
                _sum: { qty: true },
            });
            const inQty = stockIn._sum.qty || 0;
            const outQty = stockOut._sum.qty || 0;
            return {
                ...product,
                stock: {
                    in: inQty,
                    out: outQty,
                    current: inQty - outQty,
                },
            };
        }));
    }
    async create(dto) {
        return this.prisma.lpg_products.create({
            data: {
                name: dto.name,
                size_kg: dto.size_kg,
                category: dto.category,
                color: dto.color,
                description: dto.description,
                selling_price: dto.selling_price,
                cost_price: dto.cost_price,
            },
            include: {
                prices: true,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.lpg_products.update({
            where: { id },
            data: {
                name: dto.name,
                size_kg: dto.size_kg,
                category: dto.category,
                color: dto.color,
                description: dto.description,
                selling_price: dto.selling_price,
                cost_price: dto.cost_price,
                is_active: dto.is_active,
                updated_at: new Date(),
            },
            include: {
                prices: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.lpg_products.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return { message: 'Produk berhasil dihapus' };
    }
    async addPrice(productId, dto) {
        await this.findOne(productId);
        return this.prisma.lpg_prices.create({
            data: {
                lpg_product_id: productId,
                label: dto.label,
                price: dto.price,
                is_default: dto.is_default || false,
            },
        });
    }
    async updatePrice(priceId, dto) {
        const price = await this.prisma.lpg_prices.findUnique({
            where: { id: priceId },
        });
        if (!price) {
            throw new common_1.NotFoundException('Harga tidak ditemukan');
        }
        return this.prisma.lpg_prices.update({
            where: { id: priceId },
            data: {
                label: dto.label,
                price: dto.price,
                is_default: dto.is_default,
                updated_at: new Date(),
            },
        });
    }
    async removePrice(priceId) {
        const price = await this.prisma.lpg_prices.findUnique({
            where: { id: priceId },
        });
        if (!price) {
            throw new common_1.NotFoundException('Harga tidak ditemukan');
        }
        await this.prisma.lpg_prices.delete({
            where: { id: priceId },
        });
        return { message: 'Harga berhasil dihapus' };
    }
};
exports.LpgProductsService = LpgProductsService;
exports.LpgProductsService = LpgProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], LpgProductsService);
//# sourceMappingURL=lpg-products.service.js.map