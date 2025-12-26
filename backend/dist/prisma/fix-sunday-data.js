"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🔧 Fixing Sunday data in perencanaan_harian...\n');
    const year = 2025;
    const month = 12;
    const daysInMonth = new Date(year, month, 0).getDate();
    const sundayDates = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d, 12, 0, 0);
        if (date.getDay() === 0) {
            sundayDates.push(date);
        }
    }
    console.log('📅 Sundays in December 2025:', sundayDates.map(d => d.getDate()).join(', '));
    let totalDeleted = 0;
    for (const sundayDate of sundayDates) {
        const startOfDay = new Date(year, month - 1, sundayDate.getDate(), 0, 0, 0);
        const endOfDay = new Date(year, month - 1, sundayDate.getDate(), 23, 59, 59);
        const deleted = await prisma.perencanaan_harian.deleteMany({
            where: {
                tanggal: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            }
        });
        if (deleted.count > 0) {
            console.log(`  ✅ Deleted ${deleted.count} records from Dec ${sundayDate.getDate()} (Sunday)`);
            totalDeleted += deleted.count;
        }
    }
    console.log(`\n📊 Total deleted: ${totalDeleted} records`);
    console.log('\n🔍 Verifying cleanup...');
    for (const sundayDate of sundayDates) {
        const startOfDay = new Date(year, month - 1, sundayDate.getDate(), 0, 0, 0);
        const endOfDay = new Date(year, month - 1, sundayDate.getDate(), 23, 59, 59);
        const count = await prisma.perencanaan_harian.count({
            where: {
                tanggal: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            }
        });
        const status = count === 0 ? '✅' : `❌ (still has ${count})`;
        console.log(`  Dec ${sundayDate.getDate()}: ${status}`);
    }
    console.log('\n✨ Fix complete! Refresh the Perencanaan page to see changes.');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=fix-sunday-data.js.map