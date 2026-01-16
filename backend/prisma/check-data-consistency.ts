/**
 * Quick check script for data consistency
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 CHECKING DATA CONSISTENCY\n');

    // Count all tables
    const penyaluran = await prisma.penyaluran_harian.count();
    const movements = await prisma.pangkalan_stock_movements.count();
    const stocks = await prisma.pangkalan_stocks.count();
    const penerimaan = await prisma.penerimaan_stok.count();
    const consumerOrders = await prisma.consumer_orders.count();
    const orders = await prisma.orders.count();
    const orderItems = await prisma.order_items.count();

    console.log('📊 TABLE COUNTS:');
    console.log(`  penyaluran_harian: ${penyaluran}`);
    console.log(`  pangkalan_stock_movements: ${movements}`);
    console.log(`  pangkalan_stocks: ${stocks}`);
    console.log(`  penerimaan_stok: ${penerimaan}`);
    console.log(`  consumer_orders: ${consumerOrders}`);
    console.log(`  orders: ${orders}`);
    console.log(`  order_items: ${orderItems}`);

    // Check penyaluran summary
    console.log('\n📦 PENYALURAN SUMMARY:');
    const penyaluranData = await prisma.penyaluran_harian.groupBy({
        by: ['lpg_type'],
        _sum: { jumlah_normal: true, jumlah_fakultatif: true }
    });
    for (const p of penyaluranData) {
        const total = (p._sum.jumlah_normal || 0) + (p._sum.jumlah_fakultatif || 0);
        console.log(`  ${p.lpg_type}: ${total} (normal: ${p._sum.jumlah_normal}, fakultatif: ${p._sum.jumlah_fakultatif})`);
    }

    // Check stock movements summary
    console.log('\n📋 PANGKALAN STOCK MOVEMENTS:');
    const movementData = await prisma.pangkalan_stock_movements.groupBy({
        by: ['lpg_type', 'movement_type'],
        _sum: { qty: true }
    });
    for (const m of movementData) {
        console.log(`  ${m.lpg_type} (${m.movement_type}): ${m._sum.qty}`);
    }

    // Check current stocks
    console.log('\n💰 CURRENT PANGKALAN STOCKS:');
    const stockData = await prisma.pangkalan_stocks.groupBy({
        by: ['lpg_type'],
        _sum: { qty: true }
    });
    for (const s of stockData) {
        console.log(`  ${s.lpg_type}: ${s._sum.qty} unit`);
    }

    console.log('\n✅ Check complete!');
}

main()
    .catch(e => console.error('Error:', e))
    .finally(() => prisma.$disconnect());
