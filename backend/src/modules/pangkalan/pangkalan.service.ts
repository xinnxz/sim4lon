import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
import * as bcrypt from 'bcryptjs';

/**
 * PangkalanService
 * 
 * Mengelola data pangkalan dan akun login terkait.
 * Saat create pangkalan baru, jika login_email & login_password diberikan,
 * maka otomatis membuat user dengan role PANGKALAN.
 */
@Injectable()
export class PangkalanService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all pangkalans with user data (email login)
     */
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
                    // Include user terkait (yang punya pangkalan_id = this.id)
                    users: {
                        where: { deleted_at: null },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            is_active: true,
                        },
                        take: 1, // Ambil 1 user saja (primary user)
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

    /**
     * Get single pangkalan with user data
     */
    async findOne(id: string) {
        const pangkalan = await this.prisma.pangkalans.findFirst({
            where: { id, deleted_at: null },
            include: {
                _count: {
                    select: { orders: true },
                },
                // Include user terkait
                users: {
                    where: { deleted_at: null },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        is_active: true,
                    },
                },
            },
        });

        if (!pangkalan) {
            throw new NotFoundException('Pangkalan tidak ditemukan');
        }

        return pangkalan;
    }

    /**
     * Create pangkalan + user account (jika login_email dan login_password diberikan)
     */
    async create(dto: CreatePangkalanDto) {
        // Validasi: jika salah satu ada, keduanya harus ada
        if ((dto.login_email && !dto.login_password) || (!dto.login_email && dto.login_password)) {
            throw new BadRequestException('Email login dan password harus diisi keduanya');
        }

        // Cek apakah email sudah ada
        if (dto.login_email) {
            const existingUser = await this.prisma.users.findUnique({
                where: { email: dto.login_email },
            });
            if (existingUser) {
                throw new BadRequestException('Email login sudah digunakan');
            }
        }

        // Generate pangkalan code (PKL-001, PKL-002, etc.)
        const pangkalanCount = await this.prisma.pangkalans.count();
        const pangkalanCode = `PKL-${String(pangkalanCount + 1).padStart(3, '0')}`;

        // 1. Create pangkalan
        const pangkalan = await this.prisma.pangkalans.create({
            data: {
                code: pangkalanCode,
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

        // 2. Create user jika login_email dan login_password ada
        if (dto.login_email && dto.login_password) {
            // Generate user code (USR-001, USR-002, etc.)
            const userCount = await this.prisma.users.count();
            const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;

            const hashedPassword = await bcrypt.hash(dto.login_password, 10);

            await this.prisma.users.create({
                data: {
                    code: userCode,
                    email: dto.login_email,
                    password: hashedPassword,
                    name: dto.pic_name || dto.name, // Gunakan nama PIC atau nama pangkalan
                    phone: dto.phone,
                    role: 'PANGKALAN',
                    pangkalan_id: pangkalan.id,
                },
            });
        }

        // Return pangkalan with user data
        return this.findOne(pangkalan.id);
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
