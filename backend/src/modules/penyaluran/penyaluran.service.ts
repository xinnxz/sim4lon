import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePenyaluranDto, UpdatePenyaluranDto, BulkUpdatePenyaluranDto, GetPenyaluranQueryDto } from './dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class PenyaluranService {
    constructor(
        private prisma: PrismaService,
        private activityService: ActivityService,
    ) { }

    async findAll(query: GetPenyaluranQueryDto) {
        const where: any = {};

        if (query.pangkalan_id) {
            where.pangkalan_id = query.pangkalan_id;
        }

        if (query.tipe_pembayaran) {
            where.tipe_pembayaran = query.tipe_pembayaran;
        }

        if (query.bulan) {
            const [year, month] = query.bulan.split('-').map(Number);
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            where.tanggal = { gte: startDate, lte: endDate };
        }

        if (query.tanggal_awal || query.tanggal_akhir) {
            where.tanggal = {
                ...(query.tanggal_awal && { gte: new Date(query.tanggal_awal) }),
                ...(query.tanggal_akhir && { lte: new Date(query.tanggal_akhir) }),
            };
        }

        const data = await this.prisma.penyaluran_harian.findMany({
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
            orderBy: [{ pangkalan_id: 'asc' }, { tanggal: 'asc' }],
        });

        return data;
    }

    async getRekapitulasi(bulan: string, tipePembayaran?: string, lpgType?: string) {
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const daysInMonth = endDate.getDate();

        console.log('[Penyaluran] getRekapitulasi called:', { bulan, tipePembayaran, lpgType });

        const pangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true, deleted_at: null },
            select: { id: true, code: true, name: true, alokasi_bulanan: true },
            orderBy: { name: 'asc' },
        });

        console.log('[Penyaluran] Found pangkalans:', pangkalans.length);

        // Determine if this is a subsidi type (kg3 = 3kg) for alokasi display purposes
        const isSubsidi = !lpgType || lpgType === 'kg3';

        // UNIFIED QUERY: Use penyaluran_harian for ALL lpg_types
        const where: any = { tanggal: { gte: startDate, lte: endDate } };
        if (tipePembayaran) {
            where.tipe_pembayaran = tipePembayaran;
        }
        if (lpgType) {
            where.lpg_type = lpgType;
        }

        console.log('[Penyaluran] Query where:', JSON.stringify(where));

        const penyaluran = await this.prisma.penyaluran_harian.findMany({
            where,
            orderBy: { tanggal: 'asc' },
        });

        console.log('[Penyaluran] Found penyaluran records:', penyaluran.length);

        const result = pangkalans.map(pangkalan => {
            const dailyData: Record<number, number> = {};
            let totalNormal = 0;
            let totalFakultatif = 0;

            // Initialize all days with 0
            for (let day = 1; day <= daysInMonth; day++) {
                dailyData[day] = 0;
            }

            // Aggregate data for this pangkalan - now using jumlah_normal + jumlah_fakultatif
            const pangkalanData = penyaluran.filter(p => p.pangkalan_id === pangkalan.id);
            for (const p of pangkalanData) {
                const day = new Date(p.tanggal).getUTCDate();
                dailyData[day] += p.jumlah_normal + p.jumlah_fakultatif;
                totalNormal += p.jumlah_normal;
                totalFakultatif += p.jumlah_fakultatif;
            }

            return {
                id_registrasi: pangkalan.code,
                nama_pangkalan: pangkalan.name,
                pangkalan_id: pangkalan.id,
                alokasi: isSubsidi ? pangkalan.alokasi_bulanan : 0,  // Only show alokasi for subsidi
                status: 'AKTIF',
                daily: dailyData,
                total_normal: totalNormal,
                total_fakultatif: totalFakultatif,
                sisa_alokasi: isSubsidi ? pangkalan.alokasi_bulanan - totalNormal - totalFakultatif : 0,
                grand_total: totalNormal + totalFakultatif,
            };
        });

        console.log('[Penyaluran] Result count:', result.length);
        return { bulan, days_in_month: daysInMonth, data: result };
    }

    /**
     * Create single penyaluran entry - uses jumlah_normal and jumlah_fakultatif
     */
    async create(dto: CreatePenyaluranDto) {
        const lpgType = (dto as any).lpg_type || 'kg3';
        const kondisi = (dto as any).kondisi || 'NORMAL';
        const jumlahNormal = kondisi === 'NORMAL' ? dto.jumlah : 0;
        const jumlahFakultatif = kondisi === 'FAKULTATIF' ? dto.jumlah : 0;

        // Get pangkalan name for activity log
        const pangkalan = await this.prisma.pangkalans.findUnique({
            where: { id: dto.pangkalan_id },
            select: { name: true },
        });

        // Check if record exists
        const existing = await this.prisma.penyaluran_harian.findFirst({
            where: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                lpg_type: lpgType,
            },
        });

        let result;
        if (existing) {
            // Update existing record
            result = await this.prisma.penyaluran_harian.update({
                where: { id: existing.id },
                data: {
                    jumlah_normal: kondisi === 'NORMAL' ? dto.jumlah : existing.jumlah_normal,
                    jumlah_fakultatif: kondisi === 'FAKULTATIF'
                        ? existing.jumlah_fakultatif + dto.jumlah  // Add for fakultatif
                        : existing.jumlah_fakultatif,
                    tipe_pembayaran: dto.tipe_pembayaran || existing.tipe_pembayaran,
                },
            });
        } else {
            // No existing record - create new
            result = await this.prisma.penyaluran_harian.create({
                data: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(dto.tanggal),
                    lpg_type: lpgType,
                    jumlah_normal: jumlahNormal,
                    jumlah_fakultatif: jumlahFakultatif,
                    tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
                },
            });
        }

        // Log stock_out activity
        await this.activityService.logActivity('stock_out', 'Stok Keluar', {
            description: `Penyaluran ${dto.jumlah} tabung ke ${pangkalan?.name || 'Pangkalan'}`,
            pangkalanName: pangkalan?.name,
            detailNumeric: dto.jumlah,
        });

        return result;
    }

    async bulkUpdate(dto: BulkUpdatePenyaluranDto) {
        const lpgType = (dto as any).lpg_type || 'kg3';
        const results: any[] = [];

        for (const item of dto.data) {
            const existing = await this.prisma.penyaluran_harian.findFirst({
                where: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(item.tanggal),
                    lpg_type: lpgType,
                },
            });

            if (existing) {
                const updated = await this.prisma.penyaluran_harian.update({
                    where: { id: existing.id },
                    data: {
                        jumlah_normal: item.jumlah,  // Default to normal for bulk updates
                        tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
                    },
                });
                results.push(updated);
            } else {
                const created = await this.prisma.penyaluran_harian.create({
                    data: {
                        pangkalan_id: dto.pangkalan_id,
                        tanggal: new Date(item.tanggal),
                        lpg_type: lpgType,
                        jumlah_normal: item.jumlah,
                        jumlah_fakultatif: 0,
                        tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
                    },
                });
                results.push(created);
            }
        }

        return results;
    }

    async update(id: string, dto: UpdatePenyaluranDto) {
        const existing = await this.prisma.penyaluran_harian.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Penyaluran tidak ditemukan');
        }

        return this.prisma.penyaluran_harian.update({
            where: { id },
            data: {
                ...(dto.jumlah !== undefined && { jumlah: dto.jumlah }),
                ...(dto.tipe_pembayaran && { tipe_pembayaran: dto.tipe_pembayaran }),
            },
        });
    }

    async delete(id: string) {
        return this.prisma.penyaluran_harian.delete({ where: { id } });
    }
}
