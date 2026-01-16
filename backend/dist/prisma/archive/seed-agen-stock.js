"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🛢️  Seeding Agen LPG Stock...\n');
    const lpgProducts = [
        {
            name: 'Bright Gas Can 220gr',
            size_kg: 0.22,
            category: 'NON_SUBSIDI',
            color: 'orange',
            brand: 'Bright Gas',
            selling_price: 20000,
            cost_price: 18000,
        },
        {
            name: 'LPG 3 kg (Subsidi)',
            size_kg: 3.00,
            category: 'SUBSIDI',
            color: 'hijau',
            brand: 'Elpiji',
            selling_price: 22000,
            cost_price: 18500,
        },
        {
            name: 'LPG 5.5 kg',
            size_kg: 5.50,
            category: 'NON_SUBSIDI',
            color: 'pink',
            brand: 'Bright Gas',
            selling_price: 70000,
            cost_price: 62000,
        },
        {
            name: 'LPG 12 kg',
            size_kg: 12.00,
            category: 'NON_SUBSIDI',
            color: 'biru',
            brand: 'Elpiji',
            selling_price: 175000,
            cost_price: 150000,
        },
        {
            name: 'LPG 50 kg',
            size_kg: 50.00,
            category: 'NON_SUBSIDI',
            color: 'biru',
            brand: 'Elpiji',
            selling_price: 700000,
            cost_price: 600000,
        },
    ];
    for (const product of lpgProducts) {
        const existing = await prisma.lpg_products.findFirst({
            where: { name: product.name },
        });
        if (existing) {
            console.log(`⏭️  Skip: ${product.name} (sudah ada)`);
            continue;
        }
        await prisma.lpg_products.create({
            data: {
                name: product.name,
                size_kg: product.size_kg,
                category: product.category,
                color: product.color,
                brand: product.brand,
                selling_price: product.selling_price,
                cost_price: product.cost_price,
                is_active: true,
            },
        });
        console.log(`✅ Created: ${product.name}`);
    }
    console.log('\n═══════════════════════════════════════');
    console.log('  🛢️  AGEN LPG STOCK READY!');
    console.log('═══════════════════════════════════════');
    const allProducts = await prisma.lpg_products.findMany({
        select: { name: true, size_kg: true, selling_price: true },
        orderBy: { size_kg: 'asc' },
    });
    console.log('\nProduk LPG:');
    for (const p of allProducts) {
        console.log(`   ${p.name} - Rp ${Number(p.selling_price).toLocaleString('id-ID')}`);
    }
    console.log('═══════════════════════════════════════\n');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-agen-stock.js.map