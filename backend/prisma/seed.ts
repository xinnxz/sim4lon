// ============================================================
// SEED DATA - Data Awal untuk Testing
// ============================================================
// Jalankan: npx prisma db seed
//
// File ini akan:
// 1. Membuat user Admin dan Operator
// 2. Membuat beberapa driver contoh
// 3. Membuat beberapa pangkalan contoh
// 4. Membuat sample orders dan stock histories
// ============================================================

import 'dotenv/config'; // Load .env file
import { PrismaClient, lpg_type, stock_movement_type, status_pesanan } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Prisma v7 menggunakan adapter pattern untuk koneksi database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting seed...');

    // ============================================================
    // 1. CREATE USERS
    // ============================================================
    // Password akan di-hash dengan bcrypt (12 rounds)
    // Ini standard keamanan untuk menyimpan password

    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const hashedOperatorPassword = await bcrypt.hash('operator123', 12);

    // Upsert = Update jika sudah ada, Insert jika belum
    // Ini mencegah error duplicate saat seed dijalankan berkali-kali

    const adminUser = await prisma.users.upsert({
        where: { email: 'admin@sim4lon.co.id' },
        update: {
            password: hashedAdminPassword,  // Update password jika user sudah ada
            name: 'Administrator',
        },
        create: {
            code: 'USR-001',  // Human-readable display code
            email: 'admin@sim4lon.co.id',
            password: hashedAdminPassword,
            role: 'ADMIN',
            name: 'Administrator',
            phone: '081234567890',
            is_active: true,
        },
    });
    console.log('✅ Created/Updated Admin:', adminUser.email);

    const operatorUser = await prisma.users.upsert({
        where: { email: 'operator@sim4lon.co.id' },
        update: {
            password: hashedOperatorPassword,
            name: 'Siti Rahmawati',
        },
        create: {
            code: 'USR-002',  // Human-readable display code
            email: 'operator@sim4lon.co.id',
            password: hashedOperatorPassword,
            role: 'OPERATOR',
            name: 'Siti Rahmawati',
            phone: '082211445566',
            is_active: true,
        },
    });
    console.log('✅ Created/Updated Operator:', operatorUser.email);

    // ============================================================
    // 2. CREATE DRIVERS
    // ============================================================
    // Driver hanya data untuk assignment, bukan user login

    const driver1 = await prisma.drivers.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' }, // Fixed UUID untuk upsert
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            code: 'DRV-001',  // Human-readable display code
            name: 'Bambang Sugiharto',
            phone: '083399887766',
            vehicle_id: 'B 1234 ABC',
            is_active: true,
            note: 'Supir senior, sudah 5 tahun',
        },
    });
    console.log('✅ Created Driver:', driver1.name);

    const driver2 = await prisma.drivers.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            code: 'DRV-002',  // Human-readable display code
            name: 'Dedi Iskandar',
            phone: '089812312312',
            vehicle_id: 'B 5678 XYZ',
            is_active: true,
            note: 'Supir baru',
        },
    });
    console.log('✅ Created Driver:', driver2.name);

    // ============================================================
    // 3. CREATE PANGKALANS
    // ============================================================
    // Pangkalan = Agen LPG / titik distribusi

    const pangkalan1 = await prisma.pangkalans.upsert({
        where: { id: '00000000-0000-0000-0000-000000000011' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000011',
            code: 'PKL-001',  // Human-readable display code
            name: 'Pangkalan Maju Jaya',
            address: 'Jl. Sudirman No. 12, Kel. Menteng, Jakarta Pusat',
            region: 'Jakarta Pusat',
            pic_name: 'Pak Ahmad',
            phone: '081234567890',
            capacity: 500,
            note: 'Pangkalan besar, pesanan sering di atas 100 unit',
            is_active: true,
        },
    });
    console.log('✅ Created Pangkalan:', pangkalan1.name);

    const pangkalan2 = await prisma.pangkalans.upsert({
        where: { id: '00000000-0000-0000-0000-000000000012' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000012',
            code: 'PKL-002',  // Human-readable display code
            name: 'Pangkalan Berkah Sejahtera',
            address: 'Jalan Gajah Mada Blok C5 No. 4, Semarang',
            region: 'Semarang',
            pic_name: 'Bu Siti',
            phone: '087765432109',
            capacity: 200,
            note: 'Butuh LPG 3kg dan 12kg',
            is_active: true,
        },
    });
    console.log('✅ Created Pangkalan:', pangkalan2.name);

    const pangkalan3 = await prisma.pangkalans.upsert({
        where: { id: '00000000-0000-0000-0000-000000000013' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000013',
            code: 'PKL-003',  // Human-readable display code
            name: 'Pangkalan Sumber Rezeki',
            address: 'Perumahan Indah Blok R No. 10, Bandung',
            region: 'Bandung',
            pic_name: 'Pak Joko',
            phone: '085611223344',
            capacity: 100,
            note: 'Pembayaran selalu tepat waktu',
            is_active: true,
        },
    });
    console.log('✅ Created Pangkalan:', pangkalan3.name);

    // ============================================================
    // 4. CREATE ORDERS
    // ============================================================
    // Pesanan dari pangkalan dengan berbagai status

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Order 1 - Selesai hari ini
    const order1 = await prisma.orders.upsert({
        where: { id: '00000000-0000-0000-0000-000000000101' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000101',
            code: 'ORD-0001',  // Human-readable display code
            pangkalan_id: pangkalan1.id,
            driver_id: driver1.id,
            current_status: status_pesanan.SELESAI,
            total_amount: 2500000,
            note: 'Pesanan rutin mingguan',
            order_date: today,
        },
    });
    console.log('✅ Created Order 1 (SELESAI)');

    // Order 2 - DIPROSES
    const order2 = await prisma.orders.upsert({
        where: { id: '00000000-0000-0000-0000-000000000102' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000102',
            code: 'ORD-0002',  // Human-readable display code
            pangkalan_id: pangkalan2.id,
            driver_id: driver2.id,
            current_status: status_pesanan.DIPROSES,
            total_amount: 1800000,
            note: 'Urgent delivery',
            order_date: today,
        },
    });
    console.log('✅ Created Order 2 (DIPROSES)');

    // Order 3 - DRAFT (pending)
    const order3 = await prisma.orders.upsert({
        where: { id: '00000000-0000-0000-0000-000000000103' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000103',
            code: 'ORD-0003',  // Human-readable display code
            pangkalan_id: pangkalan3.id,
            current_status: status_pesanan.DRAFT,
            total_amount: 900000,
            note: 'Menunggu konfirmasi',
            order_date: today,
        },
    });
    console.log('✅ Created Order 3 (DRAFT)');

    // Order 4 - MENUNGGU_PEMBAYARAN
    const order4 = await prisma.orders.upsert({
        where: { id: '00000000-0000-0000-0000-000000000104' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000104',
            code: 'ORD-0004',  // Human-readable display code
            pangkalan_id: pangkalan1.id,
            current_status: status_pesanan.MENUNGGU_PEMBAYARAN,
            total_amount: 3200000,
            note: 'Perlu DP dulu',
            order_date: today,
        },
    });
    console.log('✅ Created Order 4 (MENUNGGU_PEMBAYARAN)');

    // Order 5 - SELESAI kemarin
    const order5 = await prisma.orders.upsert({
        where: { id: '00000000-0000-0000-0000-000000000105' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000105',
            code: 'ORD-0005',  // Human-readable display code
            pangkalan_id: pangkalan2.id,
            driver_id: driver1.id,
            current_status: status_pesanan.SELESAI,
            total_amount: 1500000,
            note: 'Delivered on time',
            order_date: yesterday,
        },
    });
    console.log('✅ Created Order 5 (SELESAI - kemarin)');

    // ============================================================
    // 5. CREATE ORDER ITEMS
    // ============================================================

    await prisma.order_items.upsert({
        where: { id: '00000000-0000-0000-0000-000000000201' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000201',
            order_id: order1.id,
            lpg_type: lpg_type.kg3,
            label: 'LPG 3kg',
            price_per_unit: 18000,
            qty: 100,
            sub_total: 1800000,
        },
    });

    await prisma.order_items.upsert({
        where: { id: '00000000-0000-0000-0000-000000000202' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000202',
            order_id: order1.id,
            lpg_type: lpg_type.kg12,
            label: 'LPG 12kg',
            price_per_unit: 140000,
            qty: 5,
            sub_total: 700000,
        },
    });

    await prisma.order_items.upsert({
        where: { id: '00000000-0000-0000-0000-000000000203' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000203',
            order_id: order2.id,
            lpg_type: lpg_type.kg3,
            label: 'LPG 3kg',
            price_per_unit: 18000,
            qty: 100,
            sub_total: 1800000,
        },
    });
    console.log('✅ Created Order Items');

    // ============================================================
    // 6. CREATE STOCK HISTORIES
    // ============================================================
    // Ini data stok masuk/keluar untuk tracking inventory

    try {
        // Stok masuk awal
        await prisma.stock_histories.createMany({
            data: [
                {
                    id: '00000000-0000-0000-0000-000000000301',
                    lpg_type: lpg_type.kg3,
                    movement_type: stock_movement_type.MASUK,
                    qty: 500,
                    note: 'Stok awal',
                    timestamp: twoDaysAgo,
                    recorded_by_user_id: adminUser.id,
                },
                {
                    id: '00000000-0000-0000-0000-000000000302',
                    lpg_type: lpg_type.kg12,
                    movement_type: stock_movement_type.MASUK,
                    qty: 200,
                    note: 'Stok awal',
                    timestamp: twoDaysAgo,
                    recorded_by_user_id: adminUser.id,
                },
                {
                    id: '00000000-0000-0000-0000-000000000303',
                    lpg_type: lpg_type.kg50,
                    movement_type: stock_movement_type.MASUK,
                    qty: 50,
                    note: 'Stok awal',
                    timestamp: twoDaysAgo,
                    recorded_by_user_id: adminUser.id,
                },
                {
                    id: '00000000-0000-0000-0000-000000000304',
                    lpg_type: lpg_type.kg3,
                    movement_type: stock_movement_type.KELUAR,
                    qty: 100,
                    note: 'Pengiriman ke Pangkalan Maju Jaya',
                    timestamp: yesterday,
                    recorded_by_user_id: adminUser.id,
                },
                {
                    id: '00000000-0000-0000-0000-000000000305',
                    lpg_type: lpg_type.kg12,
                    movement_type: stock_movement_type.KELUAR,
                    qty: 5,
                    note: 'Pengiriman ke Pangkalan Maju Jaya',
                    timestamp: yesterday,
                    recorded_by_user_id: adminUser.id,
                },
            ],
            skipDuplicates: true,
        });
        console.log('✅ Created Stock Histories');
    } catch (e) {
        console.log('⚠️ Stock histories already exist, skipping...');
    }

    console.log('');
    console.log('🎉 Seed completed!');
    console.log('');
    console.log('📋 Login credentials:');
    console.log('   Admin    : admin@sim4lon.co.id / admin123');
    console.log('   Operator : operator@sim4lon.co.id / operator123');
    console.log('');
    console.log('📊 Sample data:');
    console.log('   - 5 Orders (various statuses)');
    console.log('   - Stock: 400 x 3kg, 195 x 12kg, 50 x 50kg');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
