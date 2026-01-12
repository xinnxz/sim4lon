// ============================================================
// SEED DATA AKURAT - Sesuai Data Pertamina Januari 2026
// ============================================================
// Jalankan: npx prisma db seed
//
// PENTING: Script ini akan HAPUS data lama dulu (kecuali users)
// kemudian insert data baru yang sinkron
// ============================================================

import 'dotenv/config';
import { PrismaClient, lpg_type, stock_movement_type, status_pesanan, payment_method } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper: Create date for January 2026
// Set time to 12:00 noon to avoid timezone shift to previous day
const jan = (day: number) => new Date(2026, 0, day, 7, 0, 0);

// ============================================================
// DATA DARI SCREENSHOT - In Out Agen (Image 1)
// ============================================================
// Data dari screenshot In Out Agen (Image 2 - yang benar)
// Formula: Stok Akhir = Stok Awal + Penerimaan - Penyaluran
const inOutAgen = [
    // Sesuai screenshot Pertamina
    { day: 1, stokAwal: 0, penerimaan: 560, penyaluran: 0, stokAkhir: 560 },
    { day: 2, stokAwal: 560, penerimaan: 560, penyaluran: 562, stokAkhir: 558 },
    { day: 3, stokAwal: 558, penerimaan: 560, penyaluran: 334, stokAkhir: 784 },
    { day: 4, stokAwal: 784, penerimaan: 0, penyaluran: 0, stokAkhir: 784 },
    { day: 5, stokAwal: 784, penerimaan: 0, penyaluran: 0, stokAkhir: 784 },
    { day: 6, stokAwal: 784, penerimaan: 1120, penyaluran: 0, stokAkhir: 1904 },
    { day: 7, stokAwal: 1904, penerimaan: 560, penyaluran: 1050, stokAkhir: 1414 },
    { day: 8, stokAwal: 1414, penerimaan: 560, penyaluran: 927, stokAkhir: 1047 },
    { day: 9, stokAwal: 1047, penerimaan: 560, penyaluran: 1071, stokAkhir: 536 },
    { day: 10, stokAwal: 536, penerimaan: 1120, penyaluran: 802, stokAkhir: 854 },
    { day: 11, stokAwal: 854, penerimaan: 0, penyaluran: 0, stokAkhir: 854 },
];

// ============================================================
// DATA PENERIMAAN - SEMUA JANUARI 2026
// ============================================================
const penerimaanData = [
    { tanggal: jan(1), no_so: '0002544788', no_lo: '8182906106', qty: 560 }, // 01/01/2026
    { tanggal: jan(2), no_so: '0002595522', no_lo: '8182902188', qty: 560 }, // 02/01/2026
    { tanggal: jan(3), no_so: '0002595522', no_lo: '8183107411', qty: 560 }, // 03/01/2026
    { tanggal: jan(6), no_so: '0002595522', no_lo: '8183106129', qty: 560 }, // 06/01/2026
    { tanggal: jan(6), no_so: '0002595522', no_lo: '8183106130', qty: 560 }, // 06/01/2026 (2x = 1120)
    { tanggal: jan(7), no_so: '0002595522', no_lo: '8183187016', qty: 560 }, // 07/01/2026
    { tanggal: jan(8), no_so: '0002595522', no_lo: '8183802171', qty: 560 }, // 08/01/2026
    { tanggal: jan(9), no_so: '0002595522', no_lo: '8183802172', qty: 560 }, // 09/01/2026
    { tanggal: jan(10), no_so: '0002595522', no_lo: '8183404851', qty: 560 }, // 10/01/2026
    { tanggal: jan(10), no_so: '0002595522', no_lo: '8183404852', qty: 560 }, // 10/01/2026 (2x = 1120)
];

// ============================================================
// DATA PENYALURAN PER PANGKALAN (sesuai screenshot)
// Setiap entry dengan qty > 0 = 1 pesanan
// ============================================================
const penyaluranPerPangkalan = [
    // Tgl 02: 6 pangkalan, Tgl 03: 3 pangkalan, Tgl 07: 4 pangkalan
    // Tgl 08: 7 pangkalan, Tgl 09: 7 pangkalan, Tgl 10: 7 pangkalan
    { code: '343269997904002', name: 'AGUS', days: { 2: 100, 3: 100, 8: 150, 9: 150, 10: 102 } },
    { code: '343262997904008', name: 'ASEP', days: { 2: 100, 3: 100, 8: 150, 9: 150, 10: 150 } },
    { code: '343262997904002', name: 'DANG DANG', days: { 2: 100, 3: 134, 8: 150, 9: 150, 10: 150 } },
    { code: '343262997904006', name: 'HERMAWAN SUTISNA', days: { 2: 112, 7: 350, 8: 150, 9: 150, 10: 100 } },
    { code: '343269997904001', name: 'M. DIAN SUTISNA', days: { 2: 100, 7: 350, 8: 127, 9: 161, 10: 100 } },
    { code: '343291199904001', name: 'MIMAH SITI ROHMAH', days: { 2: 50, 7: 350, 8: 100, 9: 160, 10: 100 } },
    { code: '343262997904009', name: 'NAZRIL MUHAMMAD ILHAM', days: { 8: 100, 9: 150, 10: 100 } },
];

// Hitung total per hari dari data di atas
function getTotalPenyaluranHari(day: number): number {
    return penyaluranPerPangkalan.reduce((sum, p) => sum + (p.days[day] || 0), 0);
}

async function main() {
    console.log('🌱 Starting ACCURATE seed...');
    console.log('');

    // ============================================================
    // 0. DELETE EXISTING DATA (kecuali users)
    // ============================================================
    console.log('🗑️ Deleting existing data (preserving users)...');

    await prisma.activity_logs.deleteMany({});
    await prisma.timeline_tracks.deleteMany({});
    await prisma.payment_records.deleteMany({});
    await prisma.order_payment_details.deleteMany({});
    await prisma.order_items.deleteMany({});
    await prisma.invoices.deleteMany({});
    await prisma.orders.deleteMany({});
    await prisma.stock_histories.deleteMany({});
    await prisma.consumer_orders.deleteMany({});
    await prisma.consumers.deleteMany({});
    await prisma.pangkalan_stock_movements.deleteMany({});
    await prisma.pangkalan_stocks.deleteMany({});
    await prisma.lpg_prices.deleteMany({});
    await prisma.expenses.deleteMany({});
    await prisma.penyaluran_harian.deleteMany({});
    await prisma.perencanaan_harian.deleteMany({});
    await prisma.penerimaan_stok.deleteMany({});
    await prisma.agen_orders.deleteMany({});
    await prisma.pangkalans.deleteMany({});
    await prisma.drivers.deleteMany({});
    await prisma.agen.deleteMany({});
    await prisma.lpg_products.deleteMany({});
    await prisma.company_profile.deleteMany({});

    console.log('✅ Existing data deleted');

    // ============================================================
    // 1. CREATE/UPDATE USERS
    // ============================================================
    const hashedAdmin = await bcrypt.hash('admin123', 12);
    const hashedOperator = await bcrypt.hash('operator123', 12);
    const hashedPangkalan = await bcrypt.hash('pangkalan123', 12);

    const admin = await prisma.users.upsert({
        where: { email: 'admin@agen.com' },
        update: { password: hashedAdmin },
        create: {
            code: 'USR-001',
            email: 'admin@agen.com',
            password: hashedAdmin,
            role: 'ADMIN',
            name: 'Administrator',
            phone: '081234567890',
            is_active: true,
        },
    });
    console.log('✅ User Admin:', admin.email);

    await prisma.users.upsert({
        where: { email: 'operator@demo.com' },
        update: { password: hashedOperator },
        create: {
            code: 'USR-002',
            email: 'operator@demo.com',
            password: hashedOperator,
            role: 'OPERATOR',
            name: 'Operator Demo',
            phone: '082211445566',
            is_active: true,
        },
    });
    console.log('✅ User Operator');

    await prisma.users.upsert({
        where: { email: 'pkl001@demo.com' },
        update: { password: hashedPangkalan },
        create: {
            code: 'USR-003',
            email: 'pkl001@demo.com',
            password: hashedPangkalan,
            role: 'PANGKALAN',
            name: 'Pangkalan Demo',
            phone: '085678901234',
            is_active: true,
        },
    });
    console.log('✅ User Pangkalan');

    // ============================================================
    // 2. CREATE DRIVERS (10 orang Sunda)
    // ============================================================
    const driverList = [
        'Asep Sunandar', 'Dadang Hermawan', 'Ujang Suryana', 'Cecep Sudrajat',
        'Edi Junaedi', 'Oman Suparman', 'Dede Kurniawan', 'Agus Rahmat',
        'Iwan Setiawan', 'Yayan Rusmana'
    ];
    const driverIds: string[] = [];
    for (let i = 0; i < driverList.length; i++) {
        const driver = await prisma.drivers.create({
            data: {
                code: `DRV-${String(i + 1).padStart(3, '0')}`,
                name: driverList[i],
                phone: `08123456700${i + 1}`,
                vehicle_id: `D ${1000 + i} AB`,
                is_active: true,
            },
        });
        driverIds.push(driver.id);
    }
    console.log('✅ 10 Drivers created');

    // ============================================================
    // 3. CREATE PANGKALANS (14 dari Pertamina Cianjur)
    // ============================================================
    const pangkalansData = [
        { code: '343262997904001', name: 'CECE SUKANDI', alokasi: 1000 },
        { code: '343262997904002', name: 'DANG DANG', alokasi: 1000 },
        { code: '343262997904003', name: 'DEDE DILALUDIN', alokasi: 1000 },
        { code: '343262997904004', name: 'HJ. IIS SUAIBAH', alokasi: 1000 },
        { code: '343262997904005', name: 'UNANG JUNAEDI', alokasi: 1000 },
        { code: '343262997904006', name: 'HERMAWAN SUTISNA', alokasi: 1000 },
        { code: '343262997904007', name: 'POPONG JUBAEDAH', alokasi: 1000 },
        { code: '343262997904008', name: 'ASEP', alokasi: 1200 },
        { code: '343262997904009', name: 'NAZRIL MUHAMMAD ILHAM', alokasi: 1000 },
        { code: '343265997904001', name: 'RAS 96', alokasi: 1000 },
        { code: '343269997904001', name: 'M. DIAN SUTISNA', alokasi: 1000 },
        { code: '343269997904002', name: 'AGUS', alokasi: 1000 },
        { code: '343285997904001', name: 'TOTOH ABDUL FATAH', alokasi: 1000 },
        { code: '343291199904001', name: 'MIMAH SITI ROHMAH', alokasi: 1000 },
    ];

    const pangkalanMap: Record<string, { id: string; name: string }> = {};
    for (const p of pangkalansData) {
        const pangkalan = await prisma.pangkalans.create({
            data: {
                code: p.code,
                name: p.name,
                address: 'Kabupaten Cianjur, Jawa Barat',
                region: 'KABUPATEN CIANJUR',
                alokasi_bulanan: p.alokasi,
                is_active: true,
            },
        });
        pangkalanMap[p.code] = { id: pangkalan.id, name: p.name };
    }
    console.log('✅ 14 Pangkalans created');

    // ============================================================
    // 4. CREATE COMPANY PROFILE & LPG PRODUCT
    // ============================================================
    await prisma.company_profile.create({
        data: {
            id: '997904',
            company_name: 'PT. MITRA SURYA NATASYA',
            address: 'Kabupaten Cianjur, Jawa Barat',
            phone: '0263-123456',
            email: 'admin@agen.com',
            pic_name: 'Administrator',
            region: 'Cianjur',
        },
    });
    console.log('✅ Company Profile');

    const lpgProduct = await prisma.lpg_products.create({
        data: {
            name: 'LPG 3kg Subsidi',
            size_kg: 3,
            category: 'SUBSIDI',
            color: 'hijau',
            brand: 'Elpiji',
            selling_price: 18000,
            cost_price: 16000,
            is_active: true,
        },
    });
    console.log('✅ LPG Product 3kg (id:', lpgProduct.id, ')');

    // ============================================================
    // 5. CREATE PENERIMAAN STOK (sesuai data)
    // ============================================================
    for (const p of penerimaanData) {
        await prisma.penerimaan_stok.create({
            data: {
                no_so: p.no_so,
                no_lo: p.no_lo,
                nama_material: 'REFILL/ISI LPG @3KG (NET)',
                qty_pcs: p.qty,
                qty_kg: p.qty * 3,
                tanggal: p.tanggal,
                sumber: 'PT. RENATA PUTRA SENTOSA',
            },
        });
    }
    console.log('✅ 10 Penerimaan Stok created');

    // ============================================================
    // 6. CREATE STOCK HISTORIES (MASUK) - sesuai In Out Agen
    // ============================================================
    for (const io of inOutAgen) {
        if (io.penerimaan > 0) {
            await prisma.stock_histories.create({
                data: {
                    lpg_type: lpg_type.kg3,
                    lpg_product_id: lpgProduct.id,
                    movement_type: stock_movement_type.MASUK,
                    qty: io.penerimaan,
                    note: `Penerimaan tanggal ${io.day} Januari 2026`,
                    timestamp: jan(io.day),
                    created_at: jan(io.day), // Set created_at sama dengan timestamp
                    recorded_by_user_id: admin.id,
                },
            });
        }
    }
    console.log('✅ Stock Histories (MASUK)');

    // ============================================================
    // 7. CREATE ORDERS & STOCK KELUAR (1 per pangkalan per hari)
    // Sinkron dengan penyaluran - setiap penyaluran = 1 order
    // ============================================================
    let orderNum = 1;
    const pricePerUnit = 18000;

    for (const p of penyaluranPerPangkalan) {
        const pangkalan = pangkalanMap[p.code];
        if (!pangkalan) continue;

        for (const [dayStr, qty] of Object.entries(p.days)) {
            const day = parseInt(dayStr);
            if (qty > 0) {
                const orderCode = `ORD-${String(orderNum).padStart(4, '0')}`;
                const totalAmount = qty * pricePerUnit;
                const driverId = driverIds[orderNum % driverIds.length];

                // Create 1 Order per pangkalan per hari
                const order = await prisma.orders.create({
                    data: {
                        code: orderCode,
                        pangkalan_id: pangkalan.id,
                        driver_id: driverId,
                        order_date: jan(day),
                        created_at: jan(day), // Set created_at sama dengan order_date
                        current_status: status_pesanan.SELESAI,
                        subtotal: totalAmount,
                        tax_amount: 0,
                        total_amount: totalAmount,
                        note: `Penyaluran ke ${pangkalan.name} - ${qty} tabung`,
                    },
                });

                // Create Order Item
                await prisma.order_items.create({
                    data: {
                        order_id: order.id,
                        lpg_type: lpg_type.kg3,
                        label: 'LPG 3kg Subsidi',
                        price_per_unit: pricePerUnit,
                        qty: qty,
                        sub_total: totalAmount,
                        is_taxable: false,
                        tax_amount: 0,
                    },
                });

                // Create Payment Detail
                await prisma.order_payment_details.create({
                    data: {
                        order_id: order.id,
                        is_paid: true,
                        is_dp: false,
                        payment_method: payment_method.TRANSFER,
                        amount_paid: totalAmount,
                        payment_date: jan(day),
                    },
                });

                // Create Stock History (KELUAR) per order
                await prisma.stock_histories.create({
                    data: {
                        lpg_type: lpg_type.kg3,
                        lpg_product_id: lpgProduct.id,
                        movement_type: stock_movement_type.KELUAR,
                        qty: qty,
                        note: `${orderCode} - ${pangkalan.name} (${qty} tabung)`,
                        timestamp: jan(day),
                        created_at: jan(day), // Set created_at sama dengan timestamp
                        recorded_by_user_id: admin.id,
                    },
                });

                orderNum++;
            }
        }
    }
    console.log(`✅ ${orderNum - 1} Orders created (1 per pangkalan per hari)`);

    // ============================================================
    // 8. CREATE PENYALURAN HARIAN (per pangkalan)
    // ============================================================
    for (const p of penyaluranPerPangkalan) {
        const pangkalan = pangkalanMap[p.code];
        if (!pangkalan) continue;

        for (const [dayStr, qty] of Object.entries(p.days)) {
            const day = parseInt(dayStr);
            if (qty > 0) {
                await prisma.penyaluran_harian.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        tanggal: jan(day),
                        lpg_type: lpg_type.kg3,
                        jumlah_normal: qty,
                        jumlah_fakultatif: 0,
                        tipe_pembayaran: 'CASHLESS',
                    },
                });
            }
        }
    }
    console.log('✅ Penyaluran Harian per Pangkalan');

    // ============================================================
    // 9. CREATE PERENCANAAN HARIAN (sama dengan penyaluran)
    // ============================================================
    for (const p of penyaluranPerPangkalan) {
        const pangkalan = pangkalanMap[p.code];
        if (!pangkalan) continue;

        for (const [dayStr, qty] of Object.entries(p.days)) {
            const day = parseInt(dayStr);
            if (qty > 0) {
                await prisma.perencanaan_harian.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        tanggal: jan(day),
                        lpg_type: lpg_type.kg3,
                        jumlah_normal: qty,
                        jumlah_fakultatif: 0,
                        alokasi_bulan: 1000,
                    },
                });
            }
        }
    }
    console.log('✅ Perencanaan Harian');

    // ============================================================
    // VERIFICATION
    // ============================================================
    console.log('');
    console.log('📊 VERIFIKASI DATA:');

    // Hitung total stock
    const stockIn = inOutAgen.reduce((sum, io) => sum + io.penerimaan, 0);
    const stockOut = inOutAgen.reduce((sum, io) => sum + io.penyaluran, 0);
    const stockAkhir = inOutAgen[inOutAgen.length - 1].stokAkhir;

    console.log(`   Penerimaan  : ${stockIn} tabung`);
    console.log(`   Penyaluran  : ${stockOut} tabung`);
    console.log(`   Stok Akhir  : ${stockAkhir} tabung`);
    console.log(`   Check       : ${stockIn} - ${stockOut} = ${stockIn - stockOut} (should be ${stockAkhir})`);

    // ============================================================
    // DONE
    // ============================================================
    console.log('');
    console.log('🎉 SEED COMPLETED!');
    console.log('');
    console.log('📋 Login:');
    console.log('   Admin     : admin@agen.com / admin123');
    console.log('   Operator  : operator@demo.com / operator123');
    console.log('   Pangkalan : pkl001@demo.com / pangkalan123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
