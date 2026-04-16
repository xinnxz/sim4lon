/**
 * Seed Stock Data untuk Multiple Products
 * Run: npx ts-node --transpile-only prisma/seed-all-stock.ts
 * 
 * Script ini menambahkan stock movements untuk semua produk LPG dari 1-12 Januari 2026
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper untuk generate tanggal
function jan(day: number): Date {
    const date = new Date(2026, 0, day, 12, 0, 0);
    return date;
}

async function seedAllStock() {
    console.log('🌱 Seeding Stock Data untuk All Products...\n');

    // Get all active products
    const products = await prisma.lpg_products.findMany({
        where: { is_active: true },
        orderBy: { size_kg: 'asc' }
    });

    if (products.length === 0) {
        console.log('❌ Tidak ada produk! Jalankan seed-lpg-products.ts dulu.');
        return;
    }

    console.log(`📦 Found ${products.length} products:\n`);
    products.forEach(p => console.log(`   - ${p.name} (${p.size_kg}kg)`));
    console.log('');

    // Stock data per produk
    // Format: [day, qty_masuk, qty_keluar]
    const stockData: Record<string, [number, number, number][]> = {
        // Elpiji 3kg - stok utama
        'Elpiji 3kg': [
            [1, 300, 0],    // Penerimaan awal
            [2, 200, 50],   // Masuk 200, keluar 50
            [3, 0, 80],     // Keluar 80
            [4, 150, 60],   // Masuk 150, keluar 60
            [5, 0, 70],     // Keluar 70
            [6, 200, 55],   // Masuk 200, keluar 55
            [7, 0, 90],     // Keluar 90
            [8, 100, 45],   // Masuk 100, keluar 45
            [9, 0, 65],     // Keluar 65
            [10, 150, 50],  // Masuk 150, keluar 50
            [11, 0, 75],    // Keluar 75
            [12, 100, 60],  // Masuk 100, keluar 60
        ],
        // Elpiji 12kg - menengah
        'Elpiji 12kg': [
            [1, 50, 0],     // Penerimaan awal
            [2, 0, 5],
            [3, 20, 8],
            [5, 0, 6],
            [7, 30, 10],
            [9, 0, 7],
            [11, 20, 5],
            [12, 0, 8],
        ],
        // Bright Gas 5.5kg
        'Bright Gas 5.5kg': [
            [1, 30, 0],
            [3, 0, 4],
            [5, 15, 3],
            [7, 0, 5],
            [9, 20, 4],
            [11, 0, 6],
            [12, 10, 3],
        ],
        // Bright Gas 12kg
        'Bright Gas 12kg': [
            [1, 20, 0],
            [4, 0, 3],
            [6, 10, 2],
            [8, 0, 4],
            [10, 15, 3],
            [12, 0, 2],
        ],
        // Elpiji 50kg - industri (jarang)
        'Elpiji 50kg': [
            [1, 10, 0],
            [5, 0, 2],
            [8, 5, 1],
            [12, 0, 3],
        ],
    };

    let totalMasuk = 0;
    let totalKeluar = 0;

    for (const product of products) {
        const data = stockData[product.name];
        if (!data) {
            console.log(`⏩ Skipping "${product.name}" (no stock data defined)`);
            continue;
        }

        console.log(`\n📦 Processing "${product.name}"...`);

        for (const [day, masuk, keluar] of data) {
            const date = jan(day);

            // Stock MASUK
            if (masuk > 0) {
                await prisma.stock_histories.create({
                    data: {
                        lpg_product_id: product.id,
                        lpg_type: getSizeEnum(Number(product.size_kg)),
                        movement_type: 'MASUK',
                        qty: masuk,
                        note: `Penerimaan ${product.name}`,
                        timestamp: date,
                        created_at: date,
                    }
                });
                totalMasuk += masuk;
                console.log(`   ✅ ${day}/1: MASUK ${masuk}`);
            }

            // Stock KELUAR
            if (keluar > 0) {
                await prisma.stock_histories.create({
                    data: {
                        lpg_product_id: product.id,
                        lpg_type: getSizeEnum(Number(product.size_kg)),
                        movement_type: 'KELUAR',
                        qty: keluar,
                        note: `Penjualan ${product.name}`,
                        timestamp: date,
                        created_at: date,
                    }
                });
                totalKeluar += keluar;
                console.log(`   ✅ ${day}/1: KELUAR ${keluar}`);
            }
        }
    }

    console.log('\n🎉 Seed complete!');
    console.log(`📊 Summary: ${totalMasuk} MASUK, ${totalKeluar} KELUAR`);
}

// Helper: convert size_kg to lpg_type enum
function getSizeEnum(sizeKg: number): any {
    if (sizeKg === 3) return 'kg3';
    if (sizeKg === 5.5 || sizeKg === 5) return 'kg5';
    if (sizeKg === 12) return 'kg12';
    if (sizeKg === 50) return 'kg50';
    if (sizeKg < 1) return 'gr220';
    return 'kg3';
}

seedAllStock()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
