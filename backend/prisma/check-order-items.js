const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    // Get recent order items
    const orders = await p.orders.findMany({
        where: { current_status: 'SELESAI' },
        include: { order_items: true },
        take: 3,
        orderBy: { created_at: 'desc' }
    });
    
    console.log('\n=== Order Items Analysis ===');
    for (const order of orders) {
        console.log(`\nOrder ${order.order_number}:`);
        for (const item of order.order_items) {
            console.log(`  lpg_type: "${item.lpg_type}", qty: ${item.qty}, price_per_unit: ${item.price_per_unit}`);
        }
    }
    
    // Check unique lpg_types in order_items
    const types = await p.$queryRaw`SELECT DISTINCT lpg_type FROM order_items`;
    console.log('\n=== Unique lpg_types in order_items ===');
    console.log(types);
}

main().then(() => p.$disconnect());
