// ============================================================
// SEED DATA - Data Awal untuk Testing
// ============================================================
// Jalankan: npx prisma db seed
//
// File ini akan:
// 1. Membuat user Admin dan Operator
// 2. Membuat beberapa driver contoh
// 3. Membuat beberapa pangkalan contoh
// ============================================================

import 'dotenv/config'; // Load .env file
import { PrismaClient } from '@prisma/client';
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
        update: {}, // Tidak update apa-apa jika sudah ada
        create: {
            email: 'admin@sim4lon.co.id',
            password: hashedAdminPassword,
            role: 'ADMIN',
            name: 'Administrator',
            phone: '081234567890',
            is_active: true,
        },
    });
    console.log('✅ Created Admin:', adminUser.email);

    const operatorUser = await prisma.users.upsert({
        where: { email: 'operator@sim4lon.co.id' },
        update: {},
        create: {
            email: 'operator@sim4lon.co.id',
            password: hashedOperatorPassword,
            role: 'OPERATOR',
            name: 'Siti Rahmawati',
            phone: '082211445566',
            is_active: true,
        },
    });
    console.log('✅ Created Operator:', operatorUser.email);

    // ============================================================
    // 2. CREATE DRIVERS
    // ============================================================
    // Driver hanya data untuk assignment, bukan user login

    const driver1 = await prisma.drivers.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' }, // Fixed UUID untuk upsert
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
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

    console.log('');
    console.log('🎉 Seed completed!');
    console.log('');
    console.log('📋 Login credentials:');
    console.log('   Admin    : admin@sim4lon.co.id / admin123');
    console.log('   Operator : operator@sim4lon.co.id / operator123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
