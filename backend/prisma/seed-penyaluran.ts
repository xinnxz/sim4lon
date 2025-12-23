/**
 * SEED: Pangkalan, Pesanan & Penyaluran (Synchronized)
 * 
 * Creates complete synchronized data:
 * 1. Pangkalans (3 outlets)
 * 2. Agen Orders (orders from pangkalan to agen)
 * 3. Penyaluran Harian (distribution to pangkalan)
 * 4. Stock movements (KELUAR from agen)
 * 
 * Data Flow: Penerimaan (MASUK) → Penyaluran (KELUAR) x Pangkalan
 * Period: 1 December 2025 - Now
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/seed-penyaluran.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Config
const START_DATE = new Date(2025, 11, 1); // 1 Dec 2025
const END_DATE = new Date(); // Today

// Pangkalan data (3 outlets with different allocation sizes)
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
        daily_avg: 25, // Average daily distribution
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

    // Get agen
    const agen = await prisma.agen.findFirst();
    if (!agen) {
        console.error('❌ Agen tidak ditemukan! Jalankan seed-agen dulu.');
        return;
    }

    // Get LPG 3kg product
    const lpg3kg = await prisma.lpg_products.findFirst({
        where: { name: { contains: '3 kg' } }
    });

    // Clean old data (in correct FK order)
    console.log('🧹 Membersihkan data lama...');

    // Clean orders and related tables first
    await prisma.timeline_tracks.deleteMany();
    await prisma.payment_records.deleteMany();
    await prisma.order_payment_details.deleteMany();
    await prisma.invoices.deleteMany();
    await prisma.activity_logs.deleteMany({ where: { order_id: { not: null } } });
    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();

    // Clean penyaluran/perencanaan
    await prisma.penyaluran_harian.deleteMany();
    await prisma.perencanaan_harian.deleteMany();
    await prisma.agen_orders.deleteMany();

    // Clean KELUAR stock movements (will be recreated synchronized)
    await prisma.stock_histories.deleteMany({ where: { movement_type: 'KELUAR' } });

    // Clean pangkalan stock data (will be recreated from orders)
    await prisma.pangkalan_stock_movements.deleteMany();
    await prisma.pangkalan_stocks.deleteMany();
    // Note: Don't delete pangkalans or MASUK stock histories

    // ============================================
    // 1. CREATE/UPDATE PANGKALANS + USER ACCOUNTS
    // ============================================
    console.log('\n📦 Creating/updating pangkalans + user accounts...');
    const createdPangkalans: any[] = [];

    for (const pklData of PANGKALAN_DATA) {
        let pangkalan = await prisma.pangkalans.findFirst({
            where: { code: pklData.code }
        });

        if (!pangkalan) {
            // Create pangkalan with email
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
        } else {
            // Update existing pangkalan with email if missing
            if (!pangkalan.email) {
                await prisma.pangkalans.update({
                    where: { id: pangkalan.id },
                    data: { email: pklData.email }
                });
            }
            console.log(`  ⏭️  Exists: ${pangkalan.name}`);
        }

        // Create user account for pangkalan (if not exists)
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

    // ============================================
    // 2. CREATE PENYALURAN, ORDERS & STOCK HISTORY (SYNCHRONIZED)
    // ============================================
    console.log('\n📦 Creating penyaluran + pesanan (SYNCHRONIZED)...');

    let totalDistributed = 0;
    let totalOrders = 0;
    let orderCodeNum = 1;
    let agenOrderCodeNum = 1;
    const admin = await prisma.users.findFirst({ where: { role: 'ADMIN' } });

    // Price per unit LPG 3kg (subsidi)
    const PRICE_PER_UNIT = 16000;

    const currentDate = new Date(START_DATE);

    while (currentDate <= END_DATE) {
        // Skip Sunday
        if (currentDate.getDay() === 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        // For each pangkalan, create synchronized data
        for (const pkl of createdPangkalans) {
            // Random variation around daily_avg (±30%)
            const variation = Math.floor(Math.random() * (pkl.daily_avg * 0.6)) - (pkl.daily_avg * 0.3);
            const dailyQty = Math.max(5, Math.round(pkl.daily_avg + variation));

            // 1. Create penyaluran_harian (distribution record)
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

            // 2. Create perencanaan_harian (planning)
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

            // 3. Create ORDER (pesanan) - SYNCHRONIZED with penyaluran
            const orderCode = `ORD-${String(orderCodeNum++).padStart(4, '0')}`;
            const subtotal = dailyQty * PRICE_PER_UNIT;

            const order = await prisma.orders.create({
                data: {
                    code: orderCode,
                    pangkalan_id: pkl.id,
                    order_date: new Date(currentDate),
                    current_status: 'SELESAI', // Completed
                    subtotal: subtotal,
                    tax_amount: 0, // Subsidi = no tax
                    total_amount: subtotal,
                    note: `Pesanan harian ${formatDate(currentDate)}`,
                },
            });

            // 4. Create ORDER_ITEMS
            await prisma.order_items.create({
                data: {
                    order_id: order.id,
                    lpg_type: 'kg3',
                    label: 'LPG 3 kg (Subsidi)',
                    price_per_unit: PRICE_PER_UNIT,
                    qty: dailyQty, // SAME as penyaluran
                    sub_total: subtotal,
                    is_taxable: false,
                    tax_amount: 0,
                },
            });

            totalOrders++;

            // 5. Create stock_histories KELUAR
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

            // 6. Create agen_order (order from pangkalan to agen)
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

            // 7. Update pangkalan_stocks (stok di pangkalan bertambah)
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

            // 8. Create pangkalan_stock_movements (MASUK ke pangkalan)
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

        // Progress indicator
        if (totalOrders % 10 === 0) {
            process.stdout.write('.');
        }
    }

    // Helper function
    function formatDate(d: Date): string {
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // ============================================
    // 3. SUMMARY
    // ============================================
    const dayCount = Math.ceil((END_DATE.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
    const operationalDays = Math.round(dayCount * 6 / 7); // Exclude Sundays

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
