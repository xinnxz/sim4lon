import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Check what dates exist in consumer_orders
    const result = await prisma.$queryRaw`
        SELECT 
            DATE(sale_date) as tanggal, 
            COUNT(*) as count 
        FROM consumer_orders 
        GROUP BY DATE(sale_date) 
        ORDER BY tanggal DESC 
        LIMIT 25
    `;

    console.log('📊 Dates in consumer_orders:');
    console.table(result);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
