"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function addBrightGasCan() {
    console.log('🌱 Adding Bright Gas 220gr (Can) to lpg_products...\n');
    const existing = await prisma.lpg_products.findFirst({
        where: {
            OR: [
                { name: { contains: 'Bright Gas', mode: 'insensitive' } },
                { size_kg: 0.22 },
            ]
        }
    });
    if (existing) {
        console.log(`⏩ Product similar to Bright Gas Can already exists: "${existing.name}"`);
    }
    else {
        const product = await prisma.lpg_products.create({
            data: {
                name: 'Bright Gas Can 220gr',
                size_kg: 0.22,
                category: 'NON_SUBSIDI',
                color: 'orange',
                description: 'Tabung Bright Gas portable ukuran mini untuk camping dan outdoor',
                selling_price: 15000,
                cost_price: 12000,
                is_active: false,
            }
        });
        console.log(`✅ Created "${product.name}" (${product.size_kg}kg) @ Rp ${product.selling_price?.toLocaleString('id-ID')}`);
    }
    console.log('\n📦 All Products in lpg_products:');
    const all = await prisma.lpg_products.findMany({ orderBy: { size_kg: 'asc' } });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    all.forEach(p => {
        const status = p.is_active ? '🟢 Aktif' : '⚪ Nonaktif';
        console.log(`${status} | ${p.name.padEnd(25)} | ${p.size_kg} kg | Rp ${p.selling_price?.toLocaleString('id-ID')}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total: ${all.length} products`);
}
addBrightGasCan()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed-bright-gas-can.js.map