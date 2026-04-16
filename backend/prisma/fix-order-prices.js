/**
 * Fix order_items price_per_unit to use correct selling price from lpg_products
 */
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    console.log('\n=== Fixing Order Items Prices ===\n');
    
    // Get selling prices from lpg_products
    const products = await p.lpg_products.findMany({ where: { is_active: true } });
    
    const priceMap = {};
    products.forEach(pr => {
        const sizeKg = Number(pr.size_kg);
        const sellPrice = Number(pr.selling_price);
        
        // Map both formats
        if (sizeKg === 3) {
            priceMap['kg3'] = sellPrice;
            priceMap['3kg'] = sellPrice;
        } else if (sizeKg === 5.5) {
            priceMap['kg5'] = sellPrice;
            priceMap['5kg'] = sellPrice;
        } else if (sizeKg === 12) {
            priceMap['kg12'] = sellPrice;
            priceMap['12kg'] = sellPrice;
        } else if (sizeKg === 50) {
            priceMap['kg50'] = sellPrice;
            priceMap['50kg'] = sellPrice;
        } else if (sizeKg <= 0.5) {
            priceMap['gr220'] = sellPrice;
            priceMap['220gr'] = sellPrice;
        }
    });
    
    console.log('Price map:', priceMap);
    
    // Update all order_items with correct price
    const orderItems = await p.order_items.findMany();
    console.log(`\nFound ${orderItems.length} order items to check`);
    
    let updated = 0;
    for (const item of orderItems) {
        const correctPrice = priceMap[item.lpg_type];
        if (correctPrice && Number(item.price_per_unit) !== correctPrice) {
            await p.order_items.update({
                where: { id: item.id },
                data: { price_per_unit: correctPrice }
            });
            updated++;
        }
    }
    
    console.log(`Updated ${updated} order items with correct prices`);
    
    // Also update orders total_amount
    const orders = await p.orders.findMany({
        include: { order_items: true }
    });
    
    let ordersUpdated = 0;
    for (const order of orders) {
        const newTotal = order.order_items.reduce((sum, item) => {
            const price = priceMap[item.lpg_type] || Number(item.price_per_unit);
            return sum + (price * item.qty);
        }, 0);
        
        if (newTotal !== Number(order.total_amount)) {
            await p.orders.update({
                where: { id: order.id },
                data: { total_amount: newTotal }
            });
            ordersUpdated++;
        }
    }
    
    console.log(`Updated ${ordersUpdated} orders with correct total_amount`);
    console.log('\n✅ Done!');
}

main()
    .catch(console.error)
    .finally(() => p.$disconnect());
