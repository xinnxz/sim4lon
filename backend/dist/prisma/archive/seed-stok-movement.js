"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('📦 Seeding Stock Movement Data...\n');
    const admin = await prisma.users.findFirst({ where: { role: 'ADMIN' } });
    const lpgProducts = await prisma.lpg_products.findMany({
        where: { is_active: true },
        orderBy: { size_kg: 'asc' }
    });
    if (!admin) {
        console.error('❌ Admin user not found!');
        return;
    }
    const lpg3kg = lpgProducts.find(p => Number(p.size_kg) === 3);
    const lpg12kg = lpgProducts.find(p => Number(p.size_kg) === 12);
    const lpg50kg = lpgProducts.find(p => Number(p.size_kg) === 50);
    const brightGas = lpgProducts.find(p => Number(p.size_kg) < 1);
    console.log('Products found:');
    console.log(`  - 3kg: ${lpg3kg?.name || 'Not found'}`);
    console.log(`  - 12kg: ${lpg12kg?.name || 'Not found'}`);
    console.log(`  - 50kg: ${lpg50kg?.name || 'Not found'}`);
    console.log(`  - Bright Gas: ${brightGas?.name || 'Not found'}\n`);
    console.log('🧹 Cleaning up previous seed data...');
    const seedNotes = ['Seed: Penerimaan', 'Seed: Penyaluran', 'Initial stock seed'];
    for (const note of seedNotes) {
        await prisma.stock_histories.deleteMany({
            where: { note: { startsWith: note } }
        });
    }
    console.log('  ✓ Cleanup complete\n');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let totalMasuk = 0;
    let totalKeluar = 0;
    let movementCount = 0;
    console.log('📥 Creating initial stock entries...');
    const monthStart = new Date(currentYear, currentMonth, 1);
    monthStart.setHours(8, 0, 0);
    if (lpg3kg) {
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: lpg3kg.id,
                lpg_type: 'kg3',
                movement_type: 'MASUK',
                qty: 5000,
                note: 'Initial stock seed - Saldo awal bulan',
                recorded_by_user_id: admin.id,
                timestamp: monthStart,
            }
        });
        totalMasuk += 5000;
        movementCount++;
        console.log('  ✓ Initial 3kg: +5,000 tabung');
    }
    if (lpg12kg) {
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: lpg12kg.id,
                lpg_type: 'kg12',
                movement_type: 'MASUK',
                qty: 200,
                note: 'Initial stock seed - Saldo awal bulan',
                recorded_by_user_id: admin.id,
                timestamp: monthStart,
            }
        });
        totalMasuk += 200;
        movementCount++;
        console.log('  ✓ Initial 12kg: +200 tabung');
    }
    console.log('\n📥 Creating daily MASUK (penerimaan) entries...');
    const daysToSeed = now.getDate();
    for (let day = 1; day <= daysToSeed; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0)
            continue;
        if (Math.random() > 0.7)
            continue;
        date.setHours(6 + Math.floor(Math.random() * 4));
        date.setMinutes(Math.floor(Math.random() * 60));
        const qty = 200 + Math.floor(Math.random() * 300);
        if (lpg3kg) {
            await prisma.stock_histories.create({
                data: {
                    lpg_product_id: lpg3kg.id,
                    lpg_type: 'kg3',
                    movement_type: 'MASUK',
                    qty,
                    note: `Seed: Penerimaan dari SPBE - ${day}/${currentMonth + 1}`,
                    recorded_by_user_id: admin.id,
                    timestamp: date,
                }
            });
            totalMasuk += qty;
            movementCount++;
        }
        if (lpg12kg && Math.random() > 0.7) {
            const qty12 = 20 + Math.floor(Math.random() * 30);
            const date12 = new Date(date);
            date12.setMinutes(date12.getMinutes() + 30);
            await prisma.stock_histories.create({
                data: {
                    lpg_product_id: lpg12kg.id,
                    lpg_type: 'kg12',
                    movement_type: 'MASUK',
                    qty: qty12,
                    note: `Seed: Penerimaan 12kg dari SPBE`,
                    recorded_by_user_id: admin.id,
                    timestamp: date12,
                }
            });
            totalMasuk += qty12;
            movementCount++;
        }
    }
    console.log(`  ✓ Created MASUK entries for ${daysToSeed} days`);
    console.log('\n📤 Creating daily KELUAR (penyaluran) entries...');
    const pangkalans = await prisma.pangkalans.findMany({
        where: { is_active: true },
        select: { id: true, name: true }
    });
    for (let day = 1; day <= daysToSeed; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0)
            continue;
        const numPenyaluran = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numPenyaluran; i++) {
            if (Math.random() > 0.8)
                continue;
            const pkl = pangkalans[Math.floor(Math.random() * pangkalans.length)];
            const penyaluranDate = new Date(date);
            penyaluranDate.setHours(8 + Math.floor(Math.random() * 8));
            penyaluranDate.setMinutes(Math.floor(Math.random() * 60));
            const qty = 20 + Math.floor(Math.random() * 60);
            if (lpg3kg) {
                await prisma.stock_histories.create({
                    data: {
                        lpg_product_id: lpg3kg.id,
                        lpg_type: 'kg3',
                        movement_type: 'KELUAR',
                        qty,
                        note: `Seed: Penyaluran ke ${pkl.name}`,
                        recorded_by_user_id: admin.id,
                        timestamp: penyaluranDate,
                    }
                });
                totalKeluar += qty;
                movementCount++;
            }
        }
    }
    console.log(`  ✓ Created KELUAR entries for pangkalans`);
    if (brightGas) {
        console.log('\n🔥 Creating Bright Gas movements...');
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: brightGas.id,
                lpg_type: 'gr220',
                movement_type: 'MASUK',
                qty: 100,
                note: 'Initial stock seed - Bright Gas',
                recorded_by_user_id: admin.id,
                timestamp: monthStart,
            }
        });
        totalMasuk += 100;
        movementCount++;
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: brightGas.id,
                lpg_type: 'gr220',
                movement_type: 'KELUAR',
                qty: 75,
                note: 'Seed: Penyaluran Bright Gas ke warung',
                recorded_by_user_id: admin.id,
                timestamp: new Date(currentYear, currentMonth, 5, 10, 30),
            }
        });
        totalKeluar += 75;
        movementCount++;
        console.log('  ✓ Bright Gas movements added');
    }
    if (lpg50kg) {
        console.log('\n🛢️ Creating 50kg movements...');
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: lpg50kg.id,
                lpg_type: 'kg50',
                movement_type: 'MASUK',
                qty: 30,
                note: 'Initial stock seed - LPG 50kg',
                recorded_by_user_id: admin.id,
                timestamp: monthStart,
            }
        });
        totalMasuk += 30;
        movementCount++;
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: lpg50kg.id,
                lpg_type: 'kg50',
                movement_type: 'KELUAR',
                qty: 5,
                note: 'Seed: Penyaluran 50kg ke industri',
                recorded_by_user_id: admin.id,
                timestamp: new Date(currentYear, currentMonth, 3, 14, 0),
            }
        });
        totalKeluar += 5;
        movementCount++;
        console.log('  ✓ 50kg movements added');
    }
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Stock Movement Seed Complete!');
    console.log('═══════════════════════════════════════');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total MASUK: +${totalMasuk.toLocaleString()} tabung`);
    console.log(`   - Total KELUAR: -${totalKeluar.toLocaleString()} tabung`);
    console.log(`   - Perubahan Bersih: ${(totalMasuk - totalKeluar).toLocaleString()}`);
    console.log(`   - Jumlah Transaksi: ${movementCount}`);
    console.log('\n🎉 Refresh halaman Laporan > Tab Stok untuk melihat data!');
}
main()
    .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-stok-movement.js.map