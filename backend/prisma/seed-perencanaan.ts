// Seed script for perencanaan_harian
// Run with: npx ts-node prisma/seed-perencanaan.ts
// 
// RULES:
// 1. Skip Sundays (hari Minggu tidak ada penyaluran)
// 2. Only seed up to TODAY (not future dates)
// 3. Total per day across all pangkalans = 600-800 units
// 4. Saturdays have less (50%)

import { PrismaClient, kondisi_type } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to check if a date is Sunday
function isSunday(date: Date): boolean {
    return date.getDay() === 0; // 0 = Sunday
}

// Helper to check if a date is Saturday
function isSaturday(date: Date): boolean {
    return date.getDay() === 6; // 6 = Saturday
}

async function main() {
    console.log('🌱 Seeding perencanaan_harian...');

    // Get all active pangkalans
    const pangkalans = await prisma.pangkalans.findMany({
        where: { is_active: true, deleted_at: null },
        select: { id: true, code: true, name: true, alokasi_bulanan: true },
    });

    if (pangkalans.length === 0) {
        console.log('❌ No pangkalans found. Please seed pangkalans first.');
        return;
    }

    const numPangkalans = pangkalans.length;
    console.log(`📋 Found ${numPangkalans} pangkalans`);

    // Current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const today = now.getDate(); // Current day of month

    console.log(`📅 Seeding for ${year}-${String(month + 1).padStart(2, '0')} (Days 1 to ${today}, skip Sundays)`);

    // Print calendar reference
    console.log('📆 December 2025 Sundays: 7, 14, 21, 28');

    // Clear existing data for this month first
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    await prisma.perencanaan_harian.deleteMany({
        where: { tanggal: { gte: startDate, lte: endDate } },
    });
    console.log('🗑️ Cleared existing data for this month');

    // Target: 600-800 units total per day across all pangkalans
    // Average = 700 units/day
    // Per pangkalan = 700 / numPangkalans
    const targetDailyTotal = 700;
    const basePerPangkalan = Math.floor(targetDailyTotal / numPangkalans);

    console.log(`🎯 Target: ~${targetDailyTotal} units/day total, ~${basePerPangkalan} per pangkalan`);

    let totalRecords = 0;

    // Seed data for each day
    for (let day = 1; day <= today; day++) {
        // Create date at noon to avoid timezone issues
        const date = new Date(year, month, day, 12, 0, 0);
        const dayOfWeek = date.getDay();
        const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][dayOfWeek];

        // Skip Sundays (dayOfWeek === 0)
        if (dayOfWeek === 0) {
            console.log(`  ⏭️ Day ${day} (${dayName}) - SKIPPED (Sunday)`);
            continue;
        }

        let dayTotal = 0;

        for (const pangkalan of pangkalans) {
            // Random variation ±20%
            const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
            let jumlah = Math.floor(basePerPangkalan * variation);

            // Saturday: less distribution (50%)
            if (dayOfWeek === 6) {
                jumlah = Math.floor(jumlah * 0.5);
            }

            // 10% chance of fakultatif allocation
            const kondisi: kondisi_type = Math.random() < 0.1 ? 'FAKULTATIF' : 'NORMAL';

            await prisma.perencanaan_harian.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    tanggal: date,
                    jumlah,
                    kondisi,
                    alokasi_bulan: pangkalan.alokasi_bulanan,
                },
            });

            dayTotal += jumlah;
            totalRecords++;
        }

        console.log(`  ✅ Day ${String(day).padStart(2, '0')} (${dayName}) - Total: ${dayTotal} units`);
    }

    console.log(`\n📊 Summary: ${totalRecords} records created`);
    console.log('✨ Perencanaan seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
