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
const DATE_WEIGHTS = [30, 20, 15, 12, 10, 8, 5];
function generateCode(prefix, num) {
    return `${prefix}${String(num).padStart(4, '0')}`;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getWeightedRandomDaysAgo() {
    const totalWeight = DATE_WEIGHTS.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < DATE_WEIGHTS.length; i++) {
        random -= DATE_WEIGHTS[i];
        if (random <= 0)
            return i;
    }
    return 0;
}
async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       SYNC PANGKALAN DASHBOARD DATA                        ║');
    console.log('║       Tanggal termasuk HARI INI                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    console.log(`📅 Today: ${today.toISOString().split('T')[0]}\n`);
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
            where: { pangkalan_id: pk.id, source: 'PENJUALAN_KONSUMEN' }
        });
        await prisma.expenses.deleteMany({ where: { pangkalan_id: pk.id } });
    }
    console.log('   ✅ Data dibersihkan\n');
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProfit = 0;
    let todayOrders = 0;
    let todayRevenue = 0;
    for (const pangkalan of pangkalans) {
        console.log(`\n━━━ ${pangkalan.name} ━━━`);
        const consumers = await prisma.consumers.findMany({
            where: { pangkalan_id: pangkalan.id, is_active: true }
        });
        if (consumers.length === 0) {
            console.log('   ⚠️  Tidak ada konsumen, skip...');
            continue;
        }
        console.log(`   👥 ${consumers.length} konsumen`);
        const numOrders = randomInt(30, 50);
        let pangkalanOrders = 0;
        let pangkalanTodayOrders = 0;
        for (let i = 0; i < numOrders; i++) {
            const daysAgo = getWeightedRandomDaysAgo();
            const orderDate = new Date(today);
            orderDate.setDate(orderDate.getDate() - daysAgo);
            orderDate.setHours(randomInt(7, 19), randomInt(0, 59), 0, 0);
            const isToday = daysAgo === 0;
            const consumer = consumers[randomInt(0, consumers.length - 1)];
            const lpgTypes = ['kg3'];
            if (Math.random() < 0.1)
                lpgTypes.push('kg12');
            const lpgType = lpgTypes[randomInt(0, lpgTypes.length - 1)];
            const qty = consumer.consumer_type === 'WARUNG' ? randomInt(3, 8) : randomInt(1, 3);
            const prices = LPG_PRICES[lpgType] || LPG_PRICES['kg3'];
            const orderTotal = qty * prices.sell;
            const orderProfit = qty * (prices.sell - prices.cost);
            await prisma.consumer_orders.create({
                data: {
                    code: generateCode(`PORD-${pangkalan.code.slice(-3)}-`, totalOrders + 1),
                    pangkalan_id: pangkalan.id,
                    consumer_id: consumer.id,
                    consumer_name: consumer.name,
                    lpg_type: lpgType,
                    qty: qty,
                    price_per_unit: prices.sell,
                    cost_price: prices.cost,
                    total_amount: orderTotal,
                    payment_status: 'LUNAS',
                    sale_date: orderDate,
                }
            });
            await prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    lpg_type: lpgType,
                    movement_type: 'KELUAR',
                    qty: qty,
                    source: 'PENJUALAN_KONSUMEN',
                    note: `Penjualan ke ${consumer.name}`,
                    movement_date: orderDate,
                }
            });
            totalOrders++;
            pangkalanOrders++;
            totalRevenue += orderTotal;
            totalProfit += orderProfit;
            if (isToday) {
                todayOrders++;
                pangkalanTodayOrders++;
                todayRevenue += orderTotal;
            }
        }
        console.log(`   ✅ ${pangkalanOrders} orders (${pangkalanTodayOrders} hari ini)`);
        const numExpenses = randomInt(3, 6);
        const expenseCategories = [
            { category: 'Operasional', amounts: [50000, 75000, 100000] },
            { category: 'Transportasi', amounts: [30000, 50000, 75000] },
            { category: 'Maintenance', amounts: [100000, 150000, 200000] },
            { category: 'Lain-lain', amounts: [25000, 50000, 75000] },
        ];
        for (let j = 0; j < numExpenses; j++) {
            const cat = expenseCategories[randomInt(0, expenseCategories.length - 1)];
            const amount = cat.amounts[randomInt(0, cat.amounts.length - 1)];
            const expenseDate = new Date(today);
            expenseDate.setDate(expenseDate.getDate() - randomInt(0, 14));
            await prisma.expenses.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    category: cat.category,
                    amount: amount,
                    description: `${cat.category} - ${pangkalan.name}`,
                    expense_date: expenseDate,
                }
            });
        }
        console.log(`   ✅ ${numExpenses} expenses`);
    }
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                      HASIL AKHIR                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n📊 STATISTIK TOTAL:');
    console.log(`   Total Orders      : ${totalOrders.toLocaleString('id-ID')}`);
    console.log(`   Total Revenue     : Rp ${totalRevenue.toLocaleString('id-ID')}`);
    console.log(`   Total Profit      : Rp ${totalProfit.toLocaleString('id-ID')}`);
    console.log('\n📅 STATISTIK HARI INI:');
    console.log(`   Orders Hari Ini   : ${todayOrders}`);
    console.log(`   Revenue Hari Ini  : Rp ${todayRevenue.toLocaleString('id-ID')}`);
    const orderCount = await prisma.consumer_orders.count();
    const movementCount = await prisma.pangkalan_stock_movements.count({ where: { source: 'PENJUALAN_KONSUMEN' } });
    const expenseCount = await prisma.expenses.count();
    console.log('\n📦 DATABASE:');
    console.log(`   consumer_orders        : ${orderCount}`);
    console.log(`   stock_movements (SALE) : ${movementCount}`);
    console.log(`   expenses               : ${expenseCount}`);
    console.log('\n✅ SYNC COMPLETE! Dashboard pangkalan sekarang menampilkan data hari ini.\n');
}
main()
    .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=sync-pangkalan-dashboard.js.map