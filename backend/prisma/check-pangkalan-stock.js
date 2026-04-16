const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    console.log('\n═══════════════════════════════════════');
    console.log('  PANGKALAN STOCKS');
    console.log('═══════════════════════════════════════');
    
    const stocks = await prisma.pangkalan_stocks.findMany({
        include: { pangkalans: { select: { code: true, name: true } } }
    });
    
    if (stocks.length === 0) {
        console.log('  (empty)');
    } else {
        stocks.forEach(s => {
            console.log(`  ${s.pangkalans?.code}: ${s.lpg_type} = ${s.qty} tabung`);
        });
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('  PANGKALAN STOCK MOVEMENTS (last 10)');
    console.log('═══════════════════════════════════════');
    
    const movements = await prisma.pangkalan_stock_movements.findMany({
        take: 10,
        orderBy: { movement_date: 'desc' },
        include: { pangkalans: { select: { code: true } } }
    });
    
    movements.forEach(m => {
        console.log(`  ${m.pangkalans?.code}: ${m.movement_type} ${m.qty} ${m.lpg_type} - ${m.source || ''}`);
    });
    
    await prisma.$disconnect();
}

check();
