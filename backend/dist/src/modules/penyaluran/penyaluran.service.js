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
let PenyaluranService = class PenyaluranService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        const pangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true, deleted_at: null },
            select: { id: true, code: true, name: true, alokasi_bulanan: true },
            orderBy: { name: 'asc' },
        });
        const where = { tanggal: { gte: startDate, lte: endDate } };
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
            const dailyData = {};
            let totalNormal = 0;
            let totalFakultatif = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                dailyData[day] = 0;
            }
            const pangkalanData = penyaluran.filter(p => p.pangkalan_id === pangkalan.id);
            for (const p of pangkalanData) {
                const day = new Date(p.tanggal).getDate();
                dailyData[day] += p.jumlah;
                const kondisi = p.kondisi || 'NORMAL';
                if (kondisi === 'NORMAL') {
                    totalNormal += p.jumlah;
                }
                else {
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
    async create(dto) {
        const lpgType = dto.lpg_type || 'kg3';
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
    async bulkUpdate(dto) {
        const lpgType = dto.lpg_type || 'kg3';
        const operations = dto.data.map(item => this.prisma.penyaluran_harian.upsert({
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
        }));
        return this.prisma.client.$transaction(operations);
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
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], PenyaluranService);
//# sourceMappingURL=penyaluran.service.js.map