import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePenerimaanDto, GetPenerimaanQueryDto } from './dto';
import { lpg_type } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class PenerimaanService {
    constructor(
        private prisma: PrismaService,
        private activityService: ActivityService,
    ) { }

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
            // Set endDate to end of last day of month (23:59:59.999)
            const lastDayOfMonth = new Date(year, month, 0);
            const endDate = new Date(lastDayOfMonth);
            endDate.setHours(23, 59, 59, 999);
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
                orderBy: [
                    { tanggal: 'desc' },
                    { created_at: 'desc' }  // Secondary sort: newest entries first
                ],
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
        const result = await this.prisma.client.$transaction(async (tx) => {
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

            // 2. Detect lpg_type from nama_material
            const detectedLpgType = this.detectLpgTypeFromMaterial(dto.nama_material);

            // 3. Get product ID - use provided, or find matching product by size
            let productId = dto.lpg_product_id;
            if (!productId) {
                // Find product matching the detected LPG type
                const sizeMap: Record<string, number> = {
                    'kg3': 3, 'kg5': 5.5, 'kg12': 12, 'kg50': 50, 'gr220': 0.22
                };
                const targetSize = sizeMap[detectedLpgType] || 3;

                const matchingProduct = await tx.lpg_products.findFirst({
                    where: {
                        size_kg: { gte: targetSize - 0.5, lte: targetSize + 0.5 },
                        is_active: true,
                        deleted_at: null
                    },
                    select: { id: true },
                });
                productId = matchingProduct?.id;
            }

            // 4. Sync to stock_histories for accurate stock tracking
            await tx.stock_histories.create({
                data: {
                    movement_type: 'MASUK',
                    qty: dto.qty_pcs,
                    note: `Penerimaan SPBE - SO: ${dto.no_so}, LO: ${dto.no_lo}`,
                    lpg_type: detectedLpgType, // Use detected type, not hardcoded!
                    lpg_product_id: productId || null,
                    timestamp: new Date(dto.tanggal),
                },
            });

            return penerimaan;
        });

        // Log stock_in activity
        await this.activityService.logActivity('stock_in', 'Stok Masuk', {
            description: `Penerimaan ${dto.qty_pcs} tabung ${dto.nama_material} dari ${dto.sumber}`,
            detailNumeric: dto.qty_pcs,
        });

        return result;
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

        // Get penyaluran totals per day (sum both normal + fakultatif)
        const penyaluran = await this.prisma.penyaluran_harian.groupBy({
            by: ['tanggal'],
            where: { tanggal: { gte: startDate, lte: endDate } },
            _sum: { jumlah_normal: true, jumlah_fakultatif: true },
        });

        // Get initial stock (sum of all penerimaan before this month - sum of all penyaluran before this month)
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

        // Build daily data
        const dailyData: Record<number, { stok_awal: number; penerimaan: number; penyaluran: number; stok_akhir: number }> = {};
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

    /**
     * Detect LPG type from material name
     * Examples:
     * - "REFILL/ISI LPG @3KG (NET)" → kg3
     * - "REFILL/ISI LPG @12KG (NET)" → kg12
     * - "REFILL/ISI LPG @50KG (NET)" → kg50
     * - "REFILL/ISI LPG @5.5KG (NET)" → kg5
     * - "REFILL/ISI LPG @220GR (NET)" → gr220
     */
    private detectLpgTypeFromMaterial(namaMaterial: string): lpg_type {
        const upper = namaMaterial.toUpperCase();

        // Check for specific sizes in the material name
        if (upper.includes('50KG') || upper.includes('50 KG')) {
            return lpg_type.kg50;
        }
        if (upper.includes('12KG') || upper.includes('12 KG')) {
            return lpg_type.kg12;
        }
        if (upper.includes('5.5KG') || upper.includes('5,5KG') || upper.includes('5.5 KG')) {
            return lpg_type.kg5;
        }
        if (upper.includes('3KG') || upper.includes('3 KG')) {
            return lpg_type.kg3;
        }
        if (upper.includes('220GR') || upper.includes('220 GR') || upper.includes('220G')) {
            return lpg_type.gr220;
        }

        // Default to 3kg if nothing detected (most common subsidi type)
        return lpg_type.kg3;
    }
}
