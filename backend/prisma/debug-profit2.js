const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    // Get lpg_products prices
    const products = await p.lpg_products.findMany({ where: { is_active: true } });
    console.log('\n=== LPG Products ===');
    const priceMap = {};
    products.forEach(pr => {
        const key = Number(pr.size_kg) === 3 ? '3kg' : 
                    Number(pr.size_kg) === 5.5 ? '5kg' :
                    Number(pr.size_kg) === 12 ? '12kg' :
                    Number(pr.size_kg) === 50 ? '50kg' :
                    Number(pr.size_kg) <= 0.5 ? '220gr' : 'other';
        priceMap[key] = { sell: Number(pr.selling_price), cost: Number(pr.cost_price) };
        console.log(`${pr.name}: sell=${pr.selling_price}, cost=${pr.cost_price}`);
    });
    
    // Get sample order items
    const orderItems = await p.order_items.findMany({
        take: 10,
        orderBy: { created_at: 'desc' }
    });
    
    console.log('\n=== Recent Order Items ===');
    orderItems.forEach(item => {
        const expectedSell = priceMap[item.lpg_type]?.sell || priceMap['3kg']?.sell || 0;
        const actualPrice = Number(item.price_per_unit);
        const match = actualPrice === expectedSell ? '✓' : `❌ expected ${expectedSell}`;
        console.log(`lpg_type: ${item.lpg_type}, price_per_unit: ${actualPrice}, qty: ${item.qty} ${match}`);
    });
    
    // Calculate manual profit for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0,0,0,0);
    
    const orders = await p.orders.findMany({
        where: { current_status: 'SELESAI', created_at: { gte: sevenDaysAgo } },
        include: { order_items: true }
    });
    
    let totalSales = 0;
    let totalCost = 0;
    
    console.log(`\n=== Manual Profit Calc (${orders.length} orders) ===`);
    orders.forEach(order => {
        order.order_items.forEach(item => {
            const sell = Number(item.price_per_unit) * item.qty;
            const costPerUnit = priceMap[item.lpg_type]?.cost || priceMap['3kg']?.cost || 0;
            const cost = costPerUnit * item.qty;
            totalSales += sell;
            totalCost += cost;
        });
    });
    
    console.log(`Total Sales: ${totalSales}`);
    console.log(`Total Cost: ${totalCost}`);
    console.log(`Profit: ${totalSales - totalCost}`);
}

main().then(() => p.$disconnect());
