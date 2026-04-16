"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const IMAGE_MAP = {
    0.22: '/images/products/bright-gas-220gr.png',
    3.0: '/images/products/lpg-3kg.png',
    5.5: '/images/products/lpg-5kg.png',
    12.0: '/images/products/lpg-12kg.png',
    50.0: '/images/products/lpg-50kg.png',
};
async function updateLpgImages() {
    console.log('🖼️  Updating LPG Product Images...\n');
    console.log('━'.repeat(60));
    const products = await prisma.lpg_products.findMany();
    let updated = 0;
    let skipped = 0;
    for (const product of products) {
        const imageUrl = IMAGE_MAP[Number(product.size_kg)];
        if (!imageUrl) {
            console.log(`⏩ SKIP: "${product.name}" - no image mapping for ${product.size_kg}kg`);
            skipped++;
            continue;
        }
        if (product.image_url === imageUrl) {
            console.log(`⏩ SKIP: "${product.name}" - already has correct image`);
            skipped++;
            continue;
        }
        await prisma.lpg_products.update({
            where: { id: product.id },
            data: { image_url: imageUrl }
        });
        console.log(`✅ UPDATE: "${product.name}" → ${imageUrl}`);
        updated++;
    }
    console.log('━'.repeat(60));
    console.log('');
    console.log('📊 SUMMARY:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏩ Skipped: ${skipped}`);
    console.log('');
    const all = await prisma.lpg_products.findMany({ orderBy: { size_kg: 'asc' } });
    console.log('📦 PRODUCTS WITH IMAGES:');
    console.log('━'.repeat(60));
    all.forEach((p, i) => {
        const hasImage = p.image_url ? '🖼️' : '❌';
        console.log(`   ${i + 1}. ${hasImage} ${p.name.padEnd(25)} | ${p.image_url || 'NO IMAGE'}`);
    });
    console.log('━'.repeat(60));
    console.log(`   Total: ${all.length} products\n`);
}
updateLpgImages()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=update-lpg-images.js.map