import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto, UpdateDriverDto } from './dto';

@Injectable()
export class DriverService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 10, isActive?: boolean) {
        const skip = (page - 1) * limit;

        const where: any = { deleted_at: null };
        if (isActive !== undefined) {
            where.is_active = isActive;
        }

        const [drivers, total] = await Promise.all([
            this.prisma.drivers.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    _count: {
                        select: { orders: true },
                    },
                },
            }),
            this.prisma.drivers.count({ where }),
        ]);

        return {
            data: drivers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const driver = await this.prisma.drivers.findFirst({
            where: { id, deleted_at: null },
            include: {
                _count: {
                    select: { orders: true },
                },
            },
        });

        if (!driver) {
            throw new NotFoundException('Driver tidak ditemukan');
        }

        return driver;
    }

    async create(dto: CreateDriverDto) {
        // Generate driver code (DRV-001, DRV-002, etc.)
        const driverCount = await this.prisma.drivers.count();
        const driverCode = `DRV-${String(driverCount + 1).padStart(3, '0')}`;

        const driver = await this.prisma.drivers.create({
            data: {
                code: driverCode,  // Required display code
                name: dto.name,
                phone: dto.phone,
                vehicle_id: dto.vehicle_id,
                note: dto.note,
            },
        });

        return driver;
    }

    async update(id: string, dto: UpdateDriverDto) {
        await this.findOne(id);

        const driver = await this.prisma.drivers.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });

        return driver;
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.drivers.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        return { message: 'Driver berhasil dihapus' };
    }
}
