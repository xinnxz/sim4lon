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
exports.PerencanaanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
let PerencanaanService = class PerencanaanService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.pangkalan_id) {
            where.pangkalan_id = query.pangkalan_id;
        }
        if (query.bulan) {
            const [year, month] = query.bulan.split('-').map(Number);
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            where.tanggal = {
                gte: startDate,
                lte: endDate,
            };
        }
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
    async getRekapitulasi(bulan, kondisi, lpgType) {
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month - 1, 31, 23, 59, 59));
        const daysInMonth = new Date(year, month, 0).getDate();
        const actualEndDate = new Date(Date.UTC(year, month - 1, daysInMonth, 23, 59, 59));
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
        const where = {
            tanggal: { gte: startDate, lte: actualEndDate },
        };
        if (lpgType) {
            where.lpg_type = lpgType;
        }
        const perencanaan = await this.prisma.perencanaan_harian.findMany({
            where,
            orderBy: { tanggal: 'asc' },
        });
        const result = pangkalans.map(pangkalan => {
            const dailyData = {};
            let totalNormal = 0;
            let totalFakultatif = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                dailyData[day] = 0;
            }
            const pangkalanData = perencanaan.filter(p => p.pangkalan_id === pangkalan.id);
            for (const p of pangkalanData) {
                const day = new Date(p.tanggal).getUTCDate();
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
    async create(dto) {
        const lpgType = dto.lpg_type || 'kg3';
        const kondisi = dto.kondisi || 'NORMAL';
        const jumlahNormal = kondisi === 'NORMAL' ? dto.jumlah : 0;
        const jumlahFakultatif = kondisi === 'FAKULTATIF' ? dto.jumlah : 0;
        const existing = await this.prisma.perencanaan_harian.findFirst({
            where: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                lpg_type: lpgType,
            },
        });
        if (existing) {
            return this.prisma.perencanaan_harian.update({
                where: { id: existing.id },
                data: {
                    jumlah_normal: kondisi === 'NORMAL' ? dto.jumlah : existing.jumlah_normal,
                    jumlah_fakultatif: kondisi === 'FAKULTATIF' ? dto.jumlah : existing.jumlah_fakultatif,
                    alokasi_bulan: dto.alokasi_bulan || existing.alokasi_bulan,
                },
            });
        }
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
    async bulkUpdate(dto) {
        const lpgType = dto.lpg_type || 'kg3';
        const results = [];
        for (const item of dto.data) {
            const itemKondisi = item.kondisi || dto.kondisi || 'NORMAL';
            const jumlahNormal = item.jumlah_normal !== undefined
                ? item.jumlah_normal
                : (itemKondisi === 'NORMAL' ? item.jumlah : 0);
            const jumlahFakultatif = item.jumlah_fakultatif !== undefined
                ? item.jumlah_fakultatif
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
            }
            else {
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
    async update(id, dto) {
        const existing = await this.prisma.perencanaan_harian.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Perencanaan tidak ditemukan');
        }
        const kondisi = dto.kondisi || 'NORMAL';
        const data = {};
        if (dto.jumlah !== undefined) {
            if (kondisi === 'NORMAL') {
                data.jumlah_normal = dto.jumlah;
            }
            else {
                data.jumlah_fakultatif = dto.jumlah;
            }
        }
        return this.prisma.perencanaan_harian.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.perencanaan_harian.delete({ where: { id } });
    }
    async autoGenerate(bulan, lpgType = 'kg3', kondisi = 'NORMAL', overwrite = false) {
        const startTime = Date.now();
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0));
        const pangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true },
            select: { id: true, name: true, alokasi_bulanan: true }
        });
        const daysInMonth = new Date(year, month, 0).getDate();
        let workDays = 0;
        const dayConfig = [];
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
        const recordsToInsert = [];
        let skipped = 0;
        for (const pangkalan of pangkalans) {
            if (!pangkalan.alokasi_bulanan || pangkalan.alokasi_bulanan <= 0) {
                skipped++;
                continue;
            }
            const dailyAlokasi = Math.round(pangkalan.alokasi_bulanan / workDays);
            const saturdayAlokasi = Math.round(dailyAlokasi * 0.5);
            for (const dayInfo of dayConfig) {
                if (dayInfo.isSunday)
                    continue;
                const tanggal = new Date(Date.UTC(year, month - 1, dayInfo.day, 12, 0, 0));
                const jumlah = dayInfo.isSaturday ? saturdayAlokasi : dailyAlokasi;
                recordsToInsert.push({
                    pangkalan_id: pangkalan.id,
                    tanggal,
                    jumlah_normal: kondisi === 'NORMAL' ? jumlah : 0,
                    jumlah_fakultatif: kondisi === 'FAKULTATIF' ? jumlah : 0,
                    lpg_type: lpgType,
                });
            }
        }
        const pangkalanIds = pangkalans.filter(p => p.alokasi_bulanan && p.alokasi_bulanan > 0).map(p => p.id);
        let deletedCount = 0;
        let createdCount = 0;
        if (overwrite && pangkalanIds.length > 0) {
            const deleteResult = await this.prisma.perencanaan_harian.deleteMany({
                where: {
                    pangkalan_id: { in: pangkalanIds },
                    tanggal: { gte: startDate, lte: endDate },
                    lpg_type: lpgType,
                }
            });
            deletedCount = deleteResult.count;
            const createResult = await this.prisma.perencanaan_harian.createMany({
                data: recordsToInsert,
            });
            createdCount = createResult.count;
        }
        else {
            try {
                const createResult = await this.prisma.perencanaan_harian.createMany({
                    data: recordsToInsert,
                    skipDuplicates: true,
                });
                createdCount = createResult.count;
            }
            catch (error) {
                for (const record of recordsToInsert) {
                    try {
                        await this.prisma.perencanaan_harian.create({ data: record });
                        createdCount++;
                    }
                    catch (e) {
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
};
exports.PerencanaanService = PerencanaanService;
exports.PerencanaanService = PerencanaanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], PerencanaanService);
//# sourceMappingURL=perencanaan.service.js.map