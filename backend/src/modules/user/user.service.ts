import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 10, search?: string) {
        const skip = (page - 1) * limit;

        // Build where clause with optional search
        const where: any = { deleted_at: null };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            this.prisma.users.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    code: true,  // Display code (USR-001)
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
            this.prisma.users.count({ where }),
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
                code: true,  // Display code (USR-001)
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

        // Generate user code (USR-001, USR-002, etc.)
        const userCount = await this.prisma.users.count();
        const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;

        const user = await this.prisma.users.create({
            data: {
                code: userCode,  // Required display code
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                phone: dto.phone,
                role: dto.role || 'OPERATOR',
            },
            select: {
                id: true,
                code: true,
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

    /**
     * Reset password user - generate random password dan update ke database
     * @returns new plain text password untuk diberikan ke user
     */
    async resetPassword(id: string) {
        await this.findOne(id);

        // Generate random password (12 karakter)
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let newPassword = '';
        for (let i = 0; i < 12; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update ke database
        await this.prisma.users.update({
            where: { id },
            data: {
                password: hashedPassword,
                updated_at: new Date(),
            },
        });

        return {
            message: 'Password berhasil direset',
            newPassword: newPassword
        };
    }
}
