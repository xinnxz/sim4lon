"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const DEFAULT_PRICES = {
    RUMAH_TANGGA: {
        kg3: 18000,
        kg5: 35000,
        kg12: 165000,
        kg50: 650000,
    },
    WARUNG: {
        kg3: 17500,
        kg5: 34000,
        kg12: 160000,
        kg50: 640000,
    },
};
const COST_PRICES = {
    kg3: 16000,
    kg5: 32000,
    kg12: 150000,
    kg50: 610000,
};
const CONSUMERS = [
    {
        name: 'Neng Siti N',
        type: 'RUMAH_TANGGA',
        phone: '081234567801',
        address: 'Jl. Melati No. 1',
    },
    {
        name: 'Bu Titin Sumarni',
        type: 'RUMAH_TANGGA',
        phone: '081234567802',
        address: 'Jl. Anggrek No. 5',
        customPricing: { kg3: 17800 },
    },
    {
        name: 'Pak Rohman',
        type: 'RUMAH_TANGGA',
        phone: '081234567803',
        address: 'Jl. Mawar No. 12',
    },
    {
        name: 'Bu Lukman',
        type: 'RUMAH_TANGGA',
        phone: '081234567804',
        address: 'Jl. Dahlia No. 8',
        customPricing: { kg3: 17500, kg5: 34000 },
    },
    {
        name: 'Mang Udin',
        type: 'RUMAH_TANGGA',
        phone: '081234567805',
        address: 'Jl. Kenanga No. 3',
    },
    {
        name: 'Warung Bu Siti',
        type: 'WARUNG',
        phone: '081234567806',
        address: 'Jl. Pasar No. 1',
        customPricing: { kg3: 17000 },
    },
    {
        name: 'Toko Madura Jaya',
        type: 'WARUNG',
        phone: '081234567807',
        address: 'Jl. Raya No. 45',
    },
    {
        name: 'Warung Berkah',
        type: 'WARUNG',
        phone: '081234567808',
        address: 'Jl. Seroja No. 17',
    },
    {
        name: 'Warung Rizky Abadi',
        type: 'WARUNG',
        phone: '081234567809',
        address: 'Jl. Teratai No. 9',
        customPricing: { kg12: 155000, kg50: 630000 },
    },
    {
        name: 'Warung Yuli Lestari',
        type: 'WARUNG',
        phone: '081234567810',
        address: 'Jl. Bougenville No. 11',
    },
];
const LPG_WEIGHTS = [
    { type: 'kg3', weight: 65 },
    { type: 'kg5', weight: 15 },
    { type: 'kg12', weight: 15 },
    { type: 'kg50', weight: 5 },
];
function getRandomLpgType() {
    const total = LPG_WEIGHTS.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * total;
    for (const w of LPG_WEIGHTS) {
        random -= w.weight;
        if (random <= 0)
            return w.type;
    }
    return 'kg3';
}
function getRandomQty(lpgType) {
    switch (lpgType) {
        case 'kg3': return Math.floor(Math.random() * 15) + 1;
        case 'kg5': return Math.floor(Math.random() * 5) + 1;
        case 'kg12': return Math.floor(Math.random() * 3) + 1;
        case 'kg50': return 1;
        default: return 1;
    }
}
async function main() {
    console.log('🚀 Seeding Pangkalan Data (1 Minggu)...\n');
    const pangkalan = await prisma.pangkalans.findFirst({
        where: { is_active: true },
    });
    if (!pangkalan) {
        console.log('❌ Tidak ada pangkalan aktif! Jalankan seed-pangkalan-user.ts dulu.');
        return;
    }
    console.log(`📦 Pangkalan: ${pangkalan.name} (${pangkalan.code})\n`);
    console.log('🗑️  Cleaning existing data...');
    await prisma.consumer_orders.deleteMany({ where: { pangkalan_id: pangkalan.id } });
    await prisma.consumer_pricing.deleteMany({
        where: { consumers: { pangkalan_id: pangkalan.id } }
    });
    await prisma.consumers.deleteMany({ where: { pangkalan_id: pangkalan.id } });
    console.log('✅ Data cleaned\n');
    console.log('👥 Creating consumers with pricing...');
    const consumers = [];
    for (const c of CONSUMERS) {
        const consumer = await prisma.consumers.create({
            data: {
                name: c.name,
                note: c.type,
                phone: c.phone,
                address: c.address,
                pangkalan_id: pangkalan.id,
            },
        });
        const defaultPrices = DEFAULT_PRICES[c.type];
        const prices = { ...defaultPrices };
        if (c.customPricing) {
            for (const [lpgType, price] of Object.entries(c.customPricing)) {
                if (price) {
                    prices[lpgType] = price;
                    await prisma.consumer_pricing.create({
                        data: {
                            pangkalan_id: pangkalan.id,
                            consumer_id: consumer.id,
                            lpg_type: lpgType,
                            price: price,
                        },
                    });
                }
            }
        }
        consumers.push({
            id: consumer.id,
            name: consumer.name,
            type: c.type,
            prices,
        });
        const hasCustom = c.customPricing ? ' (custom pricing)' : '';
        console.log(`   ✓ ${c.name} [${c.type}]${hasCustom}`);
    }
    const rumahTangga = consumers.filter(c => c.type === 'RUMAH_TANGGA').length;
    const warung = consumers.filter(c => c.type === 'WARUNG').length;
    console.log(`\n✅ ${consumers.length} consumers (${rumahTangga} RT, ${warung} Warung)\n`);
    console.log('📝 Creating 7 days of orders...\n');
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    let totalOrders = 0;
    let totalQty = 0;
    let totalRevenue = 0;
    const lpgCount = { kg3: 0, kg5: 0, kg12: 0, kg50: 0 };
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const orderDate = new Date(today);
        orderDate.setDate(today.getDate() - dayOffset);
        const ordersPerDay = Math.floor(Math.random() * 9) + 10;
        let dayQty = 0;
        let dayRevenue = 0;
        for (let i = 0; i < ordersPerDay; i++) {
            const consumer = consumers[Math.floor(Math.random() * consumers.length)];
            const lpgType = getRandomLpgType();
            const qty = getRandomQty(lpgType);
            const pricePerUnit = consumer.prices[lpgType] || DEFAULT_PRICES.RUMAH_TANGGA[lpgType];
            const total = qty * pricePerUnit;
            const paymentStatus = 'LUNAS';
            const orderTime = new Date(orderDate);
            orderTime.setHours(7 + Math.floor(Math.random() * 12));
            orderTime.setMinutes(Math.floor(Math.random() * 60));
            const orderCount = await prisma.consumer_orders.count({
                where: { pangkalan_id: pangkalan.id },
            });
            await prisma.consumer_orders.create({
                data: {
                    code: `PORD-${String(orderCount + 1).padStart(4, '0')}`,
                    pangkalan_id: pangkalan.id,
                    consumer_id: consumer.id,
                    lpg_type: lpgType,
                    qty,
                    price_per_unit: pricePerUnit,
                    total_amount: total,
                    payment_status: paymentStatus,
                    sale_date: orderTime,
                },
            });
            dayQty += qty;
            dayRevenue += total;
            lpgCount[lpgType] += qty;
            totalOrders++;
        }
        totalQty += dayQty;
        totalRevenue += dayRevenue;
        const dateStr = orderDate.toLocaleDateString('id-ID', {
            weekday: 'short', day: 'numeric', month: 'short'
        });
        console.log(`   ${dateStr}: ${ordersPerDay} transaksi, ${dayQty} tabung, Rp ${dayRevenue.toLocaleString('id-ID')}`);
    }
    console.log('📦 Creating initial stock levels...\n');
    const stockLevels = [
        { lpg_type: 'kg3', qty: 150, warning_level: 30, critical_level: 15 },
        { lpg_type: 'kg5', qty: 30, warning_level: 10, critical_level: 5 },
        { lpg_type: 'kg12', qty: 45, warning_level: 15, critical_level: 8 },
        { lpg_type: 'kg50', qty: 12, warning_level: 5, critical_level: 2 },
    ];
    for (const stock of stockLevels) {
        await prisma.pangkalan_stocks.upsert({
            where: {
                pangkalan_id_lpg_type: {
                    pangkalan_id: pangkalan.id,
                    lpg_type: stock.lpg_type,
                },
            },
            update: {
                qty: stock.qty,
                warning_level: stock.warning_level,
                critical_level: stock.critical_level,
            },
            create: {
                pangkalan_id: pangkalan.id,
                lpg_type: stock.lpg_type,
                qty: stock.qty,
                warning_level: stock.warning_level,
                critical_level: stock.critical_level,
            },
        });
        console.log(`   ✓ ${stock.lpg_type}: ${stock.qty} tabung`);
    }
    const totalStockQty = stockLevels.reduce((sum, s) => sum + s.qty, 0);
    console.log(`\n✅ ${stockLevels.length} LPG types seeded (Total: ${totalStockQty} tabung)\n`);
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  SEED DATA COMPLETE');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  Consumers     : ${consumers.length} (${rumahTangga} RT + ${warung} Warung)`);
    console.log(`  Orders        : ${totalOrders} transaksi`);
    console.log(`  Total Qty     : ${totalQty} tabung`);
    console.log(`  Revenue       : Rp ${totalRevenue.toLocaleString('id-ID')}`);
    console.log(`  Stock         : ${totalStockQty} tabung`);
    console.log('───────────────────────────────────────────────────────');
    console.log(`  LPG 3kg       : ${lpgCount.kg3} tabung`);
    console.log(`  LPG 5.5kg     : ${lpgCount.kg5} tabung`);
    console.log(`  LPG 12kg      : ${lpgCount.kg12} tabung`);
    console.log(`  LPG 50kg      : ${lpgCount.kg50} tabung`);
    console.log('═══════════════════════════════════════════════════════\n');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-pangkalan-data.js.map