import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePangkalanDto, UpdatePangkalanDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { ActivityService } from '../activity/activity.service';

/**
 * PangkalanService
 * 
 * Mengelola data pangkalan dan akun login terkait.
 * Saat create pangkalan baru, jika login_email & login_password diberikan,
 * maka otomatis membuat user dengan role PANGKALAN.
 */
@Injectable()
export class PangkalanService {
    constructor(
        private prisma: PrismaService,
        private activityService: ActivityService,
    ) { }

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

        // Get data, filtered count, and stats counts in parallel
        const [pangkalans, total, totalActive, totalInactive, alokasiSum] = await Promise.all([
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
            // Get total active pangkalans (ignoring current filter)
            this.prisma.pangkalans.count({ where: { deleted_at: null, is_active: true } }),
            // Get total inactive pangkalans (ignoring current filter)
            this.prisma.pangkalans.count({ where: { deleted_at: null, is_active: false } }),
            // Get total alokasi from active pangkalans
            this.prisma.pangkalans.aggregate({
                where: { deleted_at: null, is_active: true },
                _sum: { alokasi_bulanan: true },
            }),
        ]);

        return {
            data: pangkalans,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                // Stats for summary cards (always show true totals)
                totalActive,
                totalInactive,
                totalAll: totalActive + totalInactive,
                totalAlokasi: alokasiSum._sum.alokasi_bulanan || 0,
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

        /**
     * Generate pangkalan code dengan format Pertamina Cianjur
     * Format: 3432629979040XXX
     * - 3432: Kode Kabupaten Cianjur
     * - 62: Kode Kecamatan
     * - 9979: Kode Area
     * - 04: Tahun registrasi
     * - 0XXX: Nomor urut (4 digit)
     * 
     * Note: Mencari nomor tertinggi dari SEMUA kode yang ada, bukan hanya prefix standar
     */
        // Ambil semua pangkalan yang kodenya numeric (format Pertamina)
        const allPangkalans = await this.prisma.pangkalans.findMany({
            where: {
                code: { startsWith: '3432' } // Semua kode Cianjur area
            },
            select: { code: true },
            orderBy: { code: 'desc' }
        });

        let nextNumber = 1;
        if (allPangkalans.length > 0) {
            // Cari angka terakhir tertinggi dari semua kode yang ada
            const maxNumber = Math.max(
                ...allPangkalans.map(p => {
                    const lastFour = p.code.slice(-4);
                    return parseInt(lastFour, 10) || 0;
                })
            );
            nextNumber = maxNumber + 1;
        }

        // Format: 3432629979040001, 3432629979040002, dst
        const pangkalanCode = `343262997904${String(nextNumber).padStart(4, '0')}`;

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
                alokasi_bulanan: dto.alokasi_bulanan || 0,
                note: dto.note,
            },
        });

        // 2. Create user jika login_email dan login_password ada
        if (dto.login_email && dto.login_password) {
            // Generate user code (USR-001, USR-002, etc.) - find highest existing code
            const lastUser = await this.prisma.users.findFirst({
                where: { code: { startsWith: 'USR-' } },
                orderBy: { code: 'desc' },
                select: { code: true }
            });
            let nextUserNum = 1;
            if (lastUser?.code) {
                const lastNum = parseInt(lastUser.code.replace('USR-', ''), 10);
                nextUserNum = (lastNum || 0) + 1;
            }
            const userCode = `USR-${String(nextUserNum).padStart(3, '0')}`;

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

        // Log system_create activity
        await this.activityService.logActivity('system_create', 'Pangkalan Baru Dibuat', {
            description: `Pangkalan ${dto.name} (${pangkalanCode}) berhasil ditambahkan`,
            pangkalanName: dto.name,
        });

        // Return pangkalan with user data
        return this.findOne(pangkalan.id);
    }

    async update(id: string, dto: UpdatePangkalanDto) {
        const existing = await this.findOne(id);

        const pangkalan = await this.prisma.pangkalans.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });

        // Sync ke user terkait jika ada perubahan yang relevan
        if (existing.users && existing.users.length > 0) {
            const userId = existing.users[0].id;
            const userUpdateData: any = { updated_at: new Date() };

            // Sync email pangkalan ke user (jika email pangkalan berubah)
            if (dto.email && dto.email !== existing.email) {
                userUpdateData.email = dto.email;
            }
            // Sync phone
            if (dto.phone && dto.phone !== existing.phone) {
                userUpdateData.phone = dto.phone;
            }
            // Sync nama (pic_name atau name)
            if (dto.pic_name && dto.pic_name !== existing.pic_name) {
                userUpdateData.name = dto.pic_name;
            } else if (dto.name && dto.name !== existing.name && !existing.pic_name) {
                userUpdateData.name = dto.name;
            }
            // Sync status aktif
            if (dto.is_active !== undefined && dto.is_active !== existing.is_active) {
                userUpdateData.is_active = dto.is_active;
            }

            // Update user jika ada perubahan
            if (Object.keys(userUpdateData).length > 1) { // > 1 karena updated_at selalu ada
                await this.prisma.users.update({
                    where: { id: userId },
                    data: userUpdateData,
                });
            }
        }

        // Log system_update activity
        await this.activityService.logActivity('system_update', 'Data Pangkalan Diperbarui', {
            description: `Data ${existing.name} berhasil diperbarui`,
            pangkalanName: existing.name,
        });

        return this.findOne(id);
    }

    async remove(id: string) {
        const existing = await this.findOne(id);

        // Soft delete pangkalan
        await this.prisma.pangkalans.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        // Soft delete user terkait juga
        if (existing.users && existing.users.length > 0) {
            await this.prisma.users.updateMany({
                where: { pangkalan_id: id },
                data: {
                    deleted_at: new Date(),
                    is_active: false,
                },
            });
        }

        // Log system_delete activity
        await this.activityService.logActivity('system_delete', 'Pangkalan Dihapus', {
            description: `Pangkalan ${existing.name} berhasil dihapus`,
            pangkalanName: existing.name,
        });

        return { message: 'Pangkalan berhasil dihapus' };
    }
}
