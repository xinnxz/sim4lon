/**
 * SEED: Penerimaan Stok Agen dari SPBE
 * 
 * Data penerimaan refill LPG dari SPBE mulai 1 Desember 2024
 * Rata-rata: 560 tabung per hari (fokus LPG 3kg)
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/seed-penerimaan.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Konfigurasi
const START_DATE = new Date(2025, 11, 1); // 1 Desember 2025
const END_DATE = new Date(); // Hari ini
const AVG_REFILL_PER_DAY = 560; // Rata-rata 560 tabung/hari
const SPBE_NAME = 'SPBE PT. PERTAMINA';

// Generate SO number (tanpa prefix SO)
function generateSO(date: Date, index: number): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}${String(index).padStart(3, '0')}`;
}

// Generate LO number (tanpa prefix LO)
function generateLO(date: Date, index: number): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}${String(index).padStart(3, '0')}`;
}

async function main() {
    console.log('📦 Seeding Penerimaan Stok dari SPBE...\n');
    console.log(`📅 Periode: 1 Desember 2025 - Sekarang`);
    console.log(`📊 Rata-rata: ${AVG_REFILL_PER_DAY} tabung/hari\n`);

    // Dapatkan lpg_product untuk LPG 3kg (Subsidi)
    const lpg3kg = await prisma.lpg_products.findFirst({
        where: { name: { contains: '3 kg' } }
    });

    if (!lpg3kg) {
        console.error('❌ LPG 3kg tidak ditemukan! Jalankan dulu seed-agen-stock.ts');
        return;
    }
    console.log(`✅ Menggunakan produk: ${lpg3kg.name} (ID: ${lpg3kg.id})\n`);

    // Hapus data penerimaan lama (jika ada)
    console.log('🧹 Membersihkan data penerimaan lama...');
    await prisma.penerimaan_stok.deleteMany();

    // Hapus stock_histories lama
    console.log('🧹 Membersihkan stock_histories lama...');
    await prisma.stock_histories.deleteMany();

    let totalDays = 0;
    let totalQty = 0;
    const currentDate = new Date(START_DATE);
    const admin = await prisma.users.findFirst({ where: { role: 'ADMIN' } });

    // Loop setiap hari dari 1 Desember sampai hari ini
    while (currentDate <= END_DATE) {
        // Skip hari Minggu (tidak ada pengiriman)
        if (currentDate.getDay() === 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        // Variasi qty: 450-670 tabung (around 560 avg)
        const variation = Math.floor(Math.random() * 220) - 110; // -110 to +110
        const qtyForDay = AVG_REFILL_PER_DAY + variation;
        const qtyKg = qtyForDay * 3; // LPG 3kg
        const soNumber = generateSO(currentDate, 1);

        // Buat data penerimaan
        await prisma.penerimaan_stok.create({
            data: {
                no_so: soNumber,
                no_lo: generateLO(currentDate, 1),
                nama_material: 'REFILL/ISI LPG @3KG (NET)', // Format standar SPBE
                qty_pcs: qtyForDay,
                qty_kg: qtyKg,
                tanggal: new Date(currentDate),
                sumber: SPBE_NAME,
            },
        });

        // Masukkan ke stock_histories dengan lpg_product_id
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: lpg3kg.id, // PENTING: Link ke produk!
                lpg_type: 'kg3',
                movement_type: 'MASUK',
                qty: qtyForDay,
                note: `Penerimaan dari ${SPBE_NAME} - SO: ${soNumber}`,
                recorded_by_user_id: admin?.id,
                timestamp: new Date(currentDate),
            },
        });

        totalDays++;
        totalQty += qtyForDay;

        // Progress setiap 5 hari
        if (totalDays % 5 === 0) {
            process.stdout.write('.');
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('  📦 PENERIMAAN STOK SELESAI!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Total hari operasional: ${totalDays}`);
    console.log(`  Total tabung diterima: ${totalQty.toLocaleString('id-ID')}`);
    console.log(`  Rata-rata per hari: ${Math.round(totalQty / totalDays)}`);
    console.log('═══════════════════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
