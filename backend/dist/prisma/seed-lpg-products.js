"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedLpgProducts() {
    console.log('🌱 Seeding LPG Products...');
    const products = [
        {
            name: 'Elpiji 3kg',
            size_kg: 3.0,
            category: 'SUBSIDI',
            color: 'hijau',
            description: 'Tabung LPG subsidi pemerintah untuk rumah tangga miskin dan usaha mikro',
            prices: [
                { label: 'HET (Harga Eceran Tertinggi)', price: 18000, is_default: true },
            ],
        },
        {
            name: 'Elpiji 12kg',
            size_kg: 12.0,
            category: 'NON_SUBSIDI',
            color: 'biru',
            description: 'Tabung LPG non-subsidi untuk rumah tangga menengah',
            prices: [
                { label: 'Harga Retail', price: 180000, is_default: true },
                { label: 'Harga Grosir', price: 175000, is_default: false },
            ],
        },
        {
            name: 'Bright Gas 5.5kg',
            size_kg: 5.5,
            category: 'NON_SUBSIDI',
            color: 'pink',
            description: 'Tabung Bright Gas dengan valve double spindle, lebih aman',
            prices: [
                { label: 'Harga Retail', price: 85000, is_default: true },
            ],
        },
        {
            name: 'Bright Gas 12kg',
            size_kg: 12.0,
            category: 'NON_SUBSIDI',
            color: 'ungu',
            description: 'Tabung Bright Gas ukuran besar dengan valve double spindle',
            prices: [
                { label: 'Harga Retail', price: 195000, is_default: true },
                { label: 'Harga UMKM', price: 190000, is_default: false },
            ],
        },
    ];
    for (const product of products) {
        const existing = await prisma.lpg_products.findFirst({
            where: { name: product.name },
        });
        if (existing) {
            console.log(`⏭️  Skipping "${product.name}" (already exists)`);
            continue;
        }
        const created = await prisma.lpg_products.create({
            data: {
                name: product.name,
                size_kg: product.size_kg,
                category: product.category,
                color: product.color,
                description: product.description,
                prices: {
                    create: product.prices,
                },
            },
            include: { prices: true },
        });
        console.log(`✅ Created "${created.name}" with ${created.prices.length} price(s)`);
    }
    console.log('🎉 Seeding complete!');
}
seedLpgProducts()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-lpg-products.js.map