"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenyaluranService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
const activity_service_1 = require("../activity/activity.service");
let PenyaluranService = class PenyaluranService {
    prisma;
    activityService;
    constructor(prisma, activityService) {
        this.prisma = prisma;
        this.activityService = activityService;
    }
    async findAll(query) {
        const where = {};
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
    async getRekapitulasi(bulan, tipePembayaran, lpgType) {
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
        const isSubsidi = !lpgType || lpgType === 'kg3';
        const where = { tanggal: { gte: startDate, lte: endDate } };
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
            const dailyData = {};
            let totalNormal = 0;
            let totalFakultatif = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                dailyData[day] = 0;
            }
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
                alokasi: isSubsidi ? pangkalan.alokasi_bulanan : 0,
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
    async create(dto) {
        const lpgType = dto.lpg_type || 'kg3';
        const kondisi = dto.kondisi || 'NORMAL';
        const jumlahNormal = kondisi === 'NORMAL' ? dto.jumlah : 0;
        const jumlahFakultatif = kondisi === 'FAKULTATIF' ? dto.jumlah : 0;
        const pangkalan = await this.prisma.pangkalans.findUnique({
            where: { id: dto.pangkalan_id },
            select: { name: true },
        });
        const existing = await this.prisma.penyaluran_harian.findFirst({
            where: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                lpg_type: lpgType,
            },
        });
        let result;
        if (existing) {
            result = await this.prisma.penyaluran_harian.update({
                where: { id: existing.id },
                data: {
                    jumlah_normal: kondisi === 'NORMAL' ? dto.jumlah : existing.jumlah_normal,
                    jumlah_fakultatif: kondisi === 'FAKULTATIF'
                        ? existing.jumlah_fakultatif + dto.jumlah
                        : existing.jumlah_fakultatif,
                    tipe_pembayaran: dto.tipe_pembayaran || existing.tipe_pembayaran,
                },
            });
        }
        else {
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
        await this.activityService.logActivity('stock_out', 'Stok Keluar', {
            description: `Penyaluran ${dto.jumlah} tabung ke ${pangkalan?.name || 'Pangkalan'}`,
            pangkalanName: pangkalan?.name,
            detailNumeric: dto.jumlah,
        });
        return result;
    }
    async bulkUpdate(dto) {
        const lpgType = dto.lpg_type || 'kg3';
        const results = [];
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
                        jumlah_normal: item.jumlah,
                        tipe_pembayaran: dto.tipe_pembayaran || 'CASHLESS',
                    },
                });
                results.push(updated);
            }
            else {
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
    async update(id, dto) {
        const existing = await this.prisma.penyaluran_harian.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Penyaluran tidak ditemukan');
        }
        return this.prisma.penyaluran_harian.update({
            where: { id },
            data: {
                ...(dto.jumlah !== undefined && { jumlah: dto.jumlah }),
                ...(dto.tipe_pembayaran && { tipe_pembayaran: dto.tipe_pembayaran }),
            },
        });
    }
    async delete(id) {
        return this.prisma.penyaluran_harian.delete({ where: { id } });
    }
};
exports.PenyaluranService = PenyaluranService;
exports.PenyaluranService = PenyaluranService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        activity_service_1.ActivityService])
], PenyaluranService);
//# sourceMappingURL=penyaluran.service.js.map