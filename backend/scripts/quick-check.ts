import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Direct count
    const total = await prisma.consumer_orders.count();
    console.log('Total orders:', total);

    // Get some samples
    const samples = await prisma.consumer_orders.findMany({
        take: 20,
        orderBy: { sale_date: 'asc' },
        select: { sale_date: true }
    });

    console.log('Sample dates (oldest first):');
    samples.forEach((s, i) => console.log(`${i + 1}. ${s.sale_date.toISOString()}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
