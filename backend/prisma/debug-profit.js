/**
 * Debug Profit Chart - Check why profit shows 0
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('\n=== DEBUG PROFIT CHART ===\n');
    
    // 1. Check if there are SELESAI orders in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const completedOrders = await prisma.orders.findMany({
        where: {
            current_status: 'SELESAI',
            created_at: { gte: sevenDaysAgo }
        },
        include: { order_items: true },
        take: 5
    });
    
    console.log('Completed orders (SELESAI) in last 7 days:', completedOrders.length);
    
    // 2. Check order statuses distribution
    const statusCounts = await prisma.orders.groupBy({
        by: ['current_status'],
        _count: { id: true }
    });
    console.log('\nOrder status distribution:');
    statusCounts.forEach(s => console.log(`  ${s.current_status}: ${s._count.id}`));
    
    // 3. Check lpg_products cost_price
    const products = await prisma.lpg_products.findMany({
        where: { is_active: true },
        select: { name: true, size_kg: true, cost_price: true, selling_price: true }
    });
    console.log('\nLPG Products with prices:');
    products.forEach(p => {
        console.log(`  ${p.name} (${p.size_kg}kg): cost=${p.cost_price}, sell=${p.selling_price}`);
    });
    
    // 4. Check if order_items have lpg_type
    if (completedOrders.length > 0) {
        console.log('\nFirst completed order items:');
        completedOrders[0].order_items.forEach(item => {
            console.log(`  lpg_type: ${item.lpg_type}, qty: ${item.qty}, price: ${item.price_per_unit}`);
        });
    }
    
    // 5. Calculate profit for one order manually
    if (completedOrders.length > 0 && completedOrders[0].order_items.length > 0) {
        const order = completedOrders[0];
        let totalSales = 0;
        let totalCost = 0;
        
        for (const item of order.order_items) {
            const sellingPrice = Number(item.price_per_unit) || 0;
            // Find matching product by size
            const product = products.find(p => {
                const size = Number(p.size_kg);
                if (item.lpg_type === 'kg3') return size === 3;
                if (item.lpg_type === 'kg5') return size === 5.5;
                if (item.lpg_type === 'kg12') return size === 12;
                if (item.lpg_type === 'kg50') return size === 50;
                if (item.lpg_type === 'gr220') return size === 0.22;
                return false;
            });
            const costPrice = product ? Number(product.cost_price) || 0 : 0;
            const qty = item.qty || 0;
            
            console.log(`\n  Item: ${item.lpg_type}`);
            console.log(`    Selling price: ${sellingPrice} x ${qty} = ${sellingPrice * qty}`);
            console.log(`    Cost price: ${costPrice} x ${qty} = ${costPrice * qty}`);
            console.log(`    Profit: ${(sellingPrice - costPrice) * qty}`);
            
            totalSales += sellingPrice * qty;
            totalCost += costPrice * qty;
        }
        
        console.log(`\n  Order Total: Sales=${totalSales}, Cost=${totalCost}, Profit=${totalSales - totalCost}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
