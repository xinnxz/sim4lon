import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePenerimaanDto, GetPenerimaanQueryDto } from './dto';
import { lpg_type } from '@prisma/client';

@Injectable()
export class PenerimaanService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: GetPenerimaanQueryDto) {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 25;
        const skip = (page - 1) * limit;

        const where: any = {};

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

    async create(dto: CreatePenerimaanDto) {
        // Use transaction to ensure both records are created atomically
        return this.prisma.client.$transaction(async (tx) => {
            // 1. Create penerimaan record
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

            // 2. Get product ID - use provided or find default (LPG 3kg Subsidi)
            let productId = dto.lpg_product_id;
            if (!productId) {
                const defaultProduct = await tx.lpg_products.findFirst({
                    where: { size_kg: 3, category: 'SUBSIDI', is_active: true, deleted_at: null },
                    select: { id: true },
                });
                productId = defaultProduct?.id;
            }

            // 3. Sync to stock_histories for accurate stock tracking
            // Now includes lpg_product_id for chart integration
            await tx.stock_histories.create({
                data: {
                    movement_type: 'MASUK',
                    qty: dto.qty_pcs,
                    note: `Penerimaan SPBE - SO: ${dto.no_so}, LO: ${dto.no_lo}`,
                    lpg_type: lpg_type.kg3, // Default 3kg for subsidi
                    lpg_product_id: productId || null, // Link to product for chart
                    timestamp: new Date(dto.tanggal),
                },
            });

            return penerimaan;
        });
    }

    async delete(id: string) {
        return this.prisma.penerimaan_stok.delete({ where: { id } });
    }

    /**
     * Get In-Out Agen summary (Stok Awal, Penerimaan, Penyaluran, Stok Akhir per day)
     */
    async getInOutAgen(bulan: string) {
        const [year, month] = bulan.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const daysInMonth = endDate.getDate();

        // Get penerimaan totals per day
        const penerimaan = await this.prisma.penerimaan_stok.groupBy({
            by: ['tanggal'],
            where: { tanggal: { gte: startDate, lte: endDate } },
            _sum: { qty_pcs: true },
        });

        // Get penyaluran totals per day
        const penyaluran = await this.prisma.penyaluran_harian.groupBy({
            by: ['tanggal'],
            where: { tanggal: { gte: startDate, lte: endDate } },
            _sum: { jumlah: true },
        });

        // Get initial stock (sum of all penerimaan before this month - sum of all penyaluran before this month)
        const [prevPenerimaan, prevPenyaluran] = await Promise.all([
            this.prisma.penerimaan_stok.aggregate({
                where: { tanggal: { lt: startDate } },
                _sum: { qty_pcs: true },
            }),
            this.prisma.penyaluran_harian.aggregate({
                where: { tanggal: { lt: startDate } },
                _sum: { jumlah: true },
            }),
        ]);

        const initialStock = (prevPenerimaan._sum.qty_pcs || 0) - (prevPenyaluran._sum.jumlah || 0);

        // Build daily data
        const dailyData: Record<number, { stok_awal: number; penerimaan: number; penyaluran: number; stok_akhir: number }> = {};
        let runningStock = initialStock;

        for (let day = 1; day <= daysInMonth; day++) {
            const penerimaanDay = penerimaan.find(p => new Date(p.tanggal).getDate() === day);
            const penyaluranDay = penyaluran.find(p => new Date(p.tanggal).getDate() === day);

            const penerimaanQty = penerimaanDay?._sum.qty_pcs || 0;
            const penyaluranQty = penyaluranDay?._sum.jumlah || 0;

            dailyData[day] = {
                stok_awal: runningStock,
                penerimaan: penerimaanQty,
                penyaluran: penyaluranQty,
                stok_akhir: runningStock + penerimaanQty - penyaluranQty,
            };

            runningStock = dailyData[day].stok_akhir;
        }

        // Calculate totals
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
}
