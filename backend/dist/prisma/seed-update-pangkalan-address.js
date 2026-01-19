"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const pangkalanAddressData = [
    { code: '3432629979044010', address: 'Jl. Raya Merdeka No. 89', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343262997904001', address: 'Jl. Cibareno No. 45', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343265997904001', address: 'Jl. Ciherang No. 12', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343265997904004', address: 'Jl. Kamuning No. 78', region: 'Kec. Cilaku, Kabupaten Cianjur' },
    { code: '343265997904006', address: 'Jl. Cikopo No. 23', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343265997904003', address: 'Jl. Sukamakmur No. 56', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343265997904002', address: 'Jl. Sindangjaya No. 89', region: 'Kec. Karangtengah, Kabupaten Cianjur' },
    { code: '343265997904007', address: 'Jl. Ciburial No. 34', region: 'Kec. Cilaku, Kabupaten Cianjur' },
    { code: '343265997904008', address: 'Jl. Sukamaju No. 67', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343265997904005', address: 'Jl. Cikoneng No. 11', region: 'Kec. Cianjur, Kabupaten Cianjur' },
    { code: '343265997904009', address: 'Jl. Pasirbaru No. 21', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343262999904001', address: 'Jl. Cirata No. 44', region: 'Kec. Pacet, Kabupaten Cianjur' },
    { code: '343262999904002', address: 'Jl. Cipanas No. 99', region: 'Kec. Cipanas, Kabupaten Cianjur' },
    { code: '343262999904003', address: 'Jl. Palasari No. 15', region: 'Kec. Cibeber, Kabupaten Cianjur' },
    { code: '343262999904004', address: 'Jl. Sukanagara No. 32', region: 'Kec. Sukanagara, Kabupaten Cianjur' },
    { code: '343262999904005', address: 'Jl. Cikalongkulon No. 88', region: 'Kec. Cikalongkulon, Kabupaten Cianjur' },
];
async function main() {
    console.log('🚀 Updating Pangkalan Address & Region...\n');
    const existingPangkalans = await prisma.pangkalans.findMany({
        select: { id: true, code: true, name: true, address: true, region: true }
    });
    console.log(`📦 Found ${existingPangkalans.length} pangkalans in database\n`);
    let updated = 0;
    let notFound = 0;
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
        }
        else {
            console.log(`⚠️ Code ${data.code} not found in database`);
            notFound++;
        }
    }
    const remainingPangkalans = existingPangkalans.filter(p => !pangkalanAddressData.some(d => d.code === p.code));
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
        if (pangkalan.code === '343265997904010' || pangkalan.name.toLowerCase().includes('reon')) {
            console.log(`⏭️ Skipped: ${pangkalan.code} - ${pangkalan.name} (already correct)\n`);
            continue;
        }
        const randomKec = kecamatanList[Math.floor(Math.random() * kecamatanList.length)];
        const randomJalan = jalanList[Math.floor(Math.random() * jalanList.length)];
        const randomNo = Math.floor(Math.random() * 100) + 1;
        const newAddress = `${randomJalan} No. ${randomNo}`;
        const newRegion = `Kec. ${randomKec}, Kabupaten Cianjur`;
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
    const finalData = await prisma.pangkalans.findMany({
        select: { code: true, name: true, address: true, region: true },
        orderBy: { code: 'asc' }
    });
    console.log('📋 Final Pangkalan Data:\n');
    console.log('CODE'.padEnd(20) + 'NAME'.padEnd(25) + 'ADDRESS'.padEnd(30) + 'REGION');
    console.log('-'.repeat(100));
    for (const p of finalData) {
        console.log(p.code.padEnd(20) +
            (p.name || '').substring(0, 23).padEnd(25) +
            (p.address || '').substring(0, 28).padEnd(30) +
            (p.region || ''));
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
//# sourceMappingURL=seed-update-pangkalan-address.js.map