import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PangkalanService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: { search?: string; isActive?: boolean }) {
        const { search, isActive } = query;
        const where: any = { deletedAt: null };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        return this.prisma.pangkalan.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const pangkalan = await this.prisma.pangkalan.findUnique({
            where: { id, deletedAt: null },
        });

        if (!pangkalan) {
            throw new NotFoundException('Pangkalan tidak ditemukan');
        }

        return pangkalan;
    }

    async getSummary(id: string) {
        const pangkalan = await this.findOne(id);

        const orderStats = await this.prisma.order.aggregate({
            where: { pangkalanId: id, deletedAt: null },
            _count: true,
            _sum: { totalAmount: true },
        });

        const lastOrder = await this.prisma.order.findFirst({
            where: { pangkalanId: id, deletedAt: null },
            orderBy: { orderDate: 'desc' },
            select: { orderDate: true },
        });

        return {
            pangkalanId: pangkalan.id,
            name: pangkalan.name,
            totalOrders: orderStats._count,
            totalRevenue: orderStats._sum.totalAmount || 0,
            lastOrderDate: lastOrder?.orderDate || null,
        };
    }

    async create(data: {
        name: string;
        address: string;
        region?: string;
        picName?: string;
        phone?: string;
        capacity?: number;
        note?: string;
    }) {
        return this.prisma.pangkalan.create({ data });
    }

    async update(id: string, data: any) {
        await this.findOne(id);
        return this.prisma.pangkalan.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.pangkalan.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { message: 'Pangkalan berhasil dihapus' };
    }
}
