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
        if (query.kondisi) {
            where.kondisi = query.kondisi;
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
    async getRekapitulasi(bulan, kondisi) {
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const daysInMonth = endDate.getDate();
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
            tanggal: { gte: startDate, lte: endDate },
        };
        if (kondisi) {
            where.kondisi = kondisi;
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
                const day = new Date(p.tanggal).getDate();
                dailyData[day] = p.jumlah;
                if (p.kondisi === 'NORMAL') {
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
        return {
            bulan,
            days_in_month: daysInMonth,
            data: result,
        };
    }
    async create(dto) {
        return this.prisma.perencanaan_harian.upsert({
            where: {
                pangkalan_id_tanggal: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(dto.tanggal),
                },
            },
            update: {
                jumlah: dto.jumlah,
                kondisi: (dto.kondisi || 'NORMAL'),
                alokasi_bulan: dto.alokasi_bulan || 0,
            },
            create: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(dto.tanggal),
                jumlah: dto.jumlah,
                kondisi: (dto.kondisi || 'NORMAL'),
                alokasi_bulan: dto.alokasi_bulan || 0,
            },
        });
    }
    async bulkUpdate(dto) {
        const operations = dto.data.map(item => this.prisma.perencanaan_harian.upsert({
            where: {
                pangkalan_id_tanggal: {
                    pangkalan_id: dto.pangkalan_id,
                    tanggal: new Date(item.tanggal),
                },
            },
            update: {
                jumlah: item.jumlah,
                kondisi: (dto.kondisi || 'NORMAL'),
            },
            create: {
                pangkalan_id: dto.pangkalan_id,
                tanggal: new Date(item.tanggal),
                jumlah: item.jumlah,
                kondisi: (dto.kondisi || 'NORMAL'),
            },
        }));
        return this.prisma.client.$transaction(operations);
    }
    async update(id, dto) {
        const existing = await this.prisma.perencanaan_harian.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Perencanaan tidak ditemukan');
        }
        return this.prisma.perencanaan_harian.update({
            where: { id },
            data: {
                ...(dto.jumlah !== undefined && { jumlah: dto.jumlah }),
                ...(dto.kondisi && { kondisi: dto.kondisi }),
            },
        });
    }
    async delete(id) {
        return this.prisma.perencanaan_harian.delete({ where: { id } });
    }
};
exports.PerencanaanService = PerencanaanService;
exports.PerencanaanService = PerencanaanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], PerencanaanService);
//# sourceMappingURL=perencanaan.service.js.map