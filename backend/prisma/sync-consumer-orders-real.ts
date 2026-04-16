/**
 * SYNC CONSUMER ORDERS WITH REAL CONSUMER DATA
 * 
 * Script ini akan:
 * 1. Menghapus consumer_orders yang ada untuk 8 pangkalan target
 * 2. Membuat consumer_orders baru menggunakan data konsumen REAL dari database
 * 3. Update harga sesuai ketentuan: 3kg (beli: 16.000, jual: 20.000)
 * 4. Update pangkalan_stock_movements sesuai
 * 5. Update pangkalan_stocks
 * 
 * HARGA LPG:
 * - 3kg: Beli 16.000 | Jual 20.000
 * - 5kg: Beli 29.000 | Jual 32.000
 * - 12kg: Beli 135.000 | Jual 150.000
 * - 50kg: Beli 570.000 | Jual 610.000
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/sync-consumer-orders-real.ts
 */

import { PrismaClient, lpg_type } from '@prisma/client';

const prisma = new PrismaClient();

// Target 8 pangkalans
const TARGET_PANGKALAN_CODES = [
    '343269997904002',  // AGUS
    '343262997904008',  // ASEP
    '343262997904002',  // DANG DANG
    '343262997904006',  // HERMAWAN SUTISNA
    '343269997904001',  // M. DIAN SUTISNA
    '343291199904001',  // MIMAH SITI ROHMAH
    '343262997904009',  // NAZRIL MUHAMMAD ILHAM
    '3432629979044010', // PANGKALAN REON (testing)
];

// Harga LPG (sesuai permintaan: 3kg beli 16000, jual 20000)
const LPG_PRICES: Record<string, { cost: number; sell: number }> = {
    'kg3': { cost: 16000, sell: 20000 },    // Updated!
    'kg5': { cost: 29000, sell: 32000 },
    'kg12': { cost: 135000, sell: 150000 },
    'kg50': { cost: 570000, sell: 610000 },
    'gr220': { cost: 12000, sell: 15000 },
};

// Helper untuk generate kode
function generateCode(prefix: string, num: number): string {
    return `${prefix}${String(num).padStart(4, '0')}`;
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║    SYNC CONSUMER ORDERS WITH REAL CONSUMER DATA            ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Harga 3kg: Beli Rp 16.000 | Jual Rp 20.000                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Step 1: Get target pangkalans
    const pangkalans = await prisma.pangkalans.findMany({
        where: {
            code: { in: TARGET_PANGKALAN_CODES },
            is_active: true
        },
        orderBy: { name: 'asc' },
    });

    console.log(`📦 Target: ${pangkalans.length} pangkalans\n`);

    // Step 2: Clear existing consumer_orders and stock_movements
    console.log('🗑️  Membersihkan data lama...');
    for (const pk of pangkalans) {
        await prisma.consumer_orders.deleteMany({ where: { pangkalan_id: pk.id } });
        await prisma.pangkalan_stock_movements.deleteMany({
            where: {
                pangkalan_id: pk.id,
                source: 'PENJUALAN_KONSUMEN'
            }
        });
    }
    console.log('   ✅ Data consumer_orders & movements dibersihkan\n');

    // Step 3: Update lpg_prices for each pangkalan
    console.log('💰 Mengupdate harga per pangkalan...');
    for (const pk of pangkalans) {
        for (const [lpgType, prices] of Object.entries(LPG_PRICES)) {
            const existingPrice = await prisma.lpg_prices.findFirst({
                where: { pangkalan_id: pk.id, lpg_type: lpgType as lpg_type }
            });

            if (existingPrice) {
                await prisma.lpg_prices.update({
                    where: { id: existingPrice.id },
                    data: {
                        cost_price: prices.cost,
                        selling_price: prices.sell,
                        updated_at: new Date()
                    }
                });
            } else {
                await prisma.lpg_prices.create({
                    data: {
                        pangkalan_id: pk.id,
                        lpg_type: lpgType as lpg_type,
                        cost_price: prices.cost,
                        selling_price: prices.sell,
                        is_active: true,
                    }
                });
            }
        }
    }
    console.log('   ✅ Harga diupdate (3kg: 16.000/20.000)\n');

    // Step 4: Get penyaluran data untuk distribusi
    const penyaluranData = await prisma.penyaluran_harian.findMany({
        where: {
            pangkalan_id: { in: pangkalans.map(p => p.id) }
        },
        include: { pangkalans: true },
        orderBy: { tanggal: 'asc' }
    });

    console.log(`📊 Data penyaluran: ${penyaluranData.length} records\n`);

    // Step 5: Create consumer_orders using REAL consumers
    console.log('📝 Membuat consumer_orders dengan data konsumen REAL...\n');

    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    // Group penyaluran by pangkalan
    const penyaluranByPangkalan = new Map<string, typeof penyaluranData>();
    for (const p of penyaluranData) {
        const existing = penyaluranByPangkalan.get(p.pangkalan_id) || [];
        existing.push(p);
        penyaluranByPangkalan.set(p.pangkalan_id, existing);
    }

    for (const pangkalan of pangkalans) {
        console.log(`\n━━━ ${pangkalan.name} ━━━`);

        // Get real consumers for this pangkalan
        const consumers = await prisma.consumers.findMany({
            where: { pangkalan_id: pangkalan.id, is_active: true }
        });

        if (consumers.length === 0) {
            console.log('   ⚠️  Tidak ada konsumen, skip...');
            continue;
        }

        console.log(`   👥 ${consumers.length} konsumen tersedia`);

        // Get penyaluran for this pangkalan
        const penyaluranList = penyaluranByPangkalan.get(pangkalan.id) || [];

        if (penyaluranList.length === 0) {
            console.log('   ⚠️  Tidak ada penyaluran, skip...');
            continue;
        }

        let pangkalanOrders = 0;

        for (const penyaluran of penyaluranList) {
            const totalQty = penyaluran.jumlah_normal + penyaluran.jumlah_fakultatif;
            if (totalQty <= 0) continue;

            const prices = LPG_PRICES[penyaluran.lpg_type] || LPG_PRICES['kg3'];

            // Distribute sales to random consumers
            let remainingQty = totalQty;
            const usedConsumers = new Set<string>();

            while (remainingQty > 0) {
                // Pick a random consumer (avoid repeat if possible)
                let consumer;
                if (usedConsumers.size < consumers.length) {
                    const availableConsumers = consumers.filter(c => !usedConsumers.has(c.id));
                    consumer = availableConsumers[Math.floor(Math.random() * availableConsumers.length)];
                } else {
                    consumer = consumers[Math.floor(Math.random() * consumers.length)];
                }
                usedConsumers.add(consumer.id);

                // Random qty (1-5 for rumah tangga, 3-10 for warung)
                const maxQty = consumer.consumer_type === 'WARUNG' ? 10 : 5;
                const minQty = consumer.consumer_type === 'WARUNG' ? 3 : 1;
                const orderQty = Math.min(
                    remainingQty,
                    minQty + Math.floor(Math.random() * (maxQty - minQty + 1))
                );

                remainingQty -= orderQty;

                const orderTotal = orderQty * prices.sell;
                const orderProfit = orderQty * (prices.sell - prices.cost);

                // Create consumer_order with REAL consumer
                await prisma.consumer_orders.create({
                    data: {
                        code: generateCode('PORD-', totalOrders + 1),
                        pangkalan_id: pangkalan.id,
                        consumer_id: consumer.id,  // REAL consumer ID!
                        consumer_name: consumer.name,
                        lpg_type: penyaluran.lpg_type,
                        qty: orderQty,
                        price_per_unit: prices.sell,
                        cost_price: prices.cost,
                        total_amount: orderTotal,
                        payment_status: 'LUNAS',
                        sale_date: penyaluran.tanggal,
                    }
                });

                // Create stock movement
                await prisma.pangkalan_stock_movements.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        lpg_type: penyaluran.lpg_type,
                        movement_type: 'KELUAR',
                        qty: orderQty,
                        source: 'PENJUALAN_KONSUMEN',
                        note: `Penjualan ke ${consumer.name}`,
                        movement_date: penyaluran.tanggal,
                    }
                });

                totalOrders++;
                pangkalanOrders++;
                totalRevenue += orderTotal;
                totalProfit += orderProfit;
            }
        }

        console.log(`   ✅ ${pangkalanOrders} orders dibuat`);
    }

    // Step 6: Update pangkalan_stocks
    console.log('\n📊 Mengupdate stok pangkalan...');
    for (const pangkalan of pangkalans) {
        const movements = await prisma.pangkalan_stock_movements.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: { pangkalan_id: pangkalan.id },
            _sum: { qty: true }
        });

        const stockPerType: Record<string, number> = {};
        for (const m of movements) {
            if (!stockPerType[m.lpg_type]) stockPerType[m.lpg_type] = 0;
            stockPerType[m.lpg_type] += m.movement_type === 'MASUK'
                ? (m._sum.qty || 0)
                : -(m._sum.qty || 0);
        }

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
    console.log('   ✅ Stok diupdate berdasarkan movements\n');

    // Final Summary
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                      HASIL AKHIR                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n📊 STATISTIK:`);
    console.log(`   Total Orders    : ${totalOrders.toLocaleString('id-ID')}`);
    console.log(`   Total Revenue   : Rp ${totalRevenue.toLocaleString('id-ID')}`);
    console.log(`   Total Profit    : Rp ${totalProfit.toLocaleString('id-ID')}`);
    console.log(`   Margin 3kg      : Rp ${(20000 - 16000).toLocaleString('id-ID')}/unit`);

    // Verify
    const orderCount = await prisma.consumer_orders.count();
    const movementCount = await prisma.pangkalan_stock_movements.count();

    console.log(`\n📦 DATABASE:`);
    console.log(`   consumer_orders : ${orderCount}`);
    console.log(`   stock_movements : ${movementCount}`);

    console.log('\n✅ SYNC COMPLETE!\n');
}

main()
    .catch(e => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
