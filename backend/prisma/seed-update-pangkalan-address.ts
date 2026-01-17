/**
 * TEMPORARY SEED - Update Pangkalan Address & Region
 * Format: region = "Kecamatan X, Kabupaten Cianjur"
 * 
 * Jalankan: npx ts-node prisma/seed-update-pangkalan-address.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Data alamat dan region sekitar Kecamatan Cibeber dan sekitarnya (Kabupaten Cianjur)
const pangkalanAddressData = [
    { code: '343262997904001', address: 'Jl. Cibareno No. 45', region: 'Cibeber, Kabupaten Cianjur' },
    { code: '343265997904001', address: 'Jl. Ciherang No. 12', region: 'Cibeber, Kabupaten Cianjur' },
    { code: '343265997904004', address: 'Jl. Kamuning No. 78', region: 'Cilaku, Kabupaten Cianjur' },
    { code: '343265997904006', address: 'Jl. Cikopo No. 23', region: 'Cibeber, Kabupaten Cianjur' },
    { code: '343265997904003', address: 'Jl. Sukamakmur No. 56', region: 'Cibeber, Kabupaten Cianjur' },
    { code: '343265997904002', address: 'Jl. Sindangjaya No. 89', region: 'Karangtengah, Kabupaten Cianjur' },
    { code: '343265997904007', address: 'Jl. Ciburial No. 34', region: 'Cilaku, Kabupaten Cianjur' },
    { code: '343265997904008', address: 'Jl. Sukamaju No. 67', region: 'Cibeber, Kabupaten Cianjur' },
    { code: '343265997904005', address: 'Jl. Cikoneng No. 11', region: 'Cianjur, Kabupaten Cianjur' },
    { code: '343265997904009', address: 'Jl. Pasirbaru No. 21', region: 'Cibeber, Kabupaten Cianjur' },
    { code: '343262999904001', address: 'Jl. Cirata No. 44', region: 'Pacet, Kabupaten Cianjur' },
    { code: '343262999904002', address: 'Jl. Cipanas No. 99', region: 'Cipanas, Kabupaten Cianjur' },
    { code: '343262999904003', address: 'Jl. Palasari No. 15', region: 'Cibeber, Kabupaten Cianjur' },
    { code: '343262999904004', address: 'Jl. Sukanagara No. 32', region: 'Sukanagara, Kabupaten Cianjur' },
    { code: '343262999904005', address: 'Jl. Cikalongkulon No. 88', region: 'Cikalongkulon, Kabupaten Cianjur' },
];

async function main() {
    console.log('🚀 Updating Pangkalan Address & Region...\n');

    // Get all pangkalan codes
    const existingPangkalans = await prisma.pangkalans.findMany({
        select: { id: true, code: true, name: true, address: true, region: true }
    });

    console.log(`📦 Found ${existingPangkalans.length} pangkalans in database\n`);

    let updated = 0;
    let notFound = 0;

    // Update from predefined data
    for (const data of pangkalanAddressData) {
        const pangkalan = existingPangkalans.find(p => p.code === data.code);
        if (pangkalan) {
            await prisma.pangkalans.update({
                where: { code: data.code },
                data: {
                    address: data.address,
                    region: data.region
                }
            });
            console.log(`✅ Updated: ${data.code} - ${pangkalan.name}`);
            console.log(`   Address: ${data.address}`);
            console.log(`   Region: ${data.region}\n`);
            updated++;
        } else {
            console.log(`⚠️ Code ${data.code} not found in database`);
            notFound++;
        }
    }

    // Update remaining pangkalans without predefined data
    const remainingPangkalans = existingPangkalans.filter(
        p => !pangkalanAddressData.some(d => d.code === p.code)
    );

    // Daftar kecamatan sekitar Cibeber untuk random assignment
    const kecamatanList = [
        'Cibeber',
        'Cilaku',
        'Cianjur',
        'Karangtengah',
        'Pacet',
        'Cipanas',
        'Gekbrong',
        'Warungkondang',
        'Cikalongkulon',
        'Sukaluyu',
    ];

    const jalanList = [
        'Jl. Raya Ciherang',
        'Jl. Merdeka Utara',
        'Jl. Merdeka Selatan',
        'Jl. Siliwangi',
        'Jl. Pangeran',
        'Jl. Ahmad Yani',
        'Jl. Sudirman',
        'Jl. Gatot Subroto',
        'Jl. Diponegoro',
        'Jl. Pahlawan',
        'Jl. Kartini',
        'Jl. Ciburial',
        'Jl. Sindangbarang',
        'Jl. Sukamaju',
        'Jl. Pasir Gede',
    ];

    for (const pangkalan of remainingPangkalans) {
        // Skip PANGKALAN REON karena sudah benar
        if (pangkalan.code === '343265997904010' || pangkalan.name.toLowerCase().includes('reon')) {
            console.log(`⏭️ Skipped: ${pangkalan.code} - ${pangkalan.name} (already correct)\n`);
            continue;
        }

        // Random kecamatan dan jalan
        const randomKec = kecamatanList[Math.floor(Math.random() * kecamatanList.length)];
        const randomJalan = jalanList[Math.floor(Math.random() * jalanList.length)];
        const randomNo = Math.floor(Math.random() * 100) + 1;

        const newAddress = `${randomJalan} No. ${randomNo}`;
        const newRegion = `${randomKec}, Kabupaten Cianjur`;

        await prisma.pangkalans.update({
            where: { id: pangkalan.id },
            data: {
                address: newAddress,
                region: newRegion
            }
        });

        console.log(`✅ Updated: ${pangkalan.code} - ${pangkalan.name}`);
        console.log(`   Address: ${newAddress}`);
        console.log(`   Region: ${newRegion}\n`);
        updated++;
    }

    console.log('====================================');
    console.log(`✅ Updated: ${updated} pangkalans`);
    console.log(`⚠️ Not found: ${notFound} codes`);
    console.log('====================================\n');

    // Tampilkan hasil akhir
    const finalData = await prisma.pangkalans.findMany({
        select: { code: true, name: true, address: true, region: true },
        orderBy: { code: 'asc' }
    });

    console.log('📋 Final Pangkalan Data:\n');
    console.log('CODE'.padEnd(20) + 'NAME'.padEnd(25) + 'ADDRESS'.padEnd(30) + 'REGION');
    console.log('-'.repeat(100));
    for (const p of finalData) {
        console.log(
            p.code.padEnd(20) +
            (p.name || '').substring(0, 23).padEnd(25) +
            (p.address || '').substring(0, 28).padEnd(30) +
            (p.region || '')
        );
    }
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
