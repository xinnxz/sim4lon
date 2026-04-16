"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          DATABASE ANALYSIS - SIM4LON                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    const tables = [
        { name: 'users', query: () => prisma.users.count() },
        { name: 'agen', query: () => prisma.agen.count() },
        { name: 'pangkalans', query: () => prisma.pangkalans.count() },
        { name: 'drivers', query: () => prisma.drivers.count() },
        { name: 'lpg_products', query: () => prisma.lpg_products.count() },
        { name: 'lpg_prices', query: () => prisma.lpg_prices.count() },
        { name: 'consumers', query: () => prisma.consumers.count() },
        { name: 'orders', query: () => prisma.orders.count() },
        { name: 'order_items', query: () => prisma.order_items.count() },
        { name: 'order_payment_details', query: () => prisma.order_payment_details.count() },
        { name: 'payment_records', query: () => prisma.payment_records.count() },
        { name: 'invoices', query: () => prisma.invoices.count() },
        { name: 'timeline_tracks', query: () => prisma.timeline_tracks.count() },
        { name: 'consumer_orders', query: () => prisma.consumer_orders.count() },
        { name: 'agen_orders', query: () => prisma.agen_orders.count() },
        { name: 'stock_histories', query: () => prisma.stock_histories.count() },
        { name: 'pangkalan_stocks', query: () => prisma.pangkalan_stocks.count() },
        { name: 'pangkalan_stock_movements', query: () => prisma.pangkalan_stock_movements.count() },
        { name: 'penerimaan_stok', query: () => prisma.penerimaan_stok.count() },
        { name: 'penyaluran_harian', query: () => prisma.penyaluran_harian.count() },
        { name: 'perencanaan_harian', query: () => prisma.perencanaan_harian.count() },
        { name: 'expenses', query: () => prisma.expenses.count() },
        { name: 'activity_logs', query: () => prisma.activity_logs.count() },
        { name: 'company_profile', query: () => prisma.company_profile.count() },
    ];
    const results = [];
    console.log('📊 TABEL STATUS:\n');
    console.log('┌─────────────────────────────┬─────────┬────────────┐');
    console.log('│ Tabel                       │ Count   │ Status     │');
    console.log('├─────────────────────────────┼─────────┼────────────┤');
    for (const table of tables) {
        try {
            const count = await table.query();
            let status = '';
            if (count === 0)
                status = '❌ KOSONG';
            else if (count < 5)
                status = '⚠️  MINIM';
            else
                status = '✅ OK';
            results.push({ name: table.name, count, status });
            console.log(`│ ${table.name.padEnd(27)} │ ${String(count).padStart(7)} │ ${status.padEnd(10)} │`);
        }
        catch (e) {
            results.push({ name: table.name, count: -1, status: '⚠️  ERROR' });
            console.log(`│ ${table.name.padEnd(27)} │ ${'ERROR'.padStart(7)} │ ⚠️  ERROR   │`);
        }
    }
    console.log('└─────────────────────────────┴─────────┴────────────┘');
    const empty = results.filter(r => r.count === 0);
    const minim = results.filter(r => r.count > 0 && r.count < 5);
    const ok = results.filter(r => r.count >= 5);
    console.log('\n📈 RINGKASAN:');
    console.log(`   ✅ Terisi (≥5)  : ${ok.length} tabel`);
    console.log(`   ⚠️  Minim (<5)  : ${minim.length} tabel`);
    console.log(`   ❌ Kosong       : ${empty.length} tabel`);
    if (empty.length > 0) {
        console.log('\n❌ TABEL KOSONG:');
        empty.forEach(t => console.log(`   - ${t.name}`));
    }
    if (minim.length > 0) {
        console.log('\n⚠️  TABEL MINIM (data sedikit):');
        minim.forEach(t => console.log(`   - ${t.name} (${t.count} records)`));
    }
    console.log('\n' + '═'.repeat(60));
    console.log('📋 ANALISA DETAIL:\n');
    const ordersSelesai = await prisma.orders.count({ where: { current_status: 'SELESAI' } });
    const ordersPending = await prisma.orders.count({ where: { current_status: { in: ['DRAFT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES'] } } });
    const paymentDetails = await prisma.order_payment_details.count();
    console.log('1️⃣ ORDERS & PAYMENTS:');
    console.log(`   Orders SELESAI    : ${ordersSelesai}`);
    console.log(`   Orders Pending    : ${ordersPending}`);
    console.log(`   Payment Details   : ${paymentDetails}`);
    if (paymentDetails === 0)
        console.log('   ⚠️  Tidak ada payment details untuk orders!');
    const stockIn = await prisma.pangkalan_stock_movements.aggregate({
        where: { movement_type: 'MASUK' },
        _sum: { qty: true }
    });
    const stockOut = await prisma.pangkalan_stock_movements.aggregate({
        where: { movement_type: 'KELUAR' },
        _sum: { qty: true }
    });
    const currentStock = await prisma.pangkalan_stocks.aggregate({ _sum: { qty: true } });
    console.log('\n2️⃣ STOK PANGKALAN:');
    console.log(`   Total MASUK       : ${stockIn._sum.qty || 0}`);
    console.log(`   Total KELUAR      : ${stockOut._sum.qty || 0}`);
    console.log(`   Stok Sekarang     : ${currentStock._sum.qty || 0}`);
    const consumersWithOrders = await prisma.consumer_orders.findMany({
        where: { consumer_id: { not: null } },
        distinct: ['consumer_id']
    });
    const totalConsumers = await prisma.consumers.count();
    console.log('\n3️⃣ KONSUMEN:');
    console.log(`   Total Konsumen    : ${totalConsumers}`);
    console.log(`   Yg pernah beli    : ${consumersWithOrders.length}`);
    const agenOrders = await prisma.agen_orders.count();
    console.log('\n4️⃣ AGEN ORDERS (Order via WA):');
    console.log(`   Total             : ${agenOrders}`);
    if (agenOrders === 0)
        console.log('   ⚠️  Belum ada order ke agen via WhatsApp!');
    const expenses = await prisma.expenses.count();
    console.log('\n5️⃣ PENGELUARAN (Expenses):');
    console.log(`   Total             : ${expenses}`);
    if (expenses === 0)
        console.log('   ⚠️  Belum ada data pengeluaran pangkalan!');
    const logs = await prisma.activity_logs.count();
    console.log('\n6️⃣ ACTIVITY LOGS:');
    console.log(`   Total             : ${logs}`);
    if (logs === 0)
        console.log('   ⚠️  Belum ada activity logs!');
    const company = await prisma.company_profile.findFirst();
    console.log('\n7️⃣ COMPANY PROFILE:');
    if (company) {
        console.log(`   Nama              : ${company.company_name}`);
        console.log(`   Alamat            : ${company.address?.substring(0, 30)}...`);
    }
    else {
        console.log('   ⚠️  Belum ada company profile!');
    }
    console.log('\n' + '═'.repeat(60));
    console.log('✅ ANALISIS SELESAI\n');
}
main()
    .catch(e => console.error('Error:', e))
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=analyze-database.js.map