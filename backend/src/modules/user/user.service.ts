import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: { page?: number; limit?: number; role?: string; search?: string }) {
        const { page = 1, limit = 10, role, search } = query;
        const skip = (page - 1) * limit;

        const where: any = { deletedAt: null };

        if (role) {
            where.role = role;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    phone: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: { page, limit, total },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User tidak ditemukan');
        }

        return user;
    }

    async create(data: { email: string; password: string; name: string; role: any; phone?: string }) {
        // Check if email exists
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new ConflictException('Email sudah terdaftar');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                isActive: true,
            },
        });

        return user;
    }

    async update(id: string, data: { name?: string; phone?: string; isActive?: boolean }) {
        await this.findOne(id); // Check existence

        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                isActive: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check existence

        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: 'User berhasil dihapus' };
    }
}
