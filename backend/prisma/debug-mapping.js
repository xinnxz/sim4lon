const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    // Check order_items lpg_type values
    const items = await p.order_items.findMany({
        take: 10,
        select: { lpg_type: true, price_per_unit: true },
    });
    console.log('\n=== Order Items lpg_type ===');
    const types = [...new Set(items.map(i => i.lpg_type))];
    types.forEach(t => console.log(`  lpg_type: "${t}"`));

    // Check lpg_products size_kg
    const products = await p.lpg_products.findMany({
        where: { is_active: true },
        select: { name: true, size_kg: true, cost_price: true },
    });
    console.log('\n=== LPG Products ===');
    products.forEach(pr => console.log(`  ${pr.name} - size_kg: ${pr.size_kg}, cost: ${pr.cost_price}`));

    // Check if mapping works
    console.log('\n=== Mapping Check ===');
    const costPriceMap = {};
    products.forEach(pr => {
        const sizeKg = Number(pr.size_kg);
        const cost = Number(pr.cost_price) || 0;
        if (sizeKg === 3) {
            costPriceMap['kg3'] = cost;
            costPriceMap['3kg'] = cost;
        } else if (sizeKg === 12) {
            costPriceMap['kg12'] = cost;
            costPriceMap['12kg'] = cost;
        } else if (sizeKg === 50) {
            costPriceMap['kg50'] = cost;
            costPriceMap['50kg'] = cost;
        }
    });
    console.log('Cost Price Map:', costPriceMap);
    
    // Check for a specific order lpg_type
    console.log('\n=== Sample lookup ===');
    items.forEach(i => {
        const cost = costPriceMap[i.lpg_type] || 0;
        console.log(`  ${i.lpg_type}: price=${i.price_per_unit}, cost=${cost}, profit=${Number(i.price_per_unit)-cost}`);
    });
}

main().then(() => p.$disconnect());
