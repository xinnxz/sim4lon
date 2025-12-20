"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function isSunday(date) {
    return date.getDay() === 0;
}
function isSaturday(date) {
    return date.getDay() === 6;
}
async function main() {
    console.log('🌱 Seeding perencanaan_harian...');
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
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    console.log(`📅 Seeding for ${year}-${String(month + 1).padStart(2, '0')} (Days 1 to ${today}, skip Sundays)`);
    console.log('📆 December 2025 Sundays: 7, 14, 21, 28');
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    await prisma.perencanaan_harian.deleteMany({
        where: { tanggal: { gte: startDate, lte: endDate } },
    });
    console.log('🗑️ Cleared existing data for this month');
    const targetDailyTotal = 700;
    const basePerPangkalan = Math.floor(targetDailyTotal / numPangkalans);
    console.log(`🎯 Target: ~${targetDailyTotal} units/day total, ~${basePerPangkalan} per pangkalan`);
    let totalRecords = 0;
    for (let day = 1; day <= today; day++) {
        const date = new Date(year, month, day, 12, 0, 0);
        const dayOfWeek = date.getDay();
        const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][dayOfWeek];
        if (dayOfWeek === 0) {
            console.log(`  ⏭️ Day ${day} (${dayName}) - SKIPPED (Sunday)`);
            continue;
        }
        let dayTotal = 0;
        for (const pangkalan of pangkalans) {
            const variation = 0.8 + Math.random() * 0.4;
            let jumlah = Math.floor(basePerPangkalan * variation);
            if (dayOfWeek === 6) {
                jumlah = Math.floor(jumlah * 0.5);
            }
            const isFakultatif = Math.random() < 0.1;
            const jumlahNormal = isFakultatif ? 0 : jumlah;
            const jumlahFakultatif = isFakultatif ? jumlah : 0;
            await prisma.perencanaan_harian.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    tanggal: date,
                    jumlah_normal: jumlahNormal,
                    jumlah_fakultatif: jumlahFakultatif,
                    alokasi_bulan: pangkalan.alokasi_bulanan,
                    lpg_type: 'kg3',
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
//# sourceMappingURL=seed-perencanaan.js.map