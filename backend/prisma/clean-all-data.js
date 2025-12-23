/**
 * HAPUS SEMUA DATA AGEN (kecuali admin)
 * 
 * Menghapus:
 * - Semua pangkalan
 * - Semua user pangkalan  
 * - Semua orders, stocks, movements
 * - Semua data operasional
 * 
 * TETAP DIPERTAHANKAN:
 * - User admin (admin@agen.com)
 * - Agen profile
 * - Company profile
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAll() {
    console.log('🧹 MENGHAPUS SEMUA DATA AGEN...\n');

    // 1. Delete order related
    console.log('Deleting payment_records...');
    await prisma.payment_records.deleteMany().catch(() => {});

    console.log('Deleting invoices...');
    await prisma.invoices.deleteMany().catch(() => {});

    console.log('Deleting order_items...');
    await prisma.order_items.deleteMany().catch(() => {});

    console.log('Deleting timeline_tracks...');
    await prisma.timeline_tracks.deleteMany().catch(() => {});

    console.log('Deleting orders...');
    await prisma.orders.deleteMany().catch(() => {});

    // 2. Delete consumer related
    console.log('Deleting consumer_orders...');
    await prisma.consumer_orders.deleteMany().catch(() => {});

    console.log('Deleting consumer_pricing...');
    await prisma.consumer_pricing.deleteMany().catch(() => {});

    console.log('Deleting consumers...');
    await prisma.consumers.deleteMany().catch(() => {});

    // 3. Delete agen orders
    console.log('Deleting agen_orders...');
    await prisma.agen_orders.deleteMany().catch(() => {});

    // 4. Delete stock related
    console.log('Deleting stock_histories...');
    await prisma.stock_histories.deleteMany().catch(() => {});

    console.log('Deleting pangkalan_stock_movements...');
    await prisma.pangkalan_stock_movements.deleteMany().catch(() => {});

    console.log('Deleting pangkalan_stocks...');
    await prisma.pangkalan_stocks.deleteMany().catch(() => {});

    // 5. Delete lpg prices
    console.log('Deleting lpg_prices...');
    await prisma.lpg_prices.deleteMany().catch(() => {});

    // 6. Delete expenses
    console.log('Deleting expenses...');
    await prisma.expenses.deleteMany().catch(() => {});

    // 7. Delete perencanaan/penyaluran/penerimaan
    console.log('Deleting penyaluran_harian...');
    await prisma.penyaluran_harian.deleteMany().catch(() => {});

    console.log('Deleting penerimaan_stok...');
    await prisma.penerimaan_stok.deleteMany().catch(() => {});

    console.log('Deleting perencanaan_harian...');
    await prisma.perencanaan_harian.deleteMany().catch(() => {});

    // 8. Delete activity logs
    console.log('Deleting activity_logs...');
    await prisma.activity_logs.deleteMany().catch(() => {});

    // 9. Delete users (keep admin)
    console.log('Deleting non-admin users...');
    await prisma.users.deleteMany({
        where: { role: { not: 'ADMIN' } }
    }).catch(() => {});

    // 10. Delete drivers
    console.log('Deleting drivers...');
    await prisma.drivers.deleteMany().catch(() => {});

    // 11. Delete pangkalans
    console.log('Deleting pangkalans...');
    await prisma.pangkalans.deleteMany().catch(() => {});

    console.log('\n✅ SELESAI! Database sudah bersih.');
    console.log('\nData yang TETAP ada:');
    
    const admins = await prisma.users.findMany({ 
        where: { role: 'ADMIN' },
        select: { email: true, name: true }
    });
    console.log('   Admin users:', admins.map(a => a.email).join(', '));

    const agens = await prisma.agen.findMany({
        select: { name: true }
    });
    console.log('   Agen:', agens.map(a => a.name).join(', '));
}

cleanAll()
    .catch(e => console.error('Error:', e))
    .finally(() => prisma.$disconnect());
