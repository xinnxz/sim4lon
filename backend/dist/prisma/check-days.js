"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function check() {
    console.log('📅 Checking December 2025 last days...\n');
    const dates = [27, 28, 29, 30, 31];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const d of dates) {
        const start = new Date(2025, 11, d, 0, 0, 0);
        const end = new Date(2025, 11, d, 23, 59, 59);
        const count = await prisma.perencanaan_harian.count({
            where: { tanggal: { gte: start, lte: end } }
        });
        const dayName = dayNames[new Date(2025, 11, d).getDay()];
        const status = count === 0 ? '❌ EMPTY' : `✅ ${count} records`;
        console.log(`  Dec ${d} (${dayName}): ${status}`);
    }
    console.log('\n✨ Check complete!');
}
check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-days.js.map