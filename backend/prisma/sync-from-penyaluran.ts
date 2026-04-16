/**
 * SYNC ALL PANGKALAN DATA FROM PENYALURAN HARIAN
 * 
 * Script untuk menyinkronkan SEMUA data pangkalan dari penyaluran_harian:
 * 1. pangkalan_stock_movements (MASUK dari penerimaan, KELUAR dari penyaluran)
 * 2. consumer_orders (penjualan ke konsumen berdasarkan penyaluran)
 * 3. pangkalan_stocks (stok akhir = masuk - keluar)
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/sync-from-penyaluran.ts
 */

import { PrismaClient, lpg_type } from '@prisma/client';

const prisma = new PrismaClient();

// Helper untuk generate kode
function generateCode(prefix: string, num: number): string {
    return `${prefix}${String(num).padStart(4, '0')}`;
}

// Harga default per lpg_type
const DEFAULT_PRICES: Record<string, { cost: number; sell: number }> = {
    'kg3': { cost: 14000, sell: 16000 },
    'kg5': { cost: 29000, sell: 32000 },
    'kg12': { cost: 135000, sell: 150000 },
    'kg50': { cost: 570000, sell: 610000 },
    'gr220': { cost: 12000, sell: 15000 },
};

async function main() {
    console.log('🔄 SYNC ALL DATA FROM PENYALURAN HARIAN\n');
    console.log('='.repeat(60));

    // Step 1: Clear existing data yang akan di-generate ulang
    console.log('\n🗑️  Clearing existing generated data...');
    await prisma.pangkalan_stock_movements.deleteMany({});
    await prisma.consumer_orders.deleteMany({});
    console.log('   ✅ Cleared pangkalan_stock_movements and consumer_orders');

    // Step 2: Get all penyaluran_harian data
    const penyaluranData = await prisma.penyaluran_harian.findMany({
        include: { pangkalans: true },
        orderBy: { tanggal: 'asc' }
    });

    console.log(`\n📊 Found ${penyaluranData.length} penyaluran records`);

    // Step 3: Get penerimaan_stok data (stock IN from SPBE)
    const penerimaanData = await prisma.penerimaan_stok.findMany({
        orderBy: { tanggal: 'asc' }
    });

    console.log(`📊 Found ${penerimaanData.length} penerimaan records`);

    // Step 4: Create stock movements from penerimaan (MASUK to agen stock)
    console.log('\n📥 Creating stock movements from penerimaan (MASUK)...');
    let masukCount = 0;

    // Get first pangkalan for agen-level stock movements
    const firstPangkalan = await prisma.pangkalans.findFirst({ where: { is_active: true } });

    if (firstPangkalan) {
        for (const penerimaan of penerimaanData) {
            // Determine LPG type from material name
            let lpgType: lpg_type = 'kg3';
            if (penerimaan.nama_material.includes('3KG')) lpgType = 'kg3';
            else if (penerimaan.nama_material.includes('12KG')) lpgType = 'kg12';
            else if (penerimaan.nama_material.includes('50KG')) lpgType = 'kg50';

            await prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: firstPangkalan.id,
                    lpg_type: lpgType,
                    movement_type: 'MASUK',
                    qty: penerimaan.qty_pcs,
                    source: 'PENERIMAAN_SPBE',
                    reference_id: penerimaan.id,
                    note: `Penerimaan SO: ${penerimaan.no_so}, LO: ${penerimaan.no_lo}`,
                    movement_date: penerimaan.tanggal,
                }
            });
            masukCount++;
        }
        console.log(`   ✅ Created ${masukCount} MASUK movements from penerimaan`);
    }

    // Step 5: Create stock movements and consumer_orders from penyaluran
    console.log('\n📤 Creating stock movements & consumer orders from penyaluran (KELUAR)...');
    let keluarCount = 0;
    let consumerOrderCount = 0;

    // Group penyaluran by pangkalan for processing
    const pangkalanGroups = new Map<string, typeof penyaluranData>();
    for (const p of penyaluranData) {
        const existing = pangkalanGroups.get(p.pangkalan_id) || [];
        existing.push(p);
        pangkalanGroups.set(p.pangkalan_id, existing);
    }

    for (const [pangkalanId, penyaluranList] of pangkalanGroups) {
        const pangkalan = penyaluranList[0].pangkalans;
        console.log(`\n   📦 Pangkalan: ${pangkalan.name}`);

        for (const penyaluran of penyaluranList) {
            const totalQty = penyaluran.jumlah_normal + penyaluran.jumlah_fakultatif;

            if (totalQty <= 0) continue;

            // Create stock movement (MASUK to Pangkalan from Agen)
            await prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pangkalanId,
                    lpg_type: penyaluran.lpg_type,
                    movement_type: 'MASUK',
                    qty: totalQty,
                    source: 'PENYALURAN_AGEN',
                    note: `Penyaluran ${penyaluran.tanggal.toISOString().split('T')[0]} (${penyaluran.tipe_pembayaran})`,
                    movement_date: penyaluran.tanggal,
                }
            });
            keluarCount++;

            // Create consumer_orders (simulating sales to end consumers)
            // Split into multiple smaller orders to simulate real sales
            const price = DEFAULT_PRICES[penyaluran.lpg_type] || DEFAULT_PRICES['kg3'];

            // Create 1-3 consumer orders per penyaluran
            const orderCount = Math.min(3, Math.ceil(totalQty / 10));
            let remainingQty = totalQty;

            for (let i = 0; i < orderCount && remainingQty > 0; i++) {
                const orderQty = i === orderCount - 1 ? remainingQty : Math.ceil(remainingQty / (orderCount - i));
                remainingQty -= orderQty;

                const consumerNames = [
                    'Warung Berkah', 'Bu Siti', 'Pak Ahmad', 'Warung Maju',
                    'Ibu Dewi', 'Pak Budi', 'Warung Jaya', 'Bu Ani',
                    'Pak Hasan', 'Warung Makmur'
                ];

                await prisma.consumer_orders.create({
                    data: {
                        code: generateCode('PORD-', consumerOrderCount + 1),
                        pangkalan_id: pangkalanId,
                        consumer_name: consumerNames[consumerOrderCount % consumerNames.length],
                        lpg_type: penyaluran.lpg_type,
                        qty: orderQty,
                        price_per_unit: price.sell,
                        cost_price: price.cost,
                        total_amount: orderQty * price.sell,
                        payment_status: 'LUNAS',
                        sale_date: penyaluran.tanggal,
                    }
                });
                consumerOrderCount++;

                // Create KELUAR movement for the sale
                await prisma.pangkalan_stock_movements.create({
                    data: {
                        pangkalan_id: pangkalanId,
                        lpg_type: penyaluran.lpg_type,
                        movement_type: 'KELUAR',
                        qty: orderQty,
                        source: 'PENJUALAN_KONSUMEN',
                        note: `Penjualan ke ${consumerNames[consumerOrderCount % consumerNames.length]}`,
                        movement_date: penyaluran.tanggal,
                    }
                });
            }
        }
    }

    console.log(`\n   ✅ Created ${keluarCount} MASUK movements (from agen to pangkalan)`);
    console.log(`   ✅ Created ${consumerOrderCount} consumer_orders`);

    // Step 6: Update pangkalan_stocks based on movements
    console.log('\n📊 Updating pangkalan_stocks based on movements...');

    const pangkalans = await prisma.pangkalans.findMany({ where: { is_active: true } });

    for (const pangkalan of pangkalans) {
        // Calculate stock per lpg_type
        const movements = await prisma.pangkalan_stock_movements.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: { pangkalan_id: pangkalan.id },
            _sum: { qty: true }
        });

        // Calculate net stock per type
        const stockPerType: Record<string, number> = {};
        for (const m of movements) {
            const type = m.lpg_type;
            if (!stockPerType[type]) stockPerType[type] = 0;

            if (m.movement_type === 'MASUK') {
                stockPerType[type] += m._sum.qty || 0;
            } else {
                stockPerType[type] -= m._sum.qty || 0;
            }
        }

        // Update/create pangkalan_stocks
        for (const [lpgType, qty] of Object.entries(stockPerType)) {
            const existingStock = await prisma.pangkalan_stocks.findFirst({
                where: { pangkalan_id: pangkalan.id, lpg_type: lpgType as lpg_type }
            });

            const finalQty = Math.max(0, qty);

            if (existingStock) {
                await prisma.pangkalan_stocks.update({
                    where: { id: existingStock.id },
                    data: { qty: finalQty, updated_at: new Date() }
                });
            } else {
                await prisma.pangkalan_stocks.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        lpg_type: lpgType as lpg_type,
                        qty: finalQty,
                        warning_level: 20,
                        critical_level: 10,
                    }
                });
            }
        }
    }

    console.log('   ✅ Updated pangkalan_stocks');

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ SYNC COMPLETE!\n');

    const finalMovements = await prisma.pangkalan_stock_movements.count();
    const finalConsumerOrders = await prisma.consumer_orders.count();
    const finalStocks = await prisma.pangkalan_stocks.findMany();

    console.log('📊 FINAL COUNTS:');
    console.log(`   pangkalan_stock_movements: ${finalMovements}`);
    console.log(`   consumer_orders: ${finalConsumerOrders}`);
    console.log(`   pangkalan_stocks: ${finalStocks.length}`);

    console.log('\n💰 STOCK SUMMARY:');
    const stockSummary = await prisma.pangkalan_stocks.groupBy({
        by: ['lpg_type'],
        _sum: { qty: true }
    });
    for (const s of stockSummary) {
        console.log(`   ${s.lpg_type}: ${s._sum.qty} unit`);
    }
}

main()
    .catch(e => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
