// Seed script for penyaluran_harian - SAME data as perencanaan
// Run with: npx ts-node prisma/seed-penyaluran-match.ts
// RULES: Copy exactly from perencanaan, skip Sundays, only up to today

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Syncing penyaluran_harian from perencanaan_harian...');

    // Get current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    console.log(`📅 Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

    // Clear existing penyaluran data for this month
    await prisma.penyaluran_harian.deleteMany({
        where: { tanggal: { gte: startDate, lte: endDate } },
    });
    console.log('🗑️ Cleared existing penyaluran data for this month');

    // Get all perencanaan data for this month
    const perencanaanData = await prisma.perencanaan_harian.findMany({
        where: {
            tanggal: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: [{ pangkalan_id: 'asc' }, { tanggal: 'asc' }],
    });

    console.log(`📋 Found ${perencanaanData.length} perencanaan records to copy`);

    if (perencanaanData.length === 0) {
        console.log('❌ No perencanaan data found. Please run seed-perencanaan.ts first.');
        return;
    }

    // Copy to penyaluran
    let created = 0;

    for (const p of perencanaanData) {
        await prisma.penyaluran_harian.create({
            data: {
                pangkalan_id: p.pangkalan_id,
                tanggal: p.tanggal,
                jumlah_normal: p.jumlah_normal,
                jumlah_fakultatif: p.jumlah_fakultatif,
                tipe_pembayaran: 'CASHLESS',
            },
        });
        created++;
    }

    console.log(`✅ Created: ${created} penyaluran records`);
    console.log('✨ Penyaluran sync completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
