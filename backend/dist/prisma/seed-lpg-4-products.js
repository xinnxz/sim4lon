"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function seedAdditionalProducts() {
    console.log('🌱 Adding 4 Additional LPG Products...\n');
    const products = [
        {
            name: 'LPG 12kg Non-Subsidi',
            size_kg: 12.0,
            category: 'NON_SUBSIDI',
            color: 'biru',
            description: 'Tabung LPG non-subsidi untuk rumah tangga menengah',
            selling_price: 180000,
            cost_price: 165000,
            is_active: false,
        },
        {
            name: 'Bright Gas 5.5kg',
            size_kg: 5.5,
            category: 'NON_SUBSIDI',
            color: 'pink',
            description: 'Tabung Bright Gas dengan valve double spindle, lebih aman',
            selling_price: 85000,
            cost_price: 78000,
            is_active: false,
        },
        {
            name: 'Bright Gas 12kg',
            size_kg: 12.0,
            category: 'NON_SUBSIDI',
            color: 'ungu',
            description: 'Tabung Bright Gas ukuran besar dengan valve double spindle',
            selling_price: 195000,
            cost_price: 180000,
            is_active: false,
        },
        {
            name: 'LPG 50kg Industri',
            size_kg: 50.0,
            category: 'NON_SUBSIDI',
            color: 'merah',
            description: 'Tabung LPG industri untuk restoran, hotel, dan pabrik',
            selling_price: 750000,
            cost_price: 700000,
            is_active: false,
        },
    ];
    let created = 0;
    let skipped = 0;
    for (const product of products) {
        const existing = await prisma.lpg_products.findFirst({
            where: {
                OR: [
                    { name: product.name },
                    { size_kg: product.size_kg },
                ]
            },
        });
        if (existing) {
            console.log(`⏩ Skipping "${product.name}" (already exists as: ${existing.name})`);
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
                selling_price: product.selling_price,
                cost_price: product.cost_price,
                is_active: product.is_active,
            },
        });
        console.log(`✅ Created "${result.name}" (${result.size_kg}kg) @ Rp ${result.selling_price?.toLocaleString('id-ID')} - ${result.is_active ? 'Aktif' : 'Nonaktif'}`);
        created++;
    }
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed complete!');
    console.log(`📊 Summary: ${created} created, ${skipped} skipped`);
    console.log('');
    console.log('ℹ️  Produk baru dibuat dengan status NONAKTIF.');
    console.log('   Aktifkan melalui modal "Kelola Produk LPG" di halaman Stok.');
}
seedAdditionalProducts()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed-lpg-4-products.js.map