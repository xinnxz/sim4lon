import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePerencanaanDto, UpdatePerencanaanDto, BulkUpdatePerencanaanDto, GetPerencanaanQueryDto } from './dto';
import { kondisi_type } from '@prisma/client';

@Injectable()
export class PerencanaanService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all perencanaan with filters
     */
    async findAll(query: GetPerencanaanQueryDto) {
        const where: any = {};

        if (query.pangkalan_id) {
            where.pangkalan_id = query.pangkalan_id;
        }

        if (query.kondisi) {
            where.kondisi = query.kondisi as kondisi_type;
        }

        // Filter by month (YYYY-MM)
        if (query.bulan) {
            const [year, month] = query.bulan.split('-').map(Number);
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0); // Last day of month
            where.tanggal = {
                gte: startDate,
                lte: endDate,
            };
        }

        // Filter by date range
        if (query.tanggal_awal || query.tanggal_akhir) {
            where.tanggal = {
                ...(query.tanggal_awal && { gte: new Date(query.tanggal_awal) }),
                ...(query.tanggal_akhir && { lte: new Date(query.tanggal_akhir) }),
            };
        }

        const data = await this.prisma.perencanaan_harian.findMany({
            where,
            include: {
                pangkalans: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        alokasi_bulanan: true,
                        is_active: true,
                    },
                },
            },
            orderBy: [
                { pangkalan_id: 'asc' },
                { tanggal: 'asc' },
            ],
        });

        return data;
    }

    /**
     * Get rekapitulasi perencanaan for a month (grid view)
     */
    async getRekapitulasi(bulan: string, kondisi?: string) {
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const daysInMonth = endDate.getDate();

        // Get all pangkalans
        const pangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true, deleted_at: null },
            select: {
                id: true,
                code: true,
                name: true,
                alokasi_bulanan: true,
            },
            orderBy: { name: 'asc' },
        });

        // Get all perencanaan for this month
        const where: any = {
            tanggal: { gte: startDate, lte: endDate },
        };
        if (kondisi) {
            where.kondisi = kondisi as kondisi_type;
        }

        const perencanaan = await this.prisma.perencanaan_harian.findMany({
            where,
            orderBy: { tanggal: 'asc' },
        });

        // Build grid data
        const result = pangkalans.map(pangkalan => {
            const dailyData: Record<number, number> = {};
            let totalNormal = 0;
            let totalFakultatif = 0;

            // Initialize all days to 0
            for (let day = 1; day <= daysInMonth; day++) {
                dailyData[day] = 0;
            }

            // Fill in actual data
            const pangkalanData = perencanaan.filter(p => p.pangkalan_id === pangkalan.id);
            for (const p of pangkalanData) {
                const day = new Date(p.tanggal).getDate();
                dailyData[day] = p.jumlah;
                if (p.kondisi === 'NORMAL') {
                    totalNormal += p.jumlah;
                } else {
                    totalFakultatif += p.jumlah;
                }
            }

            return {
                id_registrasi: pangkalan.code,
                nama_pangkalan: pangkalan.name,
                pangkalan_id: pangkalan.id,
                alokasi: pangkalan.alokasi_bulanan,
                status: 'AKTIF',
                daily: dailyData,
                total_normal: totalNormal,
                total_fakultatif: totalFakultatif,
                sisa_alokasi: pangkalan.alokasi_bulanan - totalNormal - totalFakultatif,
                grand_total: totalNormal + totalFakultatif,
            };
        });

        return {
            bulan,
            days_in_month: daysInMonth,
            data: result,
        };
    }

    /**
     * Create single perencanaan entry
     */
    async create(dto: CreatePerencanaanDto) {
        return this.prisma.perencanaan_harian.upsert({
            where: {
                pangkalan_id_tanggal: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(dto.tanggal),
                },
            },
            update: {
                jumlah: dto.jumlah,
                kondisi: (dto.kondisi || 'NORMAL') as kondisi_type,
                alokasi_bulan: dto.alokasi_bulan || 0,
            },
            create: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                jumlah: dto.jumlah,
                kondisi: (dto.kondisi || 'NORMAL') as kondisi_type,
                alokasi_bulan: dto.alokasi_bulan || 0,
            },
        });
    }

    /**
     * Bulk update perencanaan (for grid input)
     */
    async bulkUpdate(dto: BulkUpdatePerencanaanDto) {
        const operations = dto.data.map(item =>
            this.prisma.perencanaan_harian.upsert({
                where: {
                    pangkalan_id_tanggal: {
                        pangkalan_id: dto.pangkalan_id,
                        tanggal: new Date(item.tanggal),
                    },
                },
                update: {
                    jumlah: item.jumlah,
                    kondisi: (dto.kondisi || 'NORMAL') as kondisi_type,
                },
                create: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(item.tanggal),
                    jumlah: item.jumlah,
                    kondisi: (dto.kondisi || 'NORMAL') as kondisi_type,
                },
            })
        );

        return this.prisma.client.$transaction(operations);
    }

    /**
     * Update single entry
     */
    async update(id: string, dto: UpdatePerencanaanDto) {
        const existing = await this.prisma.perencanaan_harian.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Perencanaan tidak ditemukan');
        }

        return this.prisma.perencanaan_harian.update({
            where: { id },
            data: {
                ...(dto.jumlah !== undefined && { jumlah: dto.jumlah }),
                ...(dto.kondisi && { kondisi: dto.kondisi as kondisi_type }),
            },
        });
    }

    /**
     * Delete entry
     */
    async delete(id: string) {
        return this.prisma.perencanaan_harian.delete({ where: { id } });
    }
}
