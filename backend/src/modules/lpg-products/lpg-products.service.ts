import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateLpgProductDto, UpdateLpgProductDto } from './dto';

@Injectable()
export class LpgProductsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all LPG products
     */
    async findAll(includeInactive = false) {
        return this.prisma.lpg_products.findMany({
            where: {
                deleted_at: null,
                ...(includeInactive ? {} : { is_active: true }),
            },
            orderBy: { size_kg: 'asc' },
        });
    }

    /**
     * Get single product by ID
     */
    async findOne(id: string) {
        const product = await this.prisma.lpg_products.findUnique({
            where: { id },
        });

        if (!product || product.deleted_at) {
            throw new NotFoundException('Produk tidak ditemukan');
        }

        return product;
    }

    /**
     * Get products with stock summary
     */
    async getStockSummary() {
        const products = await this.findAll();

        return Promise.all(
            products.map(async (product) => {
                // Get stock movements for this product
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
            }),
        );
    }

    /**
     * Create new LPG product with simplified pricing
     */
    async create(dto: CreateLpgProductDto) {
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
        });
    }

    /**
     * Update LPG product
     */
    async update(id: string, dto: UpdateLpgProductDto) {
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
        });
    }

    /**
     * Soft delete LPG product
     */
    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.lpg_products.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        return { message: 'Produk berhasil dihapus' };
    }
}
