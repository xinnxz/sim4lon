// Script to delete perencanaan data on Sundays and re-run seed
// Run with: npx ts-node prisma/fix-sunday-data.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing Sunday data in perencanaan_harian...\n');

    // Get all December 2025 dates that are Sundays
    const year = 2025;
    const month = 12;
    const daysInMonth = new Date(year, month, 0).getDate();

    const sundayDates: Date[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d, 12, 0, 0);
        if (date.getDay() === 0) { // Sunday
            sundayDates.push(date);
        }
    }

    console.log('📅 Sundays in December 2025:', sundayDates.map(d => d.getDate()).join(', '));

    // Delete all perencanaan_harian entries on Sundays
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

    // Verify cleanup
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
