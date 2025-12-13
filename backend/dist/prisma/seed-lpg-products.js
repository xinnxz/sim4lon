"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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
        {
            name: 'Elpiji 50kg',
            size_kg: 50.0,
            category: 'NON_SUBSIDI',
            color: 'biru',
            description: 'Tabung LPG industri untuk restoran, hotel, dan pabrik',
            prices: [
                { label: 'Harga Industri', price: 750000, is_default: true },
                { label: 'Harga Kontrak', price: 720000, is_default: false },
            ],
        },
    ];
    let created = 0;
    let skipped = 0;
    for (const product of products) {
        const existing = await prisma.lpg_products.findFirst({
            where: { name: product.name },
        });
        if (existing) {
            console.log(`⏩ Skipping "${product.name}" (already exists)`);
            skipped++;
            continue;
        }
        const result = await prisma.lpg_products.create({
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
        console.log(`✅ Created "${result.name}" with ${result.prices.length} price(s)`);
        created++;
    }
    console.log('');
    console.log('🎉 Seed complete!');
    console.log(`📊 Summary: ${created} created, ${skipped} skipped`);
}
seedLpgProducts()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed-lpg-products.js.map