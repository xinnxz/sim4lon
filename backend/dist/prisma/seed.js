"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const jan = (day) => new Date(2026, 0, day, 7, 0, 0);
const inOutAgen = [
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
    { day: 12, stokAwal: 854, penerimaan: 560, penyaluran: 709, stokAkhir: 705 },
    { day: 13, stokAwal: 705, penerimaan: 560, penyaluran: 1054, stokAkhir: 211 },
    { day: 14, stokAwal: 211, penerimaan: 0, penyaluran: 0, stokAkhir: 211 },
    { day: 15, stokAwal: 211, penerimaan: 560, penyaluran: 668, stokAkhir: 103 },
    { day: 16, stokAwal: 103, penerimaan: 0, penyaluran: 0, stokAkhir: 103 },
];
const penerimaanData = [
    { tanggal: jan(1), no_so: '0002544788', no_lo: '8182906106', qty: 560 },
    { tanggal: jan(2), no_so: '0002595522', no_lo: '8182902188', qty: 560 },
    { tanggal: jan(3), no_so: '0002595522', no_lo: '8183107411', qty: 560 },
    { tanggal: jan(6), no_so: '0002595522', no_lo: '8183106129', qty: 560 },
    { tanggal: jan(6), no_so: '0002595522', no_lo: '8183106130', qty: 560 },
    { tanggal: jan(7), no_so: '0002595522', no_lo: '8183187016', qty: 560 },
    { tanggal: jan(8), no_so: '0002595522', no_lo: '8183802171', qty: 560 },
    { tanggal: jan(9), no_so: '0002595522', no_lo: '8183802172', qty: 560 },
    { tanggal: jan(10), no_so: '0002595522', no_lo: '8183404851', qty: 560 },
    { tanggal: jan(10), no_so: '0002595522', no_lo: '8183404852', qty: 560 },
    { tanggal: jan(12), no_so: '0002595522', no_lo: '8183505001', qty: 560 },
    { tanggal: jan(13), no_so: '0002595522', no_lo: '8183505002', qty: 560 },
    { tanggal: jan(15), no_so: '0002595522', no_lo: '8183505003', qty: 560 },
];
const penyaluranPerPangkalan = [
    { code: '343269997904002', name: 'AGUS', days: { 2: 100, 3: 100, 8: 150, 9: 150, 10: 102, 12: 109, 13: 150, 15: 100 } },
    { code: '343262997904008', name: 'ASEP', days: { 2: 100, 3: 100, 8: 150, 9: 150, 10: 150, 12: 100, 13: 154, 15: 88 } },
    { code: '343262997904002', name: 'DANG DANG', days: { 2: 100, 3: 134, 8: 150, 9: 150, 10: 150, 12: 100, 13: 150, 15: 100 } },
    { code: '343262997904006', name: 'HERMAWAN SUTISNA', days: { 2: 112, 7: 350, 8: 150, 9: 150, 10: 100, 12: 100, 13: 150, 15: 100 } },
    { code: '343269997904001', name: 'M. DIAN SUTISNA', days: { 2: 100, 7: 350, 8: 127, 9: 161, 10: 100, 12: 100, 13: 150, 15: 100 } },
    { code: '343291199904001', name: 'MIMAH SITI ROHMAH', days: { 2: 50, 7: 350, 8: 100, 9: 160, 10: 100, 12: 100, 13: 150, 15: 180 } },
    { code: '343262997904009', name: 'NAZRIL MUHAMMAD ILHAM', days: { 8: 100, 9: 150, 10: 100, 12: 100, 13: 150 } },
];
function getTotalPenyaluranHari(day) {
    return penyaluranPerPangkalan.reduce((sum, p) => sum + (p.days[day] || 0), 0);
}
async function main() {
    console.log('🌱 Starting ACCURATE seed...');
    console.log('');
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
    await prisma.users.deleteMany({ where: { pangkalan_id: { not: null } } });
    await prisma.pangkalans.deleteMany({});
    await prisma.drivers.deleteMany({});
    await prisma.agen.deleteMany({});
    await prisma.lpg_products.deleteMany({});
    await prisma.company_profile.deleteMany({});
    console.log('✅ Existing data deleted');
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
        where: { email: 'tes2@demo.com' },
        update: { password: hashedPangkalan },
        create: {
            code: 'USR-003',
            email: 'tes2@demo.com',
            password: hashedPangkalan,
            role: 'PANGKALAN',
            name: 'Pangkalan Demo',
            phone: '085678901234',
            is_active: true,
        },
    });
    console.log('✅ User Pangkalan');
    const driverList = [
        'Asep Sunandar', 'Dadang Hermawan', 'Ujang Suryana', 'Cecep Sudrajat',
        'Edi Junaedi', 'Oman Suparman', 'Dede Kurniawan', 'Agus Rahmat',
        'Iwan Setiawan', 'Yayan Rusmana'
    ];
    const driverIds = [];
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
    const pangkalansData = [
        { code: '343262997904001', name: 'CECE SUKANDI', alokasi: 1000, phone: '081234567001', email: '4001@pangkalan.com' },
        { code: '343262997904002', name: 'DANG DANG', alokasi: 1000, phone: '081234567002', email: '4002@pangkalan.com' },
        { code: '343262997904003', name: 'DEDE DILALUDIN', alokasi: 1000, phone: '081234567003', email: '4003@pangkalan.com' },
        { code: '343262997904004', name: 'HJ. IIS SUAIBAH', alokasi: 1000, phone: '081234567004', email: '4004@pangkalan.com' },
        { code: '343262997904005', name: 'UNANG JUNAEDI', alokasi: 1000, phone: '081234567005', email: '4005@pangkalan.com' },
        { code: '343262997904006', name: 'HERMAWAN SUTISNA', alokasi: 1000, phone: '081234567006', email: '4006@pangkalan.com' },
        { code: '343262997904007', name: 'POPONG JUBAEDAH', alokasi: 1000, phone: '081234567007', email: '4007@pangkalan.com' },
        { code: '343262997904008', name: 'ASEP', alokasi: 1200, phone: '081234567008', email: '4008@pangkalan.com' },
        { code: '343262997904009', name: 'NAZRIL MUHAMMAD ILHAM', alokasi: 1000, phone: '081234567009', email: '4009@pangkalan.com' },
        { code: '343265997904001', name: 'RAS 96', alokasi: 1000, phone: '081234567010', email: '5001@pangkalan.com' },
        { code: '343269997904001', name: 'M. DIAN SUTISNA', alokasi: 1000, phone: '081234567011', email: '9001@pangkalan.com' },
        { code: '343269997904002', name: 'AGUS', alokasi: 1000, phone: '081234567012', email: '9002@pangkalan.com' },
        { code: '343285997904001', name: 'TOTOH ABDUL FATAH', alokasi: 1000, phone: '081234567013', email: '8001@pangkalan.com' },
        { code: '343291199904001', name: 'MIMAH SITI ROHMAH', alokasi: 1000, phone: '081234567014', email: '9904@pangkalan.com' },
    ];
    const pangkalanMap = {};
    for (const p of pangkalansData) {
        const pangkalan = await prisma.pangkalans.create({
            data: {
                code: p.code,
                name: p.name,
                address: 'Kabupaten Cianjur, Jawa Barat',
                region: 'KABUPATEN CIANJUR',
                phone: p.phone,
                email: p.email,
                alokasi_bulanan: p.alokasi,
                is_active: true,
            },
        });
        pangkalanMap[p.code] = { id: pangkalan.id, name: p.name };
    }
    console.log('✅ 14 Pangkalans created');
    let userNum = 14;
    for (const [code, data] of Object.entries(pangkalanMap)) {
        const shortCode = code.slice(-4);
        await prisma.users.upsert({
            where: { email: `${shortCode}@pangkalan.com` },
            update: {
                password: hashedPangkalan,
                pangkalan_id: data.id,
            },
            create: {
                code: `USR-${String(userNum).padStart(3, '0')}`,
                email: `${shortCode}@pangkalan.com`,
                password: hashedPangkalan,
                role: 'PANGKALAN',
                name: data.name,
                phone: `0812345${String(userNum).padStart(5, '0')}`,
                pangkalan_id: data.id,
                is_active: true,
            },
        });
        userNum++;
    }
    console.log('✅ 14 Pangkalan Users created');
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
    for (const io of inOutAgen) {
        if (io.penerimaan > 0) {
            await prisma.stock_histories.create({
                data: {
                    lpg_type: client_1.lpg_type.kg3,
                    lpg_product_id: lpgProduct.id,
                    movement_type: client_1.stock_movement_type.MASUK,
                    qty: io.penerimaan,
                    note: `Penerimaan tanggal ${io.day} Januari 2026`,
                    timestamp: jan(io.day),
                    created_at: jan(io.day),
                    recorded_by_user_id: admin.id,
                },
            });
        }
    }
    console.log('✅ Stock Histories (MASUK)');
    let orderNum = 1;
    const pricePerUnit = 18000;
    for (const p of penyaluranPerPangkalan) {
        const pangkalan = pangkalanMap[p.code];
        if (!pangkalan)
            continue;
        for (const [dayStr, qty] of Object.entries(p.days)) {
            const day = parseInt(dayStr);
            if (qty > 0) {
                const orderCode = `ORD-${String(orderNum).padStart(4, '0')}`;
                const totalAmount = qty * pricePerUnit;
                const driverId = driverIds[orderNum % driverIds.length];
                const order = await prisma.orders.create({
                    data: {
                        code: orderCode,
                        pangkalan_id: pangkalan.id,
                        driver_id: driverId,
                        order_date: jan(day),
                        created_at: jan(day),
                        current_status: client_1.status_pesanan.SELESAI,
                        subtotal: totalAmount,
                        tax_amount: 0,
                        total_amount: totalAmount,
                        note: `Penyaluran ke ${pangkalan.name} - ${qty} tabung`,
                    },
                });
                await prisma.order_items.create({
                    data: {
                        order_id: order.id,
                        lpg_type: client_1.lpg_type.kg3,
                        label: 'LPG 3kg Subsidi',
                        price_per_unit: pricePerUnit,
                        qty: qty,
                        sub_total: totalAmount,
                        is_taxable: false,
                        tax_amount: 0,
                    },
                });
                await prisma.order_payment_details.create({
                    data: {
                        order_id: order.id,
                        is_paid: true,
                        is_dp: false,
                        payment_method: client_1.payment_method.TRANSFER,
                        amount_paid: totalAmount,
                        payment_date: jan(day),
                    },
                });
                await prisma.stock_histories.create({
                    data: {
                        lpg_type: client_1.lpg_type.kg3,
                        lpg_product_id: lpgProduct.id,
                        movement_type: client_1.stock_movement_type.KELUAR,
                        qty: qty,
                        note: `${orderCode} - ${pangkalan.name} (${qty} tabung)`,
                        timestamp: jan(day),
                        created_at: jan(day),
                        recorded_by_user_id: admin.id,
                    },
                });
                orderNum++;
            }
        }
    }
    console.log(`✅ ${orderNum - 1} Orders created (1 per pangkalan per hari)`);
    for (const p of penyaluranPerPangkalan) {
        const pangkalan = pangkalanMap[p.code];
        if (!pangkalan)
            continue;
        for (const [dayStr, qty] of Object.entries(p.days)) {
            const day = parseInt(dayStr);
            if (qty > 0) {
                await prisma.penyaluran_harian.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        tanggal: jan(day),
                        lpg_type: client_1.lpg_type.kg3,
                        jumlah_normal: qty,
                        jumlah_fakultatif: 0,
                        tipe_pembayaran: 'CASHLESS',
                    },
                });
            }
        }
    }
    console.log('✅ Penyaluran Harian per Pangkalan');
    for (const p of penyaluranPerPangkalan) {
        const pangkalan = pangkalanMap[p.code];
        if (!pangkalan)
            continue;
        for (const [dayStr, qty] of Object.entries(p.days)) {
            const day = parseInt(dayStr);
            if (qty > 0) {
                await prisma.perencanaan_harian.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        tanggal: jan(day),
                        lpg_type: client_1.lpg_type.kg3,
                        jumlah_normal: qty,
                        jumlah_fakultatif: 0,
                        alokasi_bulan: 1000,
                    },
                });
            }
        }
    }
    console.log('✅ Perencanaan Harian');
    console.log('');
    console.log('📊 VERIFIKASI DATA:');
    const stockIn = inOutAgen.reduce((sum, io) => sum + io.penerimaan, 0);
    const stockOut = inOutAgen.reduce((sum, io) => sum + io.penyaluran, 0);
    const stockAkhir = inOutAgen[inOutAgen.length - 1].stokAkhir;
    console.log(`   Penerimaan  : ${stockIn} tabung`);
    console.log(`   Penyaluran  : ${stockOut} tabung`);
    console.log(`   Stok Akhir  : ${stockAkhir} tabung`);
    console.log(`   Check       : ${stockIn} - ${stockOut} = ${stockIn - stockOut} (should be ${stockAkhir})`);
    console.log('');
    console.log('🎉 SEED COMPLETED!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   ──────────────────────────────────────');
    console.log('   Admin     : admin@agen.com / admin123');
    console.log('   Operator  : operator@demo.com / operator123');
    console.log('   ──────────────────────────────────────');
    console.log('   Pangkalan Users (14 akun):');
    console.log('   Email: [4 digit terakhir kode]@pangkalan.com');
    console.log('   Password: pangkalan123');
    console.log('   Contoh: 4001@pangkalan.com / pangkalan123');
    console.log('   ──────────────────────────────────────');
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
//# sourceMappingURL=seed.js.map