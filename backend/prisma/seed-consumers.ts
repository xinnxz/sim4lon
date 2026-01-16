/**
 * SEED KONSUMEN DATA
 * 
 * Membuat data konsumen lengkap per pangkalan:
 * - NIK (16 digit)
 * - KK (16 digit)
 * - Phone
 * - Address
 * - Type (RUMAH_TANGGA / WARUNG)
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/seed-consumers.ts
 */

import { PrismaClient, consumer_type } from '@prisma/client';

const prisma = new PrismaClient();

// Data konsumen sample - 20 konsumen dengan data lengkap
const CONSUMER_DATA = [
    // RUMAH TANGGA (10 orang)
    {
        name: 'Siti Fatimah',
        nik: '3201234567890001',
        kk: '3201234567890001',
        phone: '081234567801',
        address: 'Jl. Melati No. 1, RT 01/RW 01, Kel. Sukamaju',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Ahmad Hidayat',
        nik: '3201234567890002',
        kk: '3201234567890002',
        phone: '081234567802',
        address: 'Jl. Mawar No. 5, RT 02/RW 01, Kel. Sukamaju',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Dewi Sartika',
        nik: '3201234567890003',
        kk: '3201234567890003',
        phone: '081234567803',
        address: 'Jl. Anggrek No. 10, RT 03/RW 02, Kel. Sukamakmur',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Budi Santoso',
        nik: '3201234567890004',
        kk: '3201234567890004',
        phone: '081234567804',
        address: 'Jl. Dahlia No. 15, RT 01/RW 03, Kel. Sukamakmur',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Ratna Wulandari',
        nik: '3201234567890005',
        kk: '3201234567890005',
        phone: '081234567805',
        address: 'Jl. Kenanga No. 20, RT 02/RW 03, Kel. Sukajaya',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Hendra Gunawan',
        nik: '3201234567890006',
        kk: '3201234567890006',
        phone: '081234567806',
        address: 'Jl. Flamboyan No. 8, RT 04/RW 01, Kel. Sukajaya',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Sri Mulyani',
        nik: '3201234567890007',
        kk: '3201234567890007',
        phone: '081234567807',
        address: 'Jl. Cemara No. 12, RT 05/RW 02, Kel. Sukamulya',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Andi Prasetyo',
        nik: '3201234567890008',
        kk: '3201234567890008',
        phone: '081234567808',
        address: 'Jl. Pinus No. 3, RT 01/RW 04, Kel. Sukamulya',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Yuni Astuti',
        nik: '3201234567890009',
        kk: '3201234567890009',
        phone: '081234567809',
        address: 'Jl. Akasia No. 7, RT 02/RW 04, Kel. Sukaasih',
        type: 'RUMAH_TANGGA' as consumer_type,
    },
    {
        name: 'Bambang Sutrisno',
        nik: '3201234567890010',
        kk: '3201234567890010',
        phone: '081234567810',
        address: 'Jl. Jati No. 9, RT 03/RW 05, Kel. Sukaasih',
        type: 'RUMAH_TANGGA' as consumer_type,
    },

    // WARUNG (10 usaha)
    {
        name: 'Warung Berkah Jaya',
        nik: '3201234567891001',
        kk: '3201234567891001',
        phone: '081234567811',
        address: 'Jl. Pasar Baru No. 1, RT 01/RW 01, Kel. Sukamaju',
        type: 'WARUNG' as consumer_type,
        note: 'Warung sembako & gas',
    },
    {
        name: 'Warung Maju Bersama',
        nik: '3201234567891002',
        kk: '3201234567891002',
        phone: '081234567812',
        address: 'Jl. Pasar Baru No. 5, RT 01/RW 01, Kel. Sukamaju',
        type: 'WARUNG' as consumer_type,
        note: 'Warung makan & gas',
    },
    {
        name: 'Toko Sinar Harapan',
        nik: '3201234567891003',
        kk: '3201234567891003',
        phone: '081234567813',
        address: 'Jl. Raya Utama No. 10, RT 02/RW 02, Kel. Sukamakmur',
        type: 'WARUNG' as consumer_type,
        note: 'Toko kelontong',
    },
    {
        name: 'Warung Bu Ani',
        nik: '3201234567891004',
        kk: '3201234567891004',
        phone: '081234567814',
        address: 'Jl. Gang Mesjid No. 2, RT 03/RW 02, Kel. Sukamakmur',
        type: 'WARUNG' as consumer_type,
        note: 'Warung nasi uduk',
    },
    {
        name: 'Kedai Pak Hasan',
        nik: '3201234567891005',
        kk: '3201234567891005',
        phone: '081234567815',
        address: 'Jl. Stasiun No. 15, RT 01/RW 03, Kel. Sukajaya',
        type: 'WARUNG' as consumer_type,
        note: 'Kedai kopi & gorengan',
    },
    {
        name: 'Warung Barokah',
        nik: '3201234567891006',
        kk: '3201234567891006',
        phone: '081234567816',
        address: 'Jl. Kampung Baru No. 8, RT 02/RW 03, Kel. Sukajaya',
        type: 'WARUNG' as consumer_type,
        note: 'Warung sembako',
    },
    {
        name: 'Warung Sate Madura',
        nik: '3201234567891007',
        kk: '3201234567891007',
        phone: '081234567817',
        address: 'Jl. Raya Selatan No. 20, RT 04/RW 04, Kel. Sukamulya',
        type: 'WARUNG' as consumer_type,
        note: 'Warung sate',
    },
    {
        name: 'Toko Serba Ada',
        nik: '3201234567891008',
        kk: '3201234567891008',
        phone: '081234567818',
        address: 'Jl. Pasar Minggu No. 3, RT 01/RW 05, Kel. Sukamulya',
        type: 'WARUNG' as consumer_type,
        note: 'Toko kelontong lengkap',
    },
    {
        name: 'Warung Soto Lamongan',
        nik: '3201234567891009',
        kk: '3201234567891009',
        phone: '081234567819',
        address: 'Jl. Terminal No. 5, RT 02/RW 05, Kel. Sukaasih',
        type: 'WARUNG' as consumer_type,
        note: 'Warung soto',
    },
    {
        name: 'Kedai Ayam Goreng',
        nik: '3201234567891010',
        kk: '3201234567891010',
        phone: '081234567820',
        address: 'Jl. Alun-alun No. 12, RT 03/RW 05, Kel. Sukaasih',
        type: 'WARUNG' as consumer_type,
        note: 'Kedai ayam goreng',
    },
];

async function main() {
    console.log('🔄 SEED CONSUMERS DATA\n');
    console.log('='.repeat(60));

    // Target 8 pangkalans: 7 with penyaluran + REON for testing
    const targetPangkalanCodes = [
        '343269997904002',  // AGUS
        '343262997904008',  // ASEP
        '343262997904002',  // DANG DANG
        '343262997904006',  // HERMAWAN SUTISNA
        '343269997904001',  // M. DIAN SUTISNA
        '343291199904001',  // MIMAH SITI ROHMAH
        '343262997904009',  // NAZRIL MUHAMMAD ILHAM
        '3432629979044010', // PANGKALAN REON (testing)
    ];

    // Get these pangkalans
    const pangkalans = await prisma.pangkalans.findMany({
        where: {
            code: { in: targetPangkalanCodes },
            is_active: true
        },
        orderBy: { code: 'asc' },
    });

    console.log(`📦 Found ${pangkalans.length} target pangkalans (expected: 8)\n`);

    // Clear existing consumers for these pangkalans
    console.log('🗑️  Clearing existing consumers...');
    for (const pk of pangkalans) {
        const deleted = await prisma.consumers.deleteMany({
            where: { pangkalan_id: pk.id }
        });
        if (deleted.count > 0) {
            console.log(`   Deleted ${deleted.count} from ${pk.name}`);
        }
    }

    let totalCreated = 0;

    for (const pangkalan of pangkalans) {
        console.log(`\n━━━ ${pangkalan.name} ━━━`);

        // Create consumers for this pangkalan
        // Each pangkalan gets 10-15 consumers (mix of RUMAH_TANGGA and WARUNG)
        const consumerCount = 10 + Math.floor(Math.random() * 6); // 10-15 consumers
        const shuffled = [...CONSUMER_DATA].sort(() => Math.random() - 0.5);
        const consumersToCreate = shuffled.slice(0, consumerCount);

        for (const consumer of consumersToCreate) {
            // Modify NIK/KK to be unique per pangkalan
            const suffix = pangkalan.code.replace('PKL-', '').slice(-3);
            const uniqueNik = consumer.nik.slice(0, 13) + suffix;
            const uniqueKk = consumer.kk.slice(0, 13) + suffix;

            await prisma.consumers.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    name: consumer.name,
                    nik: uniqueNik,
                    kk: uniqueKk,
                    phone: consumer.phone,
                    address: consumer.address,
                    consumer_type: consumer.type,
                    note: (consumer as any).note || null,
                    is_active: true,
                }
            });

            totalCreated++;
            console.log(`   ✅ ${consumer.name} (${consumer.type})`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ SEED COMPLETE! Created ${totalCreated} consumers\n`);

    // Summary
    const summary = await prisma.consumers.groupBy({
        by: ['consumer_type'],
        _count: { id: true }
    });

    console.log('📊 SUMMARY:');
    for (const s of summary) {
        console.log(`   ${s.consumer_type}: ${s._count.id} consumers`);
    }

    const totalConsumers = await prisma.consumers.count();
    console.log(`\n   TOTAL: ${totalConsumers} consumers`);
}

main()
    .catch(e => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
