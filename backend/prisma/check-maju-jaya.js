const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    // Check pangkalan Maju Jaya
    const p = await prisma.pangkalans.findFirst({
        where: { name: { contains: 'Maju Jaya' } },
        select: { id: true, code: true, name: true }
    });
    
    console.log('\n=== PANGKALAN ===');
    console.log(`${p?.code}: ${p?.name}`);
    
    if (p) {
        console.log('\n=== STOCKS (lpg_type formats) ===');
        const stocks = await prisma.pangkalan_stocks.findMany({
            where: { pangkalan_id: p.id }
        });
        stocks.forEach(s => console.log(`  "${s.lpg_type}": ${s.qty} tabung`));
        
        console.log('\n=== PRICES (lpg_type formats, is_active) ===');
        const prices = await prisma.lpg_prices.findMany({
            where: { pangkalan_id: p.id }
        });
        prices.forEach(pr => {
            const status = pr.is_active ? '✅' : '❌';
            console.log(`  "${pr.lpg_type}": ${status}`);
        });
        
        console.log('\n=== FORMAT CHECK ===');
        const priceTypes = prices.filter(p => p.is_active).map(p => p.lpg_type);
        const stockTypes = stocks.map(s => s.lpg_type);
        console.log('Active price types:', priceTypes);
        console.log('Stock types:', stockTypes);
        console.log('Match:', priceTypes.filter(pt => stockTypes.includes(pt)));
    }
    
    await prisma.$disconnect();
}

check();
