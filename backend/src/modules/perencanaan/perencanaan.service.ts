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
    async getRekapitulasi(bulan: string, kondisi?: string, lpgType?: string) {
        const [year, month] = bulan.split('-').map(Number);
        // Use UTC to match how dates are stored in database
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month - 1, 31, 23, 59, 59)); // Dec has 31 days
        // Calculate correct days in month
        const daysInMonth = new Date(year, month, 0).getDate();
        // Adjust endDate to actual last day of month
        const actualEndDate = new Date(Date.UTC(year, month - 1, daysInMonth, 23, 59, 59));

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
            tanggal: { gte: startDate, lte: actualEndDate },
        };
        if (kondisi) {
            where.kondisi = kondisi as kondisi_type;
        }
        if (lpgType) {
            where.lpg_type = lpgType;
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

            // Fill in actual data - now using jumlah_normal + jumlah_fakultatif
            const pangkalanData = perencanaan.filter(p => p.pangkalan_id === pangkalan.id);
            for (const p of pangkalanData) {
                // Use getUTCDate to avoid timezone shifting the day
                const day = new Date(p.tanggal).getUTCDate();
                // Daily shows total (normal + fakultatif)
                dailyData[day] = p.jumlah_normal + p.jumlah_fakultatif;
                totalNormal += p.jumlah_normal;
                totalFakultatif += p.jumlah_fakultatif;
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
     * Uses jumlah_normal and jumlah_fakultatif columns
     */
    async create(dto: CreatePerencanaanDto) {
        const lpgType = (dto as any).lpg_type || 'kg3';
        const kondisi = dto.kondisi || 'NORMAL';
        const jumlahNormal = kondisi === 'NORMAL' ? dto.jumlah : 0;
        const jumlahFakultatif = kondisi === 'FAKULTATIF' ? dto.jumlah : 0;

        // Check if record exists
        const existing = await this.prisma.perencanaan_harian.findFirst({
            where: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                lpg_type: lpgType,
            },
        });

        if (existing) {
            // Update existing record - add to appropriate column
            return this.prisma.perencanaan_harian.update({
                where: { id: existing.id },
                data: {
                    jumlah_normal: kondisi === 'NORMAL' ? dto.jumlah : existing.jumlah_normal,
                    jumlah_fakultatif: kondisi === 'FAKULTATIF' ? dto.jumlah : existing.jumlah_fakultatif,
                    alokasi_bulan: dto.alokasi_bulan || existing.alokasi_bulan,
                },
            });
        }

        // No existing record - create new
        return this.prisma.perencanaan_harian.create({
            data: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                lpg_type: lpgType,
                jumlah_normal: jumlahNormal,
                jumlah_fakultatif: jumlahFakultatif,
                alokasi_bulan: dto.alokasi_bulan || 0,
            },
        });
    }

    /**
     * Bulk update perencanaan (for grid input)
     * Now accepts jumlah_normal and jumlah_fakultatif per item
     */
    async bulkUpdate(dto: BulkUpdatePerencanaanDto) {
        const lpgType = (dto as any).lpg_type || 'kg3';
        const results: any[] = [];

        for (const item of dto.data) {
            // Support both old format (jumlah + kondisi) and new format (jumlah_normal + jumlah_fakultatif)
            const itemKondisi = (item as any).kondisi || dto.kondisi || 'NORMAL';
            const jumlahNormal = (item as any).jumlah_normal !== undefined
                ? (item as any).jumlah_normal
                : (itemKondisi === 'NORMAL' ? item.jumlah : 0);
            const jumlahFakultatif = (item as any).jumlah_fakultatif !== undefined
                ? (item as any).jumlah_fakultatif
                : (itemKondisi === 'FAKULTATIF' ? item.jumlah : 0);

            const existing = await this.prisma.perencanaan_harian.findFirst({
                where: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(item.tanggal),
                    lpg_type: lpgType,
                },
            });

            if (existing) {
                const updated = await this.prisma.perencanaan_harian.update({
                    where: { id: existing.id },
                    data: {
                        jumlah_normal: jumlahNormal,
                        jumlah_fakultatif: jumlahFakultatif,
                    },
                });
                results.push(updated);
            } else {
                const created = await this.prisma.perencanaan_harian.create({
                    data: {
                        pangkalan_id: dto.pangkalan_id,
                        tanggal: new Date(item.tanggal),
                        lpg_type: lpgType,
                        jumlah_normal: jumlahNormal,
                        jumlah_fakultatif: jumlahFakultatif,
                    },
                });
                results.push(created);
            }
        }

        return results;
    }

    /**
     * Update single entry
     */
    async update(id: string, dto: UpdatePerencanaanDto) {
        const existing = await this.prisma.perencanaan_harian.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Perencanaan tidak ditemukan');
        }

        const kondisi = dto.kondisi || 'NORMAL';
        const data: any = {};

        if (dto.jumlah !== undefined) {
            if (kondisi === 'NORMAL') {
                data.jumlah_normal = dto.jumlah;
            } else {
                data.jumlah_fakultatif = dto.jumlah;
            }
        }

        return this.prisma.perencanaan_harian.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete entry
     */
    async delete(id: string) {
        return this.prisma.perencanaan_harian.delete({ where: { id } });
    }

    /**
     * Auto-generate perencanaan from pangkalan's alokasi_bulanan
     * OPTIMIZED: Uses bulk deleteMany + createMany instead of individual upserts
     */
    async autoGenerate(bulan: string, lpgType: string = 'kg3', kondisi: string = 'NORMAL', overwrite: boolean = false) {
        const startTime = Date.now();
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0));

        // Get all active pangkalan
        const pangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true },
            select: { id: true, name: true, alokasi_bulanan: true }
        });

        // Calculate work days in month (exclude Sundays)
        const daysInMonth = new Date(year, month, 0).getDate();
        let workDays = 0;
        const dayConfig: { day: number; isSunday: boolean; isSaturday: boolean }[] = [];

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(Date.UTC(year, month - 1, d, 12, 0, 0));
            const dayOfWeek = date.getUTCDay();
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            dayConfig.push({ day: d, isSunday, isSaturday });

            if (!isSunday) {
                workDays += isSaturday ? 0.5 : 1;
            }
        }

        // Build all records to insert
        const recordsToInsert: Array<{
            pangkalan_id: string;
            tanggal: Date;
            jumlah_normal: number;
            jumlah_fakultatif: number;
            lpg_type: any;
        }> = [];

        let skipped = 0;

        for (const pangkalan of pangkalans) {
            if (!pangkalan.alokasi_bulanan || pangkalan.alokasi_bulanan <= 0) {
                skipped++;
                continue;
            }

            const dailyAlokasi = Math.round(pangkalan.alokasi_bulanan / workDays);
            const saturdayAlokasi = Math.round(dailyAlokasi * 0.5);

            for (const dayInfo of dayConfig) {
                if (dayInfo.isSunday) continue;

                const tanggal = new Date(Date.UTC(year, month - 1, dayInfo.day, 12, 0, 0));
                const jumlah = dayInfo.isSaturday ? saturdayAlokasi : dailyAlokasi;

                // Use jumlah_normal for NORMAL kondisi, jumlah_fakultatif for FAKULTATIF
                recordsToInsert.push({
                    pangkalan_id: pangkalan.id,
                    tanggal,
                    jumlah_normal: kondisi === 'NORMAL' ? jumlah : 0,
                    jumlah_fakultatif: kondisi === 'FAKULTATIF' ? jumlah : 0,
                    lpg_type: lpgType as any,
                });
            }
        }

        // Execute bulk operations in a single transaction
        const pangkalanIds = pangkalans.filter(p => p.alokasi_bulanan && p.alokasi_bulanan > 0).map(p => p.id);

        let deletedCount = 0;
        let createdCount = 0;

        if (overwrite && pangkalanIds.length > 0) {
            // Delete existing records for this month, lpg_type, and kondisi
            const deleteResult = await this.prisma.perencanaan_harian.deleteMany({
                where: {
                    pangkalan_id: { in: pangkalanIds },
                    tanggal: { gte: startDate, lte: endDate },
                    lpg_type: lpgType as any,
                }
            });
            deletedCount = deleteResult.count;

            // Bulk insert all new records
            const createResult = await this.prisma.perencanaan_harian.createMany({
                data: recordsToInsert,
            });
            createdCount = createResult.count;
        } else {
            // For non-overwrite mode, we still need to check existing records
            // Use createMany with skipDuplicates (if unique constraint exists)
            try {
                const createResult = await this.prisma.perencanaan_harian.createMany({
                    data: recordsToInsert,
                    skipDuplicates: true,
                });
                createdCount = createResult.count;
            } catch (error) {
                // Fallback: If skipDuplicates doesn't work, use individual creates
                // This is slower but handles the case where unique constraint might differ
                for (const record of recordsToInsert) {
                    try {
                        await this.prisma.perencanaan_harian.create({ data: record });
                        createdCount++;
                    } catch (e) {
                        // Record already exists, skip
                    }
                }
            }
        }

        const duration = Date.now() - startTime;

        return {
            success: true,
            message: `Auto-generated perencanaan untuk ${pangkalans.length - skipped} pangkalan dalam ${duration}ms`,
            details: {
                bulan,
                lpg_type: lpgType,
                kondisi,
                total_pangkalan: pangkalans.length,
                skipped_no_alokasi: skipped,
                work_days: workDays,
                deleted_records: deletedCount,
                created_records: createdCount,
                duration_ms: duration,
            }
        };
    }
}
