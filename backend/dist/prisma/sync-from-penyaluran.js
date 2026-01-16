"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function generateCode(prefix, num) {
    return `${prefix}${String(num).padStart(4, '0')}`;
}
const DEFAULT_PRICES = {
    'kg3': { cost: 14000, sell: 16000 },
    'kg5': { cost: 29000, sell: 32000 },
    'kg12': { cost: 135000, sell: 150000 },
    'kg50': { cost: 570000, sell: 610000 },
    'gr220': { cost: 12000, sell: 15000 },
};
async function main() {
    console.log('🔄 SYNC ALL DATA FROM PENYALURAN HARIAN\n');
    console.log('='.repeat(60));
    console.log('\n🗑️  Clearing existing generated data...');
    await prisma.pangkalan_stock_movements.deleteMany({});
    await prisma.consumer_orders.deleteMany({});
    console.log('   ✅ Cleared pangkalan_stock_movements and consumer_orders');
    const penyaluranData = await prisma.penyaluran_harian.findMany({
        include: { pangkalans: true },
        orderBy: { tanggal: 'asc' }
    });
    console.log(`\n📊 Found ${penyaluranData.length} penyaluran records`);
    const penerimaanData = await prisma.penerimaan_stok.findMany({
        orderBy: { tanggal: 'asc' }
    });
    console.log(`📊 Found ${penerimaanData.length} penerimaan records`);
    console.log('\n📥 Creating stock movements from penerimaan (MASUK)...');
    let masukCount = 0;
    const firstPangkalan = await prisma.pangkalans.findFirst({ where: { is_active: true } });
    if (firstPangkalan) {
        for (const penerimaan of penerimaanData) {
            let lpgType = 'kg3';
            if (penerimaan.nama_material.includes('3KG'))
                lpgType = 'kg3';
            else if (penerimaan.nama_material.includes('12KG'))
                lpgType = 'kg12';
            else if (penerimaan.nama_material.includes('50KG'))
                lpgType = 'kg50';
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
    console.log('\n📤 Creating stock movements & consumer orders from penyaluran (KELUAR)...');
    let keluarCount = 0;
    let consumerOrderCount = 0;
    const pangkalanGroups = new Map();
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
            if (totalQty <= 0)
                continue;
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
            const price = DEFAULT_PRICES[penyaluran.lpg_type] || DEFAULT_PRICES['kg3'];
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
    console.log('\n📊 Updating pangkalan_stocks based on movements...');
    const pangkalans = await prisma.pangkalans.findMany({ where: { is_active: true } });
    for (const pangkalan of pangkalans) {
        const movements = await prisma.pangkalan_stock_movements.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: { pangkalan_id: pangkalan.id },
            _sum: { qty: true }
        });
        const stockPerType = {};
        for (const m of movements) {
            const type = m.lpg_type;
            if (!stockPerType[type])
                stockPerType[type] = 0;
            if (m.movement_type === 'MASUK') {
                stockPerType[type] += m._sum.qty || 0;
            }
            else {
                stockPerType[type] -= m._sum.qty || 0;
            }
        }
        for (const [lpgType, qty] of Object.entries(stockPerType)) {
            const existingStock = await prisma.pangkalan_stocks.findFirst({
                where: { pangkalan_id: pangkalan.id, lpg_type: lpgType }
            });
            const finalQty = Math.max(0, qty);
            if (existingStock) {
                await prisma.pangkalan_stocks.update({
                    where: { id: existingStock.id },
                    data: { qty: finalQty, updated_at: new Date() }
                });
            }
            else {
                await prisma.pangkalan_stocks.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        lpg_type: lpgType,
                        qty: finalQty,
                        warning_level: 20,
                        critical_level: 10,
                    }
                });
            }
        }
    }
    console.log('   ✅ Updated pangkalan_stocks');
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
//# sourceMappingURL=sync-from-penyaluran.js.map