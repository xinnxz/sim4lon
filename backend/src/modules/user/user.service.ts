import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prisma.users.findMany({
                where: { deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    is_active: true,
                    avatar_url: true,
                    created_at: true,
                    updated_at: true,
                },
            }),
            this.prisma.users.count({ where: { deleted_at: null } }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.users.findFirst({
            where: { id, deleted_at: null },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                is_active: true,
                avatar_url: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User tidak ditemukan');
        }

        return user;
    }

    async create(dto: CreateUserDto) {
        const existingUser = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.users.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                phone: dto.phone,
                role: dto.role || 'OPERATOR',
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                is_active: true,
                created_at: true,
            },
        });

        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        await this.findOne(id);

        const user = await this.prisma.users.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                is_active: true,
                avatar_url: true,
                updated_at: true,
            },
        });

        return user;
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.users.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        return { message: 'User berhasil dihapus' };
    }
}
