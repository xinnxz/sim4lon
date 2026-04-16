"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🔍 Testing date day-of-week detection for December 2025...\n');
    const testDates = [
        { day: 20, expected: 'Sat' },
        { day: 21, expected: 'Sun' },
        { day: 27, expected: 'Sat' },
        { day: 28, expected: 'Sun' },
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    console.log('📅 Date verification:');
    for (const t of testDates) {
        const date = new Date(2025, 11, t.day, 12, 0, 0);
        const dayOfWeek = date.getDay();
        const actualDay = dayNames[dayOfWeek];
        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;
        const status = actualDay === t.expected ? '✅' : '❌';
        console.log(`  ${status} Dec ${t.day}: ${actualDay} (expected: ${t.expected}) - dayOfWeek: ${dayOfWeek}, isSunday: ${isSunday}, isSaturday: ${isSaturday}`);
    }
    console.log('\n📊 Checking perencanaan_harian data for December Sundays (7, 14, 21, 28)...');
    const sundayDates = ['2025-12-07', '2025-12-14', '2025-12-21', '2025-12-28'];
    for (const dateStr of sundayDates) {
        const startOfDay = new Date(dateStr + 'T00:00:00');
        const endOfDay = new Date(dateStr + 'T23:59:59');
        const count = await prisma.perencanaan_harian.count({
            where: {
                tanggal: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            }
        });
        const status = count === 0 ? '✅ (correct - no data)' : `❌ (WRONG - has ${count} records)`;
        console.log(`  ${dateStr}: ${status}`);
    }
    console.log('\n✨ Test complete!');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=test-dates.js.map