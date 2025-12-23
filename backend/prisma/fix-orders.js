const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    // Update all DIKIRIM to DITERIMA
    const result = await prisma.agen_orders.updateMany({
        where: { status: 'DIKIRIM' },
        data: { status: 'DITERIMA' },
    });

    console.log(`Updated ${result.count} orders from DIKIRIM to DITERIMA`);
    
    await prisma.$disconnect();
}

fix();
