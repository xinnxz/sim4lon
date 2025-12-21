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
exports.PenerimaanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
const client_1 = require("@prisma/client");
const activity_service_1 = require("../activity/activity.service");
let PenerimaanService = class PenerimaanService {
    prisma;
    activityService;
    constructor(prisma, activityService) {
        this.prisma = prisma;
        this.activityService = activityService;
    }
    async findAll(query) {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 25;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.sumber) {
            where.sumber = query.sumber;
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
        const [data, total] = await Promise.all([
            this.prisma.penerimaan_stok.findMany({
                where,
                skip,
                take: limit,
                orderBy: { tanggal: 'desc' },
            }),
            this.prisma.penerimaan_stok.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async create(dto) {
        const result = await this.prisma.client.$transaction(async (tx) => {
            const penerimaan = await tx.penerimaan_stok.create({
                data: {
                    no_so: dto.no_so,
                    no_lo: dto.no_lo,
                    nama_material: dto.nama_material,
                    qty_pcs: dto.qty_pcs,
                    qty_kg: dto.qty_kg,
                    tanggal: new Date(dto.tanggal),
                    sumber: dto.sumber,
                },
            });
            let productId = dto.lpg_product_id;
            if (!productId) {
                const defaultProduct = await tx.lpg_products.findFirst({
                    where: { size_kg: 3, category: 'SUBSIDI', is_active: true, deleted_at: null },
                    select: { id: true },
                });
                productId = defaultProduct?.id;
            }
            await tx.stock_histories.create({
                data: {
                    movement_type: 'MASUK',
                    qty: dto.qty_pcs,
                    note: `Penerimaan SPBE - SO: ${dto.no_so}, LO: ${dto.no_lo}`,
                    lpg_type: client_1.lpg_type.kg3,
                    lpg_product_id: productId || null,
                    timestamp: new Date(dto.tanggal),
                },
            });
            return penerimaan;
        });
        await this.activityService.logActivity('stock_in', 'Stok Masuk', {
            description: `Penerimaan ${dto.qty_pcs} tabung ${dto.nama_material} dari ${dto.sumber}`,
            detailNumeric: dto.qty_pcs,
        });
        return result;
    }
    async delete(id) {
        return this.prisma.penerimaan_stok.delete({ where: { id } });
    }
    async getInOutAgen(bulan) {
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const daysInMonth = endDate.getDate();
        const penerimaan = await this.prisma.penerimaan_stok.groupBy({
            by: ['tanggal'],
            where: { tanggal: { gte: startDate, lte: endDate } },
            _sum: { qty_pcs: true },
        });
        const penyaluran = await this.prisma.penyaluran_harian.groupBy({
            by: ['tanggal'],
            where: { tanggal: { gte: startDate, lte: endDate } },
            _sum: { jumlah_normal: true, jumlah_fakultatif: true },
        });
        const [prevPenerimaan, prevPenyaluran] = await Promise.all([
            this.prisma.penerimaan_stok.aggregate({
                where: { tanggal: { lt: startDate } },
                _sum: { qty_pcs: true },
            }),
            this.prisma.penyaluran_harian.aggregate({
                where: { tanggal: { lt: startDate } },
                _sum: { jumlah_normal: true, jumlah_fakultatif: true },
            }),
        ]);
        const prevPenyaluranTotal = (prevPenyaluran._sum?.jumlah_normal || 0) + (prevPenyaluran._sum?.jumlah_fakultatif || 0);
        const initialStock = (prevPenerimaan._sum.qty_pcs || 0) - prevPenyaluranTotal;
        const dailyData = {};
        let runningStock = initialStock;
        for (let day = 1; day <= daysInMonth; day++) {
            const penerimaanDay = penerimaan.find(p => new Date(p.tanggal).getDate() === day);
            const penyaluranDay = penyaluran.find(p => new Date(p.tanggal).getDate() === day);
            const penerimaanQty = penerimaanDay?._sum.qty_pcs || 0;
            const penyaluranQty = (penyaluranDay?._sum?.jumlah_normal || 0) + (penyaluranDay?._sum?.jumlah_fakultatif || 0);
            dailyData[day] = {
                stok_awal: runningStock,
                penerimaan: penerimaanQty,
                penyaluran: penyaluranQty,
                stok_akhir: runningStock + penerimaanQty - penyaluranQty,
            };
            runningStock = dailyData[day].stok_akhir;
        }
        const totalPenerimaan = Object.values(dailyData).reduce((sum, d) => sum + d.penerimaan, 0);
        const totalPenyaluran = Object.values(dailyData).reduce((sum, d) => sum + d.penyaluran, 0);
        return {
            bulan,
            days_in_month: daysInMonth,
            stok_awal_bulan: initialStock,
            stok_akhir_bulan: runningStock,
            total_penerimaan: totalPenerimaan,
            total_penyaluran: totalPenyaluran,
            daily: dailyData,
        };
    }
};
exports.PenerimaanService = PenerimaanService;
exports.PenerimaanService = PenerimaanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        activity_service_1.ActivityService])
], PenerimaanService);
//# sourceMappingURL=penerimaan.service.js.map