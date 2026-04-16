"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const TARGET_PANGKALAN_CODES = [
    '343269997904002',
    '343262997904008',
    '343262997904002',
    '343262997904006',
    '343269997904001',
    '343291199904001',
    '343262997904009',
    '3432629979044010',
];
const LPG_PRICES = {
    'kg3': { cost: 16000, sell: 20000 },
    'kg5': { cost: 29000, sell: 32000 },
    'kg12': { cost: 135000, sell: 150000 },
    'kg50': { cost: 570000, sell: 610000 },
    'gr220': { cost: 12000, sell: 15000 },
};
function generateCode(prefix, num) {
    return `${prefix}${String(num).padStart(4, '0')}`;
}
async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║    SYNC CONSUMER ORDERS WITH REAL CONSUMER DATA            ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Harga 3kg: Beli Rp 16.000 | Jual Rp 20.000                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    const pangkalans = await prisma.pangkalans.findMany({
        where: {
            code: { in: TARGET_PANGKALAN_CODES },
            is_active: true
        },
        orderBy: { name: 'asc' },
    });
    console.log(`📦 Target: ${pangkalans.length} pangkalans\n`);
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
    console.log('💰 Mengupdate harga per pangkalan...');
    for (const pk of pangkalans) {
        for (const [lpgType, prices] of Object.entries(LPG_PRICES)) {
            const existingPrice = await prisma.lpg_prices.findFirst({
                where: { pangkalan_id: pk.id, lpg_type: lpgType }
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
            }
            else {
                await prisma.lpg_prices.create({
                    data: {
                        pangkalan_id: pk.id,
                        lpg_type: lpgType,
                        cost_price: prices.cost,
                        selling_price: prices.sell,
                        is_active: true,
                    }
                });
            }
        }
    }
    console.log('   ✅ Harga diupdate (3kg: 16.000/20.000)\n');
    const penyaluranData = await prisma.penyaluran_harian.findMany({
        where: {
            pangkalan_id: { in: pangkalans.map(p => p.id) }
        },
        include: { pangkalans: true },
        orderBy: { tanggal: 'asc' }
    });
    console.log(`📊 Data penyaluran: ${penyaluranData.length} records\n`);
    console.log('📝 Membuat consumer_orders dengan data konsumen REAL...\n');
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProfit = 0;
    const penyaluranByPangkalan = new Map();
    for (const p of penyaluranData) {
        const existing = penyaluranByPangkalan.get(p.pangkalan_id) || [];
        existing.push(p);
        penyaluranByPangkalan.set(p.pangkalan_id, existing);
    }
    for (const pangkalan of pangkalans) {
        console.log(`\n━━━ ${pangkalan.name} ━━━`);
        const consumers = await prisma.consumers.findMany({
            where: { pangkalan_id: pangkalan.id, is_active: true }
        });
        if (consumers.length === 0) {
            console.log('   ⚠️  Tidak ada konsumen, skip...');
            continue;
        }
        console.log(`   👥 ${consumers.length} konsumen tersedia`);
        const penyaluranList = penyaluranByPangkalan.get(pangkalan.id) || [];
        if (penyaluranList.length === 0) {
            console.log('   ⚠️  Tidak ada penyaluran, skip...');
            continue;
        }
        let pangkalanOrders = 0;
        for (const penyaluran of penyaluranList) {
            const totalQty = penyaluran.jumlah_normal + penyaluran.jumlah_fakultatif;
            if (totalQty <= 0)
                continue;
            const prices = LPG_PRICES[penyaluran.lpg_type] || LPG_PRICES['kg3'];
            let remainingQty = totalQty;
            const usedConsumers = new Set();
            while (remainingQty > 0) {
                let consumer;
                if (usedConsumers.size < consumers.length) {
                    const availableConsumers = consumers.filter(c => !usedConsumers.has(c.id));
                    consumer = availableConsumers[Math.floor(Math.random() * availableConsumers.length)];
                }
                else {
                    consumer = consumers[Math.floor(Math.random() * consumers.length)];
                }
                usedConsumers.add(consumer.id);
                const maxQty = consumer.consumer_type === 'WARUNG' ? 10 : 5;
                const minQty = consumer.consumer_type === 'WARUNG' ? 3 : 1;
                const orderQty = Math.min(remainingQty, minQty + Math.floor(Math.random() * (maxQty - minQty + 1)));
                remainingQty -= orderQty;
                const orderTotal = orderQty * prices.sell;
                const orderProfit = orderQty * (prices.sell - prices.cost);
                await prisma.consumer_orders.create({
                    data: {
                        code: generateCode('PORD-', totalOrders + 1),
                        pangkalan_id: pangkalan.id,
                        consumer_id: consumer.id,
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
    console.log('\n📊 Mengupdate stok pangkalan...');
    for (const pangkalan of pangkalans) {
        const movements = await prisma.pangkalan_stock_movements.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: { pangkalan_id: pangkalan.id },
            _sum: { qty: true }
        });
        const stockPerType = {};
        for (const m of movements) {
            if (!stockPerType[m.lpg_type])
                stockPerType[m.lpg_type] = 0;
            stockPerType[m.lpg_type] += m.movement_type === 'MASUK'
                ? (m._sum.qty || 0)
                : -(m._sum.qty || 0);
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
    console.log('   ✅ Stok diupdate berdasarkan movements\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                      HASIL AKHIR                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n📊 STATISTIK:`);
    console.log(`   Total Orders    : ${totalOrders.toLocaleString('id-ID')}`);
    console.log(`   Total Revenue   : Rp ${totalRevenue.toLocaleString('id-ID')}`);
    console.log(`   Total Profit    : Rp ${totalProfit.toLocaleString('id-ID')}`);
    console.log(`   Margin 3kg      : Rp ${(20000 - 16000).toLocaleString('id-ID')}/unit`);
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
//# sourceMappingURL=sync-consumer-orders-real.js.map