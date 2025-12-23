const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    console.log('\n═══════════════════════════════════════');
    console.log('  📊 SEED VERIFICATION (SYNCHRONIZED)');
    console.log('═══════════════════════════════════════\n');

    // Pangkalans
    const pangkalans = await prisma.pangkalans.findMany({ select: { code: true, name: true, email: true } });
    console.log(`Pangkalans: ${pangkalans.length}`);
    pangkalans.forEach(p => console.log(`  - ${p.code}: ${p.name} (${p.email || 'no email'})`));

    // Users (Pangkalan role)
    const pklUsers = await prisma.users.findMany({ where: { role: 'PANGKALAN' }, select: { email: true, name: true } });
    console.log(`\nUser Pangkalan: ${pklUsers.length}`);
    pklUsers.forEach(u => console.log(`  - ${u.email}: ${u.name}`));

    // Penyaluran
    const penyaluran = await prisma.penyaluran_harian.count();
    const totalPenyaluran = await prisma.penyaluran_harian.aggregate({ _sum: { jumlah_normal: true } });
    console.log(`\nPenyaluran Harian: ${penyaluran} records`);
    console.log(`  Total qty: ${(totalPenyaluran._sum.jumlah_normal || 0).toLocaleString()} tabung`);

    // Orders
    const orders = await prisma.orders.count();
    const orderItems = await prisma.order_items.aggregate({ _sum: { qty: true } });
    console.log(`\nOrders: ${orders} pesanan`);
    console.log(`  Total qty: ${(orderItems._sum.qty || 0).toLocaleString()} tabung`);

    // Agen Orders
    const agenOrders = await prisma.agen_orders.count();
    const agenOrderQty = await prisma.agen_orders.aggregate({ _sum: { qty_ordered: true } });
    console.log(`\nAgen Orders: ${agenOrders} pesanan`);
    console.log(`  Total qty: ${(agenOrderQty._sum.qty_ordered || 0).toLocaleString()} tabung`);

    // Stock Balance
    const totalIn = await prisma.stock_histories.aggregate({
        where: { movement_type: 'MASUK' },
        _sum: { qty: true }
    });
    const totalOut = await prisma.stock_histories.aggregate({
        where: { movement_type: 'KELUAR' },
        _sum: { qty: true }
    });

    console.log('\n═══════════════════════════════════════');
    console.log('  📊 STOCK BALANCE');
    console.log('═══════════════════════════════════════');
    console.log(`  MASUK:  ${(totalIn._sum.qty || 0).toLocaleString()} tabung`);
    console.log(`  KELUAR: ${(totalOut._sum.qty || 0).toLocaleString()} tabung`);
    console.log(`  STOCK:  ${((totalIn._sum.qty || 0) - (totalOut._sum.qty || 0)).toLocaleString()} tabung`);

    // Check sync
    const penyaluranQty = totalPenyaluran._sum.jumlah_normal || 0;
    const ordersQty = orderItems._sum.qty || 0;
    const agenQty = agenOrderQty._sum.qty_ordered || 0;
    const outQty = totalOut._sum.qty || 0;

    console.log('\n═══════════════════════════════════════');
    console.log('  ✅ SYNC CHECK');
    console.log('═══════════════════════════════════════');
    console.log(`  Penyaluran = ${penyaluranQty}`);
    console.log(`  Orders     = ${ordersQty}`);
    console.log(`  Agen Orders= ${agenQty}`);
    console.log(`  Stock OUT  = ${outQty}`);
    
    if (penyaluranQty === ordersQty && ordersQty === agenQty && agenQty === outQty) {
        console.log('\n  ✅ ALL SYNCHRONIZED! ');
    } else {
        console.log('\n  ⚠️  NOT SYNCHRONIZED - Check data!');
    }

    // Pangkalan Stocks
    const pklStocks = await prisma.pangkalan_stocks.findMany({
        include: { pangkalans: { select: { code: true, name: true } } }
    });
    const pklMovements = await prisma.pangkalan_stock_movements.aggregate({
        _sum: { qty: true }
    });

    console.log('\n═══════════════════════════════════════');
    console.log('  📦 PANGKALAN STOCK');
    console.log('═══════════════════════════════════════');
    pklStocks.forEach(s => {
        console.log(`  ${s.pangkalans.code}: ${s.qty} tabung`);
    });
    console.log(`\n  Total Movements: ${(pklMovements._sum.qty || 0).toLocaleString()} tabung`);
    
    const totalPklStock = pklStocks.reduce((sum, s) => sum + s.qty, 0);
    console.log(`  Total Stock: ${totalPklStock.toLocaleString()} tabung`);
    
    if (totalPklStock === agenQty) {
        console.log('\n  ✅ PANGKALAN STOCK SYNCHRONIZED!');
    }
    console.log('═══════════════════════════════════════\n');

    await prisma.$disconnect();
}

check();
