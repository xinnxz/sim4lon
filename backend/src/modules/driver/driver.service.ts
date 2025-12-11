import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DriverService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.driver.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                name: true,
                phone: true,
                vehicleId: true,
                isActive: true,
                note: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const driver = await this.prisma.driver.findUnique({
            where: { id, deletedAt: null },
        });

        if (!driver) {
            throw new NotFoundException('Driver tidak ditemukan');
        }

        return driver;
    }

    async create(data: { userId: string; name: string; phone?: string; vehicleId?: string; note?: string }) {
        return this.prisma.driver.create({
            data,
            select: {
                id: true,
                name: true,
                phone: true,
                vehicleId: true,
                isActive: true,
            },
        });
    }

    async update(id: string, data: { name?: string; phone?: string; vehicleId?: string; isActive?: boolean; note?: string }) {
        await this.findOne(id);

        return this.prisma.driver.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.driver.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: 'Driver berhasil dihapus' };
    }
}
