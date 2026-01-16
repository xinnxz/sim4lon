/**
 * Seed All LPG Products (5 Products)
 * Run: npx ts-node --transpile-only prisma/seed-lpg-products.ts
 * 
 * Menambahkan 5 jenis produk LPG ke tabel `lpg_products`:
 * 1. Bright Gas Can 220gr (Non-Subsidi) - Portable
 * 2. LPG 3kg Subsidi - Rumah tangga miskin
 * 3. Bright Gas 5.5kg (Non-Subsidi) - Double spindle valve
 * 4. LPG 12kg Non-Subsidi - Rumah tangga menengah
 * 5. LPG 50kg Industri - Restoran, hotel, pabrik
 * 
 * Catatan:
 * - Produk yang sudah ada akan di-skip (berdasarkan size_kg)
 * - Hanya LPG 3kg yang dibuat aktif, sisanya nonaktif
 * - Aktifkan produk lain via modal Kelola Produk di halaman Stok LPG
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 5 Produk LPG Standard
const LPG_PRODUCTS = [
    {
        name: 'Bright Gas Can 220gr',
        size_kg: 0.22,
        category: 'NON_SUBSIDI' as const,
        color: 'orange',
        description: 'Tabung Bright Gas portable untuk camping dan outdoor',
        selling_price: 15000,
        cost_price: 12000,
        is_active: false,
    },
    {
        name: 'LPG 3kg Subsidi',
        size_kg: 3.0,
        category: 'SUBSIDI' as const,
        color: 'hijau',
        description: 'Tabung LPG subsidi pemerintah untuk rumah tangga miskin dan usaha mikro',
        selling_price: 18000,
        cost_price: 16000,
        is_active: true, // Satu-satunya yang aktif by default
    },
    {
        name: 'Bright Gas 5.5kg',
        size_kg: 5.5,
        category: 'NON_SUBSIDI' as const,
        color: 'pink',
        description: 'Tabung Bright Gas dengan valve double spindle, lebih aman',
        selling_price: 85000,
        cost_price: 78000,
        is_active: false,
    },
    {
        name: 'LPG 12kg Non-Subsidi',
        size_kg: 12.0,
        category: 'NON_SUBSIDI' as const,
        color: 'biru',
        description: 'Tabung LPG non-subsidi untuk rumah tangga menengah',
        selling_price: 180000,
        cost_price: 165000,
        is_active: false,
    },
    {
        name: 'LPG 50kg Industri',
        size_kg: 50.0,
        category: 'NON_SUBSIDI' as const,
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
        // Check if product exists by size_kg (unique identifier)
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

    // Show final state
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
