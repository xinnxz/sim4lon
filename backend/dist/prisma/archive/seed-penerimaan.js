"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const START_DATE = new Date(2025, 11, 1);
const END_DATE = new Date();
const AVG_REFILL_PER_DAY = 560;
const SPBE_NAME = 'SPBE PT. PERTAMINA';
function generateSO(date, index) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}${String(index).padStart(3, '0')}`;
}
function generateLO(date, index) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}${String(index).padStart(3, '0')}`;
}
async function main() {
    console.log('📦 Seeding Penerimaan Stok dari SPBE...\n');
    console.log(`📅 Periode: 1 Desember 2025 - Sekarang`);
    console.log(`📊 Rata-rata: ${AVG_REFILL_PER_DAY} tabung/hari\n`);
    const lpg3kg = await prisma.lpg_products.findFirst({
        where: { name: { contains: '3 kg' } }
    });
    if (!lpg3kg) {
        console.error('❌ LPG 3kg tidak ditemukan! Jalankan dulu seed-agen-stock.ts');
        return;
    }
    console.log(`✅ Menggunakan produk: ${lpg3kg.name} (ID: ${lpg3kg.id})\n`);
    console.log('🧹 Membersihkan data penerimaan lama...');
    await prisma.penerimaan_stok.deleteMany();
    console.log('🧹 Membersihkan stock_histories lama...');
    await prisma.stock_histories.deleteMany();
    let totalDays = 0;
    let totalQty = 0;
    const currentDate = new Date(START_DATE);
    const admin = await prisma.users.findFirst({ where: { role: 'ADMIN' } });
    while (currentDate <= END_DATE) {
        if (currentDate.getDay() === 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }
        const variation = Math.floor(Math.random() * 220) - 110;
        const qtyForDay = AVG_REFILL_PER_DAY + variation;
        const qtyKg = qtyForDay * 3;
        const soNumber = generateSO(currentDate, 1);
        await prisma.penerimaan_stok.create({
            data: {
                no_so: soNumber,
                no_lo: generateLO(currentDate, 1),
                nama_material: 'REFILL/ISI LPG @3KG (NET)',
                qty_pcs: qtyForDay,
                qty_kg: qtyKg,
                tanggal: new Date(currentDate),
                sumber: SPBE_NAME,
            },
        });
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: lpg3kg.id,
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
//# sourceMappingURL=seed-penerimaan.js.map