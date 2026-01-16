/**
 * Script untuk membuat user pangkalan untuk testing
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/seed-pangkalan-user.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Creating test pangkalan user...\n');

    // 1. Get first pangkalan or create one if none exist
    let pangkalan = await prisma.pangkalans.findFirst({
        where: { is_active: true },
    });

    if (!pangkalan) {
        console.log('📦 Creating test pangkalan...');
        const count = await prisma.pangkalans.count();
        pangkalan = await prisma.pangkalans.create({
            data: {
                code: `PKL-${String(count + 1).padStart(3, '0')}`,
                name: 'Pangkalan Test',
                address: 'Jl. Testing No. 123',
                region: 'Jakarta',
                pic_name: 'Budi Test',
                phone: '081234567890',
            },
        });
        console.log(`✅ Created pangkalan: ${pangkalan.name} (${pangkalan.code})\n`);
    } else {
        console.log(`📦 Using existing pangkalan: ${pangkalan.name} (${pangkalan.code})\n`);
    }

    // 2. Check if test user already exists
    const existingUser = await prisma.users.findUnique({
        where: { email: 'pangkalan@test.com' },
    });

    if (existingUser) {
        console.log('⚠️  User pangkalan@test.com already exists!\n');

        // Update to link to pangkalan if not linked
        if (!existingUser.pangkalan_id) {
            await prisma.users.update({
                where: { id: existingUser.id },
                data: {
                    pangkalan_id: pangkalan.id,
                    role: 'PANGKALAN',
                },
            });
            console.log('✅ Updated user to link to pangkalan\n');
        }
    } else {
        // 3. Create pangkalan user
        console.log('👤 Creating pangkalan user...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userCount = await prisma.users.count();

        const user = await prisma.users.create({
            data: {
                code: `USR-${String(userCount + 1).padStart(3, '0')}`,
                email: 'pangkalan@test.com',
                password: hashedPassword,
                name: 'Pak Pangkalan',
                phone: '081234567890',
                role: 'PANGKALAN',
                pangkalan_id: pangkalan.id,
            },
        });

        console.log(`✅ Created user: ${user.name} (${user.email})\n`);
    }

    console.log('═══════════════════════════════════════');
    console.log('  TEST ACCOUNT READY');
    console.log('═══════════════════════════════════════');
    console.log('  Email    : pangkalan@test.com');
    console.log('  Password : password123');
    console.log('  Pangkalan: ' + pangkalan.name);
    console.log('═══════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
