"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const LPG_PRICES = {
    kg3: { cost: 18500, sell: 22000, label: 'LPG 3 kg (Subsidi)' },
    kg12: { cost: 165000, sell: 185000, label: 'LPG 12 kg' },
    kg50: { cost: 680000, sell: 750000, label: 'LPG 50 kg' },
};
const CONSUMER_NAMES = [
    'Siti Aminah', 'Dewi Lestari', 'Ratna Sari', 'Yusuf Rahman',
    'Ahmad Hidayat', 'Budi Santoso', 'Erna Wati', 'Fitriani',
    'Gunawan', 'Hendra Wijaya', 'Ida Nurhasanah', 'Joko Susilo',
    'Kartini', 'Linda Permata', 'Made Suarjana', 'Nana Supriatna',
    'Oki Setiawan', 'Putri Rahayu', 'Rini Hartati', 'Sri Wahyuni',
    'Tuti Handayani', 'Udin Saepudin', 'Vera Anggraeni', 'Wawan Hermawan',
    'Yanti Kusuma', 'Zainal Abidin', 'Asep Sunarya', 'Bambang Sutrisno',
    'Citra Dewi', 'Dedi Kurniawan', 'Eka Prasetya', 'Fajar Nugroho',
];
function generateNIK() {
    const provinsi = '32';
    const kota = Math.floor(Math.random() * 9 + 1).toString().padStart(2, '0');
    const kecamatan = Math.floor(Math.random() * 9 + 1).toString().padStart(2, '0');
    const tanggal = Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0');
    const bulan = Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0');
    const tahun = Math.floor(Math.random() * 30 + 70).toString();
    const urutan = Math.floor(Math.random() * 9999 + 1).toString().padStart(4, '0');
    return `${provinsi}${kota}${kecamatan}${tanggal}${bulan}${tahun}${urutan}`;
}
function generatePhone() {
    const prefix = ['0812', '0813', '0852', '0878', '0857', '0858'];
    return prefix[Math.floor(Math.random() * prefix.length)] +
        Math.floor(Math.random() * 90000000 + 10000000).toString();
}
async function main() {
    console.log('📊 Seeding Laporan Demo Data...\n');
    const pangkalans = await prisma.pangkalans.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
    });
    const admin = await prisma.users.findFirst({ where: { role: 'ADMIN' } });
    const lpg3kg = await prisma.lpg_products.findFirst({
        where: { size_kg: 3, is_active: true }
    });
    if (pangkalans.length === 0) {
        console.error('❌ Tidak ada pangkalan! Jalankan seed pangkalan dulu.');
        return;
    }
    console.log(`✓ Found ${pangkalans.length} pangkalans`);
    console.log(`✓ LPG 3kg: ${lpg3kg?.name || 'Not found'}\n`);
    console.log('🧹 Cleaning up previous laporan demo data...');
    const consumerOrders = await prisma.consumer_orders.findMany({
        where: { code: { startsWith: 'PORD-L' } },
        select: { id: true }
    });
    if (consumerOrders.length > 0) {
        await prisma.consumer_orders.deleteMany({
            where: { id: { in: consumerOrders.map(o => o.id) } }
        });
        console.log(`  ✓ Deleted ${consumerOrders.length} consumer orders`);
    }
    const reportOrders = await prisma.orders.findMany({
        where: { code: { startsWith: 'ORD-R' } },
        select: { id: true }
    });
    if (reportOrders.length > 0) {
        await prisma.order_items.deleteMany({
            where: { order_id: { in: reportOrders.map(o => o.id) } }
        });
        await prisma.order_payment_details.deleteMany({
            where: { order_id: { in: reportOrders.map(o => o.id) } }
        });
        await prisma.orders.deleteMany({
            where: { id: { in: reportOrders.map(o => o.id) } }
        });
        console.log(`  ✓ Deleted ${reportOrders.length} report orders`);
    }
    console.log('\n👥 Creating consumers for each pangkalan...');
    let totalConsumersCreated = 0;
    const consumersByPangkalan = {};
    for (const pkl of pangkalans) {
        const existingCount = await prisma.consumers.count({
            where: { pangkalan_id: pkl.id }
        });
        const targetCount = 8 + Math.floor(Math.random() * 8);
        const toCreate = Math.max(0, targetCount - existingCount);
        const createdConsumers = [];
        for (let i = 0; i < toCreate; i++) {
            const nameIndex = (totalConsumersCreated + i) % CONSUMER_NAMES.length;
            const name = CONSUMER_NAMES[nameIndex] + ' ' + (pkl.name.split(' ')[1] || '');
            const isWarung = Math.random() > 0.7;
            const consumer = await prisma.consumers.create({
                data: {
                    pangkalan_id: pkl.id,
                    name: name.trim(),
                    nik: generateNIK(),
                    phone: generatePhone(),
                    address: `Jl. ${pkl.region || 'Cianjur'} RT ${Math.floor(Math.random() * 10 + 1)}`,
                    consumer_type: isWarung ? 'WARUNG' : 'RUMAH_TANGGA',
                    is_active: true,
                },
            });
            createdConsumers.push(consumer);
        }
        const allConsumers = await prisma.consumers.findMany({
            where: { pangkalan_id: pkl.id, is_active: true }
        });
        consumersByPangkalan[pkl.id] = allConsumers;
        if (toCreate > 0) {
            console.log(`  ✓ ${pkl.name}: +${toCreate} consumers (total: ${allConsumers.length})`);
        }
        totalConsumersCreated += toCreate;
    }
    console.log(`  ✓ Total consumers created: ${totalConsumersCreated}`);
    console.log('\n📦 Creating completed orders for pangkalans...');
    let orderNum = 1000;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let totalOrders = 0;
    let totalTabung = 0;
    let totalPendapatan = 0;
    for (const pkl of pangkalans) {
        const numOrders = 3 + Math.floor(Math.random() * 6);
        for (let i = 0; i < numOrders; i++) {
            const day = Math.floor(Math.random() * now.getDate()) + 1;
            const orderDate = new Date(currentYear, currentMonth, day);
            const qty = 15 + Math.floor(Math.random() * 35);
            const subtotal = qty * LPG_PRICES.kg3.sell;
            const order = await prisma.orders.create({
                data: {
                    code: `ORD-R${String(++orderNum).padStart(4, '0')}`,
                    pangkalan_id: pkl.id,
                    order_date: orderDate,
                    current_status: 'SELESAI',
                    subtotal,
                    tax_amount: 0,
                    total_amount: subtotal,
                    note: `Pesanan rutin bulan ini`,
                },
            });
            await prisma.order_items.create({
                data: {
                    order_id: order.id,
                    lpg_type: 'kg3',
                    label: LPG_PRICES.kg3.label,
                    price_per_unit: LPG_PRICES.kg3.sell,
                    qty,
                    sub_total: subtotal,
                    is_taxable: false,
                    tax_amount: 0,
                },
            });
            await prisma.order_payment_details.create({
                data: {
                    order_id: order.id,
                    is_paid: true,
                    payment_method: Math.random() > 0.5 ? 'TRANSFER' : 'TUNAI',
                    amount_paid: subtotal,
                    payment_date: orderDate,
                },
            });
            totalOrders++;
            totalTabung += qty;
            totalPendapatan += subtotal;
        }
        console.log(`  ✓ ${pkl.name}: ${numOrders} orders`);
    }
    console.log(`  📊 Total: ${totalOrders} orders, ${totalTabung} tabung, Rp ${totalPendapatan.toLocaleString()}`);
    console.log('\n🛒 Creating consumer orders (subsidy distribution)...');
    let consumerOrderNum = 1000;
    let totalConsumerOrders = 0;
    let totalSubsidiTabung = 0;
    let totalSubsidiPendapatan = 0;
    for (const pkl of pangkalans) {
        const consumers = consumersByPangkalan[pkl.id] || [];
        if (consumers.length === 0)
            continue;
        for (const consumer of consumers) {
            const numPurchases = 1 + Math.floor(Math.random() * 4);
            for (let i = 0; i < numPurchases; i++) {
                const day = Math.floor(Math.random() * now.getDate()) + 1;
                const saleDate = new Date(currentYear, currentMonth, day);
                saleDate.setHours(8 + Math.floor(Math.random() * 10));
                const isWarung = consumer.consumer_type === 'WARUNG';
                const qty = isWarung
                    ? 3 + Math.floor(Math.random() * 3)
                    : 1 + Math.floor(Math.random() * 2);
                const pricePerUnit = LPG_PRICES.kg3.sell;
                const totalAmount = qty * pricePerUnit;
                await prisma.consumer_orders.create({
                    data: {
                        code: `PORD-L${String(++consumerOrderNum).padStart(4, '0')}`,
                        pangkalan_id: pkl.id,
                        consumer_id: consumer.id,
                        lpg_type: 'kg3',
                        qty,
                        price_per_unit: pricePerUnit,
                        cost_price: LPG_PRICES.kg3.cost,
                        total_amount: totalAmount,
                        payment_status: 'LUNAS',
                        sale_date: saleDate,
                        note: isWarung ? 'Pembelian warung' : null,
                    },
                });
                totalConsumerOrders++;
                totalSubsidiTabung += qty;
                totalSubsidiPendapatan += totalAmount;
            }
        }
        console.log(`  ✓ ${pkl.name}: ${consumers.length} consumers making purchases`);
    }
    console.log(`  📊 Total: ${totalConsumerOrders} sales, ${totalSubsidiTabung} tabung, Rp ${totalSubsidiPendapatan.toLocaleString()}`);
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Laporan Seed Complete!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Data Summary:');
    console.log(`   - Total Pangkalan: ${pangkalans.length}`);
    console.log(`   - Total Transaksi (Orders): ${totalOrders}`);
    console.log(`   - Total Tabung (Orders): ${totalTabung}`);
    console.log(`   - Total Pendapatan: Rp ${totalPendapatan.toLocaleString()}`);
    console.log(`\n📦 Distribusi Subsidi 3kg:`);
    console.log(`   - Transaksi Subsidi: ${totalConsumerOrders}`);
    console.log(`   - Tabung Subsidi: ${totalSubsidiTabung}`);
    console.log(`   - Pendapatan Subsidi: Rp ${totalSubsidiPendapatan.toLocaleString()}`);
    console.log(`   - Konsumen Aktif: ${totalConsumersCreated}`);
    console.log('\n🎉 Refresh halaman Laporan untuk melihat data!');
}
main()
    .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-laporan.js.map