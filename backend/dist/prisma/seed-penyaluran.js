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
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const START_DATE = new Date(2025, 11, 1);
const END_DATE = new Date();
const PANGKALAN_DATA = [
    {
        code: 'PKL-001',
        name: 'Pangkalan Maju Jaya',
        address: 'Jl. Sudirman No. 12, Kel. Sukamaju',
        region: 'Menteng, Jakarta Pusat',
        pic_name: 'Pak Ahmad',
        phone: '081234567890',
        email: 'pkl001@demo.com',
        password: 'pangkalan123',
        capacity: 300,
        alokasi_bulanan: 500,
        daily_avg: 25,
    },
    {
        code: 'PKL-002',
        name: 'Pangkalan Berkah Sejahtera',
        address: 'Jl. Gajah Mada Blok C5 No. 4',
        region: 'Semarang',
        pic_name: 'Bu Siti',
        phone: '087765432109',
        email: 'pkl002@demo.com',
        password: 'pangkalan123',
        capacity: 200,
        alokasi_bulanan: 400,
        daily_avg: 20,
    },
    {
        code: 'PKL-003',
        name: 'Pangkalan Sumber Rezeki',
        address: 'Perumahan Indah Blok R No. 10, Bandung',
        region: 'Cikalongkulon, Kabupaten Cianjur',
        pic_name: 'Pak Joko',
        phone: '085611223344',
        email: 'pkl003@demo.com',
        password: 'pangkalan123',
        capacity: 250,
        alokasi_bulanan: 450,
        daily_avg: 22,
    },
];
async function main() {
    console.log('🚀 Seeding Pangkalan, Pesanan & Penyaluran...\n');
    console.log(`📅 Periode: 1 Desember 2025 - Sekarang\n`);
    const agen = await prisma.agen.findFirst();
    if (!agen) {
        console.error('❌ Agen tidak ditemukan! Jalankan seed-agen dulu.');
        return;
    }
    const lpg3kg = await prisma.lpg_products.findFirst({
        where: { name: { contains: '3 kg' } }
    });
    console.log('🧹 Membersihkan data lama...');
    await prisma.timeline_tracks.deleteMany();
    await prisma.payment_records.deleteMany();
    await prisma.order_payment_details.deleteMany();
    await prisma.invoices.deleteMany();
    await prisma.activity_logs.deleteMany({ where: { order_id: { not: null } } });
    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.penyaluran_harian.deleteMany();
    await prisma.perencanaan_harian.deleteMany();
    await prisma.agen_orders.deleteMany();
    await prisma.stock_histories.deleteMany({ where: { movement_type: 'KELUAR' } });
    await prisma.pangkalan_stock_movements.deleteMany();
    await prisma.pangkalan_stocks.deleteMany();
    console.log('\n📦 Creating/updating pangkalans + user accounts...');
    const createdPangkalans = [];
    for (const pklData of PANGKALAN_DATA) {
        let pangkalan = await prisma.pangkalans.findFirst({
            where: { code: pklData.code }
        });
        if (!pangkalan) {
            pangkalan = await prisma.pangkalans.create({
                data: {
                    code: pklData.code,
                    name: pklData.name,
                    address: pklData.address,
                    region: pklData.region,
                    pic_name: pklData.pic_name,
                    phone: pklData.phone,
                    email: pklData.email,
                    capacity: pklData.capacity,
                    alokasi_bulanan: pklData.alokasi_bulanan,
                    agen_id: agen.id,
                },
            });
            console.log(`  ✅ Pangkalan: ${pangkalan.name}`);
        }
        else {
            if (!pangkalan.email) {
                await prisma.pangkalans.update({
                    where: { id: pangkalan.id },
                    data: { email: pklData.email }
                });
            }
            console.log(`  ⏭️  Exists: ${pangkalan.name}`);
        }
        const existingUser = await prisma.users.findFirst({
            where: { email: pklData.email }
        });
        if (!existingUser) {
            const hashedPwd = await bcrypt.hash(pklData.password, 10);
            const userCode = `USR-PKL-${pklData.code.replace('PKL-', '')}`;
            await prisma.users.create({
                data: {
                    code: userCode,
                    email: pklData.email,
                    password: hashedPwd,
                    name: pklData.pic_name,
                    phone: pklData.phone,
                    role: 'PANGKALAN',
                    pangkalan_id: pangkalan.id,
                },
            });
            console.log(`     👤 User: ${pklData.email} (password: ${pklData.password})`);
        }
        createdPangkalans.push({ ...pangkalan, daily_avg: pklData.daily_avg });
    }
    console.log('\n📦 Creating penyaluran + pesanan (SYNCHRONIZED)...');
    let totalDistributed = 0;
    let totalOrders = 0;
    let orderCodeNum = 1;
    let agenOrderCodeNum = 1;
    const admin = await prisma.users.findFirst({ where: { role: 'ADMIN' } });
    const PRICE_PER_UNIT = 16000;
    const currentDate = new Date(START_DATE);
    while (currentDate <= END_DATE) {
        if (currentDate.getDay() === 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }
        for (const pkl of createdPangkalans) {
            const variation = Math.floor(Math.random() * (pkl.daily_avg * 0.6)) - (pkl.daily_avg * 0.3);
            const dailyQty = Math.max(5, Math.round(pkl.daily_avg + variation));
            await prisma.penyaluran_harian.upsert({
                where: {
                    pangkalan_id_tanggal_lpg_type: {
                        pangkalan_id: pkl.id,
                        tanggal: new Date(currentDate),
                        lpg_type: 'kg3',
                    }
                },
                create: {
                    pangkalan_id: pkl.id,
                    tanggal: new Date(currentDate),
                    lpg_type: 'kg3',
                    jumlah_normal: dailyQty,
                    jumlah_fakultatif: 0,
                    tipe_pembayaran: 'CASHLESS',
                },
                update: {
                    jumlah_normal: dailyQty,
                }
            });
            totalDistributed += dailyQty;
            await prisma.perencanaan_harian.create({
                data: {
                    pangkalan_id: pkl.id,
                    tanggal: new Date(currentDate),
                    lpg_type: 'kg3',
                    jumlah_normal: dailyQty,
                    jumlah_fakultatif: 0,
                    alokasi_bulan: pkl.alokasi_bulanan,
                },
            });
            const orderCode = `ORD-${String(orderCodeNum++).padStart(4, '0')}`;
            const subtotal = dailyQty * PRICE_PER_UNIT;
            const order = await prisma.orders.create({
                data: {
                    code: orderCode,
                    pangkalan_id: pkl.id,
                    order_date: new Date(currentDate),
                    current_status: 'SELESAI',
                    subtotal: subtotal,
                    tax_amount: 0,
                    total_amount: subtotal,
                    note: `Pesanan harian ${formatDate(currentDate)}`,
                },
            });
            await prisma.order_items.create({
                data: {
                    order_id: order.id,
                    lpg_type: 'kg3',
                    label: 'LPG 3 kg (Subsidi)',
                    price_per_unit: PRICE_PER_UNIT,
                    qty: dailyQty,
                    sub_total: subtotal,
                    is_taxable: false,
                    tax_amount: 0,
                },
            });
            totalOrders++;
            if (lpg3kg) {
                await prisma.stock_histories.create({
                    data: {
                        lpg_product_id: lpg3kg.id,
                        lpg_type: 'kg3',
                        movement_type: 'KELUAR',
                        qty: dailyQty,
                        note: `Penyaluran ke ${pkl.name} - ${orderCode}`,
                        recorded_by_user_id: admin?.id,
                        timestamp: new Date(currentDate),
                    },
                });
            }
            const agenOrder = await prisma.agen_orders.create({
                data: {
                    code: `AO-${String(agenOrderCodeNum++).padStart(3, '0')}`,
                    pangkalan_id: pkl.id,
                    agen_id: agen.id,
                    lpg_type: 'kg3',
                    qty_ordered: dailyQty,
                    qty_received: dailyQty,
                    status: 'DITERIMA',
                    order_date: new Date(currentDate),
                    received_date: new Date(currentDate),
                    note: `Pesanan ${formatDate(currentDate)} - ${orderCode}`,
                },
            });
            await prisma.pangkalan_stocks.upsert({
                where: {
                    pangkalan_id_lpg_type: {
                        pangkalan_id: pkl.id,
                        lpg_type: 'kg3',
                    }
                },
                create: {
                    pangkalan_id: pkl.id,
                    lpg_type: 'kg3',
                    qty: dailyQty,
                    warning_level: 20,
                    critical_level: 10,
                },
                update: {
                    qty: { increment: dailyQty },
                },
            });
            await prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pkl.id,
                    lpg_type: 'kg3',
                    movement_type: 'MASUK',
                    qty: dailyQty,
                    source: 'ORDER',
                    reference_id: agenOrder.id,
                    note: `Penerimaan dari Agen - ${agenOrder.code}`,
                    movement_date: new Date(currentDate),
                },
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
        if (totalOrders % 10 === 0) {
            process.stdout.write('.');
        }
    }
    function formatDate(d) {
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    const dayCount = Math.ceil((END_DATE.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
    const operationalDays = Math.round(dayCount * 6 / 7);
    console.log('\n\n═══════════════════════════════════════════════════');
    console.log('  🎉 SEED COMPLETED!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Pangkalans created: ${createdPangkalans.length}`);
    createdPangkalans.forEach(pkl => {
        console.log(`    - ${pkl.code}: ${pkl.name}`);
    });
    console.log(`\n  Operational days: ${operationalDays}`);
    console.log(`  Total distributed: ${totalDistributed.toLocaleString()} tabung`);
    console.log(`  Avg per day: ${Math.round(totalDistributed / operationalDays)} tabung`);
    console.log(`  Total orders: ${totalOrders}`);
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
//# sourceMappingURL=seed-penyaluran.js.map