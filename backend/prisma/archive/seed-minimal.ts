/**
 * Minimal Seed - Seeds essential data only
 * Run: npx ts-node --transpile-only prisma/seed-minimal.ts
 * 
 * PENJELASAN:
 * Script ini membuat data minimum yang diperlukan:
 * - 1 Admin user
 * - 2 Drivers
 * - 3 Pangkalans
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting minimal seed...');

    // ============================================================
    // 1. CREATE USERS
    // ============================================================
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const hashedOperatorPassword = await bcrypt.hash('operator123', 12);

    // Admin User
    const admin = await prisma.users.upsert({
        where: { email: 'admin@sim4lon.co.id' },
        update: { name: 'Administrator' },
        create: {
            code: 'USR-001',
            email: 'admin@sim4lon.co.id',
            password: hashedAdminPassword,
            role: 'ADMIN',
            name: 'Administrator',
            phone: '081234567890',
            is_active: true,
        },
    });
    console.log('✅ User:', admin.code, '-', admin.email);

    // Operator User
    const operator = await prisma.users.upsert({
        where: { email: 'operator@sim4lon.co.id' },
        update: { name: 'Siti Rahmawati' },
        create: {
            code: 'USR-002',
            email: 'operator@sim4lon.co.id',
            password: hashedOperatorPassword,
            role: 'OPERATOR',
            name: 'Siti Rahmawati',
            phone: '082211445566',
            is_active: true,
        },
    });
    console.log('✅ User:', operator.code, '-', operator.email);

    // ============================================================
    // 2. CREATE DRIVERS
    // ============================================================
    // Check and create drivers (no upsert on code, so use findFirst)

    let driver1 = await prisma.drivers.findFirst({ where: { code: 'DRV-001' } });
    if (!driver1) {
        driver1 = await prisma.drivers.create({
            data: {
                code: 'DRV-001',
                name: 'Bambang Sugiharto',
                phone: '083399887766',
                vehicle_id: 'B 1234 ABC',
                is_active: true,
                note: 'Supir senior',
            },
        });
        console.log('✅ Created Driver:', driver1.code, '-', driver1.name);
    } else {
        console.log('⏩ Driver already exists:', driver1.code);
    }

    let driver2 = await prisma.drivers.findFirst({ where: { code: 'DRV-002' } });
    if (!driver2) {
        driver2 = await prisma.drivers.create({
            data: {
                code: 'DRV-002',
                name: 'Dedi Iskandar',
                phone: '089812312312',
                vehicle_id: 'B 5678 XYZ',
                is_active: true,
                note: 'Supir baru',
            },
        });
        console.log('✅ Created Driver:', driver2.code, '-', driver2.name);
    } else {
        console.log('⏩ Driver already exists:', driver2.code);
    }

    // ============================================================
    // 3. CREATE PANGKALANS
    // ============================================================

    let pangkalan1 = await prisma.pangkalans.findFirst({ where: { code: 'PKL-001' } });
    if (!pangkalan1) {
        pangkalan1 = await prisma.pangkalans.create({
            data: {
                code: 'PKL-001',
                name: 'Pangkalan Maju Jaya',
                address: 'Jl. Sudirman No. 12, Kel. Menteng, Jakarta Pusat',
                region: 'Jakarta Pusat',
                pic_name: 'Pak Ahmad',
                phone: '081234567890',
                capacity: 500,
                is_active: true,
                note: 'Pangkalan besar',
            },
        });
        console.log('✅ Created Pangkalan:', pangkalan1.code, '-', pangkalan1.name);
    } else {
        console.log('⏩ Pangkalan already exists:', pangkalan1.code);
    }

    let pangkalan2 = await prisma.pangkalans.findFirst({ where: { code: 'PKL-002' } });
    if (!pangkalan2) {
        pangkalan2 = await prisma.pangkalans.create({
            data: {
                code: 'PKL-002',
                name: 'Pangkalan Berkah Sejahtera',
                address: 'Jalan Gajah Mada Blok C5 No. 4, Semarang',
                region: 'Semarang',
                pic_name: 'Bu Siti',
                phone: '087765432109',
                capacity: 200,
                is_active: true,
                note: 'Butuh LPG 3kg dan 12kg',
            },
        });
        console.log('✅ Created Pangkalan:', pangkalan2.code, '-', pangkalan2.name);
    } else {
        console.log('⏩ Pangkalan already exists:', pangkalan2.code);
    }

    let pangkalan3 = await prisma.pangkalans.findFirst({ where: { code: 'PKL-003' } });
    if (!pangkalan3) {
        pangkalan3 = await prisma.pangkalans.create({
            data: {
                code: 'PKL-003',
                name: 'Pangkalan Sumber Rezeki',
                address: 'Perumahan Indah Blok R No. 10, Bandung',
                region: 'Bandung',
                pic_name: 'Pak Joko',
                phone: '085611223344',
                capacity: 100,
                is_active: true,
                note: 'Pembayaran selalu tepat waktu',
            },
        });
        console.log('✅ Created Pangkalan:', pangkalan3.code, '-', pangkalan3.name);
    } else {
        console.log('⏩ Pangkalan already exists:', pangkalan3.code);
    }

    console.log('');
    console.log('🎉 Seed completed!');
    console.log('📊 Summary:');
    console.log('   - 2 Users (admin, operator)');
    console.log('   - 2 Drivers (DRV-001, DRV-002)');
    console.log('   - 3 Pangkalans (PKL-001, PKL-002, PKL-003)');
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
