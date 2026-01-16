/**
 * SYNC PANGKALAN DASHBOARD DATA
 * 
 * Script ini memperbaiki data untuk pangkalan dashboard:
 * 1. Regenerate consumer_orders dengan tanggal 7 hari terakhir (termasuk HARI INI)
 * 2. Update expenses dengan distribusi bulan ini
 * 3. Update pangkalan_stock_movements sesuai
 * 
 * HARGA LPG:
 * - 3kg: Beli 16.000 | Jual 20.000
 * - 5kg: Beli 29.000 | Jual 32.000
 * - 12kg: Beli 135.000 | Jual 150.000
 * - 50kg: Beli 570.000 | Jual 610.000
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/sync-pangkalan-dashboard.ts
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

// Harga LPG
const LPG_PRICES: Record<string, { cost: number; sell: number }> = {
    'kg3': { cost: 16000, sell: 20000 },
    'kg5': { cost: 29000, sell: 32000 },
    'kg12': { cost: 135000, sell: 150000 },
    'kg50': { cost: 570000, sell: 610000 },
    'gr220': { cost: 12000, sell: 15000 },
};

// Date distribution: more weight on recent days
const DATE_WEIGHTS = [30, 20, 15, 12, 10, 8, 5]; // Today has highest weight

function generateCode(prefix: string, num: number): string {
    return `${prefix}${String(num).padStart(4, '0')}`;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWeightedRandomDaysAgo(): number {
    const totalWeight = DATE_WEIGHTS.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < DATE_WEIGHTS.length; i++) {
        random -= DATE_WEIGHTS[i];
        if (random <= 0) return i;
    }
    return 0;
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       SYNC PANGKALAN DASHBOARD DATA                        ║');
    console.log('║       Tanggal termasuk HARI INI                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const today = new Date();
    today.setHours(12, 0, 0, 0); // Noon WIB to avoid timezone issues
    console.log(`📅 Today: ${today.toISOString().split('T')[0]}\n`);

    // Get target pangkalans
    const pangkalans = await prisma.pangkalans.findMany({
        where: {
            code: { in: TARGET_PANGKALAN_CODES },
            is_active: true
        },
        orderBy: { name: 'asc' },
    });

    console.log(`📦 Target: ${pangkalans.length} pangkalans\n`);

    // Clear existing data
    console.log('🗑️  Membersihkan data lama...');
    for (const pk of pangkalans) {
        await prisma.consumer_orders.deleteMany({ where: { pangkalan_id: pk.id } });
        await prisma.pangkalan_stock_movements.deleteMany({
            where: { pangkalan_id: pk.id, source: 'PENJUALAN_KONSUMEN' }
        });
        // Also clear expenses to regenerate with proper dates
        await prisma.expenses.deleteMany({ where: { pangkalan_id: pk.id } });
    }
    console.log('   ✅ Data dibersihkan\n');

    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProfit = 0;
    let todayOrders = 0;
    let todayRevenue = 0;

    // Process each pangkalan
    for (const pangkalan of pangkalans) {
        console.log(`\n━━━ ${pangkalan.name} ━━━`);

        // Get consumers for this pangkalan
        const consumers = await prisma.consumers.findMany({
            where: { pangkalan_id: pangkalan.id, is_active: true }
        });

        if (consumers.length === 0) {
            console.log('   ⚠️  Tidak ada konsumen, skip...');
            continue;
        }

        console.log(`   👥 ${consumers.length} konsumen`);

        // Generate 30-50 orders per pangkalan spread across 7 days
        const numOrders = randomInt(30, 50);
        let pangkalanOrders = 0;
        let pangkalanTodayOrders = 0;

        for (let i = 0; i < numOrders; i++) {
            const daysAgo = getWeightedRandomDaysAgo();
            const orderDate = new Date(today);
            orderDate.setDate(orderDate.getDate() - daysAgo);
            orderDate.setHours(randomInt(7, 19), randomInt(0, 59), 0, 0);

            const isToday = daysAgo === 0;

            // Pick random consumer
            const consumer = consumers[randomInt(0, consumers.length - 1)];

            // Random qty and lpg type
            const lpgTypes = ['kg3']; // Most orders are 3kg
            if (Math.random() < 0.1) lpgTypes.push('kg12'); // 10% chance for other types
            const lpgType = lpgTypes[randomInt(0, lpgTypes.length - 1)];

            const qty = consumer.consumer_type === 'WARUNG' ? randomInt(3, 8) : randomInt(1, 3);
            const prices = LPG_PRICES[lpgType] || LPG_PRICES['kg3'];
            const orderTotal = qty * prices.sell;
            const orderProfit = qty * (prices.sell - prices.cost);

            // Create consumer order
            await prisma.consumer_orders.create({
                data: {
                    code: generateCode(`PORD-${pangkalan.code.slice(-3)}-`, totalOrders + 1),
                    pangkalan_id: pangkalan.id,
                    consumer_id: consumer.id,
                    consumer_name: consumer.name,
                    lpg_type: lpgType as lpg_type,
                    qty: qty,
                    price_per_unit: prices.sell,
                    cost_price: prices.cost,
                    total_amount: orderTotal,
                    payment_status: 'LUNAS',
                    sale_date: orderDate,
                }
            });

            // Create stock movement
            await prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    lpg_type: lpgType as lpg_type,
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

        // Generate expenses (3-6 per pangkalan, spread in current month)
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

    // Final Summary
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

    // Verify DB counts
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
