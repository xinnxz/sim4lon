"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Syncing penyaluran_harian from perencanaan_harian...');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    console.log(`📅 Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
    await prisma.penyaluran_harian.deleteMany({
        where: { tanggal: { gte: startDate, lte: endDate } },
    });
    console.log('🗑️ Cleared existing penyaluran data for this month');
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
//# sourceMappingURL=seed-penyaluran-match.js.map