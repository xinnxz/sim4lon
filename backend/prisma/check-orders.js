const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    // Check ALL agen_orders with details
    const orders = await prisma.agen_orders.findMany({
        select: { id: true, code: true, status: true, qty_ordered: true },
        orderBy: { order_date: 'desc' },
    });

    console.log('\n═══════════════════════════════════════');
    console.log('  ALL AGEN_ORDERS');
    console.log('═══════════════════════════════════════');
    
    orders.forEach(o => {
        const flag = (o.status === 'PENDING' || o.status === 'DIKIRIM') ? ' ⚠️ (SHOWS IN BADGE)' : '';
        console.log(`  ${o.code}: ${o.status} - ${o.qty_ordered} tabung${flag}`);
    });
    
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const dikirim = orders.filter(o => o.status === 'DIKIRIM').length;
    
    console.log(`\n📊 Summary:`);
    console.log(`  PENDING: ${pending}`);
    console.log(`  DIKIRIM: ${dikirim}`);
    console.log(`  Badge would show: ${pending + dikirim}`);
    
    await prisma.$disconnect();
}

check();
