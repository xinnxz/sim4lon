import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';

@Injectable()
export class PangkalanService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 10, isActive?: boolean, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = { deleted_at: null };
        if (isActive !== undefined) {
            where.is_active = isActive;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { region: { contains: search, mode: 'insensitive' } },
                { pic_name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [pangkalans, total] = await Promise.all([
            this.prisma.pangkalans.findMany({
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
            this.prisma.pangkalans.count({ where }),
        ]);

        return {
            data: pangkalans,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const pangkalan = await this.prisma.pangkalans.findFirst({
            where: { id, deleted_at: null },
            include: {
                _count: {
                    select: { orders: true },
                },
            },
        });

        if (!pangkalan) {
            throw new NotFoundException('Pangkalan tidak ditemukan');
        }

        return pangkalan;
    }

    async create(dto: CreatePangkalanDto) {
        // Generate pangkalan code (PKL-001, PKL-002, etc.)
        const pangkalanCount = await this.prisma.pangkalans.count();
        const pangkalanCode = `PKL-${String(pangkalanCount + 1).padStart(3, '0')}`;

        const pangkalan = await this.prisma.pangkalans.create({
            data: {
                code: pangkalanCode,  // Required display code
                name: dto.name,
                address: dto.address,
                region: dto.region,
                pic_name: dto.pic_name,
                phone: dto.phone,
                email: dto.email,  // Email for invoices
                capacity: dto.capacity,
                note: dto.note,
            },
        });

        return pangkalan;
    }

    async update(id: string, dto: UpdatePangkalanDto) {
        await this.findOne(id);

        const pangkalan = await this.prisma.pangkalans.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });

        return pangkalan;
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.pangkalans.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        return { message: 'Pangkalan berhasil dihapus' };
    }
}
