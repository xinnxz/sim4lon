import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsumerDto, UpdateConsumerDto } from './dto';

/**
 * ConsumerService
 * 
 * Service untuk mengelola data konsumen/pelanggan pangkalan.
 * Setiap consumer hanya bisa diakses oleh pangkalan yang memilikinya (multi-tenant).
 * 
 * PENJELASAN:
 * - Consumer adalah pelanggan pangkalan (warung, ibu-ibu, dll)
 * - Setiap pangkalan punya daftar consumer sendiri-sendiri
 * - pangkalan_id diambil dari JWT token user yang login
 */
@Injectable()
export class ConsumerService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all consumers for a specific pangkalan
     * Hanya menampilkan consumer milik pangkalan tersebut
     */
    async findAll(pangkalanId: string, page = 1, limit = 10, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {
            pangkalan_id: pangkalanId,  // Filter by pangkalan (multi-tenant)
            is_active: true,  // Only show active consumers (exclude soft-deleted)
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [consumers, total] = await Promise.all([
            this.prisma.consumers.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    _count: {
                        select: { consumer_orders: true },
                    },
                },
            }),
            this.prisma.consumers.count({ where }),
        ]);

        return {
            data: consumers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get single consumer by ID
     * Memeriksa apakah consumer milik pangkalan yang meminta
     */
    async findOne(id: string, pangkalanId: string) {
        const consumer = await this.prisma.consumers.findFirst({
            where: { id },
            include: {
                _count: {
                    select: { consumer_orders: true },
                },
            },
        });

        if (!consumer) {
            throw new NotFoundException('Pelanggan tidak ditemukan');
        }

        // Check ownership (multi-tenant security)
        if (consumer.pangkalan_id !== pangkalanId) {
            throw new ForbiddenException('Anda tidak memiliki akses ke data ini');
        }

        return consumer;
    }

    /**
     * Create new consumer for a pangkalan
     * Menyimpan data konsumen baru termasuk consumer_type, nik, dan kk
     */
    async create(pangkalanId: string, dto: CreateConsumerDto) {
        // Check if NIK is already registered
        if (dto.nik) {
            const existingNik = await this.prisma.consumers.findFirst({
                where: {
                    pangkalan_id: pangkalanId,
                    nik: dto.nik
                },
            });
            if (existingNik) {
                throw new ForbiddenException('NIK sudah terdaftar');
            }
        }

        // Check if KK is already registered
        if (dto.kk) {
            const existingKk = await this.prisma.consumers.findFirst({
                where: {
                    pangkalan_id: pangkalanId,
                    kk: dto.kk
                },
            });
            if (existingKk) {
                throw new ForbiddenException('Nomor KK sudah terdaftar');
            }
        }

        const consumer = await this.prisma.consumers.create({
            data: {
                pangkalan_id: pangkalanId,
                name: dto.name,
                nik: dto.nik,
                kk: dto.kk,
                consumer_type: dto.consumer_type || 'RUMAH_TANGGA',
                phone: dto.phone,
                address: dto.address,
                note: dto.note,
            },
        });

        return consumer;
    }

    /**
     * Update consumer
     * Memeriksa kepemilikan sebelum update
     */
    async update(id: string, pangkalanId: string, dto: UpdateConsumerDto) {
        // Verify ownership first
        await this.findOne(id, pangkalanId);

        // Check if NIK is already registered by another consumer
        if (dto.nik) {
            const existingNik = await this.prisma.consumers.findFirst({
                where: {
                    pangkalan_id: pangkalanId,
                    nik: dto.nik,
                    id: { not: id }  // Exclude current consumer
                },
            });
            if (existingNik) {
                throw new ForbiddenException('NIK sudah terdaftar');
            }
        }

        // Check if KK is already registered by another consumer
        if (dto.kk) {
            const existingKk = await this.prisma.consumers.findFirst({
                where: {
                    pangkalan_id: pangkalanId,
                    kk: dto.kk,
                    id: { not: id }  // Exclude current consumer
                },
            });
            if (existingKk) {
                throw new ForbiddenException('Nomor KK sudah terdaftar');
            }
        }

        const consumer = await this.prisma.consumers.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
        });

        return consumer;
    }

    /**
     * Delete consumer (soft delete)
     * Memeriksa kepemilikan sebelum delete
     */
    async remove(id: string, pangkalanId: string) {
        // Verify ownership first
        await this.findOne(id, pangkalanId);

        // Check if consumer has orders
        const orderCount = await this.prisma.consumer_orders.count({
            where: { consumer_id: id },
        });

        if (orderCount > 0) {
            // Soft delete - just mark as inactive
            await this.prisma.consumers.update({
                where: { id },
                data: { is_active: false },
            });
            return { message: 'Pelanggan dinonaktifkan karena memiliki riwayat pesanan' };
        }

        // Hard delete if no orders
        await this.prisma.consumers.delete({
            where: { id },
        });

        return { message: 'Pelanggan berhasil dihapus' };
    }

    /**
     * Get consumer stats for dashboard
     * Menghitung total, aktif, tidak aktif, dan per jenis (RUMAH_TANGGA/WARUNG)
     */
    async getStats(pangkalanId: string) {
        // Only count active consumers for all stats (exclude soft-deleted)
        const baseWhere = { pangkalan_id: pangkalanId, is_active: true };

        const [total, active, rumahTangga, warung, withNik] = await Promise.all([
            // Total = active consumers only
            this.prisma.consumers.count({
                where: baseWhere,
            }),
            // Active count (same as total since we filter is_active)
            this.prisma.consumers.count({
                where: baseWhere,
            }),
            // Count by consumer_type RUMAH_TANGGA (active only)
            this.prisma.consumers.count({
                where: { ...baseWhere, consumer_type: 'RUMAH_TANGGA' },
            }),
            // Count by consumer_type WARUNG (active only)
            this.prisma.consumers.count({
                where: { ...baseWhere, consumer_type: 'WARUNG' },
            }),
            // Count consumers with NIK verified (active only)
            this.prisma.consumers.count({
                where: {
                    ...baseWhere,
                    nik: { not: null }
                },
            }),
        ]);

        return {
            total,
            active,
            inactive: total - active,
            rumahTangga,   // Jumlah konsumen Rumah Tangga
            warung,        // Jumlah konsumen Warung
            withNik,       // Jumlah konsumen dengan NIK terverifikasi
        };
    }
}
