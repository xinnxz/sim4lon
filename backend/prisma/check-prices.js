const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    const products = await p.lpg_products.findMany({ where: { is_active: true } });
    console.log('\n=== LPG Products Pricing ===');
    products.forEach(i => {
        const cost = Number(i.cost_price);
        const sell = Number(i.selling_price);
        const margin = sell - cost;
        console.log(`${i.name} (${i.size_kg}kg): cost=${cost}, sell=${sell}, margin=${margin}`);
    });
}

main().then(() => p.$disconnect());
