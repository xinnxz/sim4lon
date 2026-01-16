"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const LPG_PRODUCTS = [
    {
        name: 'Bright Gas Can 220gr',
        size_kg: 0.22,
        category: 'NON_SUBSIDI',
        color: 'orange',
        description: 'Tabung Bright Gas portable untuk camping dan outdoor',
        selling_price: 15000,
        cost_price: 12000,
        is_active: false,
    },
    {
        name: 'LPG 3kg Subsidi',
        size_kg: 3.0,
        category: 'SUBSIDI',
        color: 'hijau',
        description: 'Tabung LPG subsidi pemerintah untuk rumah tangga miskin dan usaha mikro',
        selling_price: 18000,
        cost_price: 16000,
        is_active: true,
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
async function seedLpgProducts() {
    console.log('🌱 Seeding LPG Products...\n');
    console.log('━'.repeat(60));
    let created = 0;
    let skipped = 0;
    for (const product of LPG_PRODUCTS) {
        const existing = await prisma.lpg_products.findFirst({
            where: { size_kg: product.size_kg }
        });
        if (existing) {
            console.log(`⏩ SKIP: "${product.name}" (${product.size_kg}kg sudah ada sebagai "${existing.name}")`);
            skipped++;
            continue;
        }
        const result = await prisma.lpg_products.create({
            data: product,
        });
        const status = result.is_active ? '🟢 AKTIF' : '⚪ NONAKTIF';
        console.log(`✅ CREATE: "${result.name}" (${result.size_kg}kg) @ Rp ${result.selling_price?.toLocaleString('id-ID')} - ${status}`);
        created++;
    }
    console.log('━'.repeat(60));
    console.log('');
    console.log('📊 SUMMARY:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏩ Skipped: ${skipped}`);
    console.log('');
    const all = await prisma.lpg_products.findMany({ orderBy: { size_kg: 'asc' } });
    console.log('📦 ALL PRODUCTS IN DATABASE:');
    console.log('━'.repeat(60));
    all.forEach((p, i) => {
        const status = p.is_active ? '🟢' : '⚪';
        console.log(`   ${i + 1}. ${status} ${p.name.padEnd(25)} | ${String(p.size_kg).padStart(5)} kg | Rp ${p.selling_price?.toLocaleString('id-ID')}`);
    });
    console.log('━'.repeat(60));
    console.log(`   Total: ${all.length} products\n`);
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