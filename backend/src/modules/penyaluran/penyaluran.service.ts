import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePenyaluranDto, UpdatePenyaluranDto, BulkUpdatePenyaluranDto, GetPenyaluranQueryDto } from './dto';

@Injectable()
export class PenyaluranService {
    constructor(private prisma: PrismaService) { }

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

        const pangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true, deleted_at: null },
            select: { id: true, code: true, name: true, alokasi_bulanan: true },
            orderBy: { name: 'asc' },
        });

        const where: any = { tanggal: { gte: startDate, lte: endDate } };
        if (tipePembayaran) {
            where.tipe_pembayaran = tipePembayaran;
        }
        if (lpgType) {
            where.lpg_type = lpgType;
        }

        const penyaluran = await this.prisma.penyaluran_harian.findMany({
            where,
            orderBy: { tanggal: 'asc' },
        });

        const result = pangkalans.map(pangkalan => {
            const dailyData: Record<number, number> = {};
            let totalNormal = 0;
            let totalFakultatif = 0;

            for (let day = 1; day <= daysInMonth; day++) {
                dailyData[day] = 0;
            }

            const pangkalanData = penyaluran.filter(p => p.pangkalan_id === pangkalan.id);
            for (const p of pangkalanData) {
                const day = new Date(p.tanggal).getDate();
                dailyData[day] += p.jumlah;
                // Type assertion needed until prisma generate is run
                const kondisi = (p as any).kondisi || 'NORMAL';
                if (kondisi === 'NORMAL') {
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

        return { bulan, days_in_month: daysInMonth, data: result };
    }

    async create(dto: CreatePenyaluranDto) {
        const lpgType = (dto as any).lpg_type || 'kg3';
        return this.prisma.penyaluran_harian.upsert({
            where: {
                pangkalan_id_tanggal_lpg_type: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(dto.tanggal),
                    lpg_type: lpgType,
                },
            },
            update: {
                jumlah: dto.jumlah,
                tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
            },
            create: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                lpg_type: lpgType,
                jumlah: dto.jumlah,
                tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
            },
        });
    }

    async bulkUpdate(dto: BulkUpdatePenyaluranDto) {
        const lpgType = (dto as any).lpg_type || 'kg3';
        const operations = dto.data.map(item =>
            this.prisma.penyaluran_harian.upsert({
                where: {
                    pangkalan_id_tanggal_lpg_type: {
                        pangkalan_id: dto.pangkalan_id,
                        tanggal: new Date(item.tanggal),
                        lpg_type: lpgType,
                    },
                },
                update: {
                    jumlah: item.jumlah,
                    tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
                },
                create: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(item.tanggal),
                    lpg_type: lpgType,
                    jumlah: item.jumlah,
                    tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
                },
            })
        );

        return this.prisma.client.$transaction(operations);
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
