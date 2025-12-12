import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateLpgProductDto, UpdateLpgProductDto, CreateLpgPriceDto } from './dto';

@Injectable()
export class LpgProductsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all active LPG products with prices
     */
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

    /**
     * Get single product by ID
     */
    async findOne(id: string) {
        const product = await this.prisma.lpg_products.findUnique({
            where: { id },
            include: {
                prices: {
                    orderBy: { is_default: 'desc' }
                }
            }
        });

        if (!product || product.deleted_at) {
            throw new NotFoundException('Produk LPG tidak ditemukan');
        }

        return product;
    }

    /**
     * Create new LPG product with optional prices
     */
    async create(dto: CreateLpgProductDto) {
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
                        is_default: p.is_default ?? idx === 0 // First price is default if not specified
                    }))
                } : undefined
            },
            include: {
                prices: true
            }
        });

        return product;
    }

    /**
     * Update LPG product
     */
    async update(id: string, dto: UpdateLpgProductDto) {
        await this.findOne(id); // Ensure exists

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

    /**
     * Soft delete product
     */
    async remove(id: string) {
        await this.findOne(id); // Ensure exists

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

    // ==================== PRICES ====================

    /**
     * Add price to product
     */
    async addPrice(productId: string, dto: CreateLpgPriceDto) {
        await this.findOne(productId); // Ensure product exists

        // If this is set as default, unset other defaults
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

    /**
     * Update price
     */
    async updatePrice(priceId: string, dto: CreateLpgPriceDto) {
        const existingPrice = await this.prisma.lpg_prices.findUnique({
            where: { id: priceId }
        });

        if (!existingPrice) {
            throw new NotFoundException('Harga tidak ditemukan');
        }

        // If this is set as default, unset other defaults
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

    /**
     * Delete price
     */
    async removePrice(priceId: string) {
        const existingPrice = await this.prisma.lpg_prices.findUnique({
            where: { id: priceId }
        });

        if (!existingPrice) {
            throw new NotFoundException('Harga tidak ditemukan');
        }

        await this.prisma.lpg_prices.delete({
            where: { id: priceId }
        });

        return { message: 'Harga berhasil dihapus' };
    }

    // ==================== STOCK SUMMARY ====================

    /**
     * Get stock summary for dynamic products
     */
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

        // Build summary
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
}
