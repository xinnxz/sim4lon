/**
 * SEED REMAINING TABLES - PROFESSIONAL SYNC
 * 
 * Script ini mengisi semua tabel yang masih kosong:
 * 1. agen - PT Mitra Surya Natasya
 * 2. agen_orders - Order pangkalan ke agen via WhatsApp
 * 3. expenses - Pengeluaran pangkalan
 * 4. invoices - Invoice dari orders
 * 5. timeline_tracks - Timeline status order
 * 6. payment_records - Riwayat pembayaran
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/seed-complete-sync.ts
 */

import { PrismaClient, lpg_type, agen_order_status, status_pesanan, payment_method } from '@prisma/client';

const prisma = new PrismaClient();

// Target 8 pangkalans
const TARGET_PANGKALAN_CODES = [
    '343269997904002',  // AGUS
    '343262997904008',  // ASEP
    '343262997904002',  // DANG DANG
    '343262997904006',  // HERMAWAN SUTISNA
    '343269997904001',  // M. DIAN SUTISNA
    '343291199904001',  // MIMAH SITI ROHMAH
    '343262997904009',  // NAZRIL MUHAMMAD ILHAM
    '3432629979044010', // PANGKALAN REON (testing)
];

// Helper functions
function generateCode(prefix: string, num: number): string {
    return `${prefix}${String(num).padStart(4, '0')}`;
}

function randomDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       SEED COMPLETE SYNC - PROFESSIONAL                    ║');
    console.log('║       PT MITRA SURYA NATASYA                               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 1: CREATE AGEN - PT Mitra Surya Natasya
    // ═══════════════════════════════════════════════════════════════════════
    console.log('1️⃣ CREATING AGEN...');

    // Check if exists
    let agen = await prisma.agen.findFirst({ where: { name: { contains: 'Mitra Surya' } } });

    if (!agen) {
        agen = await prisma.agen.create({
            data: {
                code: 'AGN-001',
                name: 'PT Mitra Surya Natasya',
                address: 'Jl. Raya Industri No. 88, Kawasan Industri Cikarang, Bekasi, Jawa Barat 17530',
                pic_name: 'Bapak Surya Wijaya',
                phone: '021-89876543',
                email: 'info@mitrasuryaatasya.co.id',
                note: 'Distributor resmi LPG Pertamina wilayah Jabar',
                is_active: true,
            }
        });
        console.log(`   ✅ Created: ${agen.name}`);
    } else {
        console.log(`   ⏩ Already exists: ${agen.name}`);
    }

    // Link pangkalans to agen
    await prisma.pangkalans.updateMany({
        where: { code: { in: TARGET_PANGKALAN_CODES } },
        data: { agen_id: agen.id }
    });
    console.log('   ✅ Linked 8 pangkalans to agen\n');

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: CREATE AGEN_ORDERS (Order via WhatsApp)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('2️⃣ CREATING AGEN_ORDERS (Order via WhatsApp)...');

    // Clear existing
    await prisma.agen_orders.deleteMany({});

    const pangkalans = await prisma.pangkalans.findMany({
        where: { code: { in: TARGET_PANGKALAN_CODES } }
    });

    let agenOrderCount = 0;
    const statusOptions: agen_order_status[] = ['PENDING', 'DIKIRIM', 'DITERIMA', 'BATAL'];

    for (const pk of pangkalans) {
        // Each pangkalan has 3-5 agen orders
        const orderCount = randomInt(3, 5);

        for (let i = 0; i < orderCount; i++) {
            const daysAgo = randomInt(0, 14);
            const status = statusOptions[Math.min(Math.floor(daysAgo / 4), 3)]; // More recent = more likely pending
            const qty = randomInt(30, 100);

            await prisma.agen_orders.create({
                data: {
                    code: generateCode(`AO-${pk.code.slice(-3)}-`, agenOrderCount + 1),
                    pangkalan_id: pk.id,
                    agen_id: agen.id,
                    lpg_type: 'kg3',
                    qty_ordered: qty,
                    qty_received: status === 'DITERIMA' ? qty : (status === 'DIKIRIM' ? 0 : 0),
                    status: status,
                    order_date: randomDate(daysAgo),
                    received_date: status === 'DITERIMA' ? randomDate(daysAgo - 1) : null,
                    note: status === 'PENDING' ? 'Menunggu konfirmasi agen' :
                        status === 'DIKIRIM' ? 'Dalam pengiriman' :
                            status === 'DITERIMA' ? 'Barang sudah diterima' : 'Dibatalkan',
                }
            });
            agenOrderCount++;
        }
    }
    console.log(`   ✅ Created ${agenOrderCount} agen_orders\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: CREATE EXPENSES (Pengeluaran Pangkalan)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('3️⃣ CREATING EXPENSES...');

    // Clear existing
    await prisma.expenses.deleteMany({});

    const expenseCategories = [
        { category: 'Operasional', amounts: [50000, 100000, 150000] },
        { category: 'Transportasi', amounts: [30000, 75000, 120000] },
        { category: 'Gaji Karyawan', amounts: [500000, 1000000, 1500000] },
        { category: 'Maintenance', amounts: [100000, 250000, 500000] },
        { category: 'Listrik & Air', amounts: [200000, 350000, 500000] },
        { category: 'Lain-lain', amounts: [25000, 50000, 100000] },
    ];

    let expenseCount = 0;
    for (const pk of pangkalans) {
        // Each pangkalan has 5-10 expenses in last 30 days
        const numExpenses = randomInt(5, 10);

        for (let i = 0; i < numExpenses; i++) {
            const cat = expenseCategories[randomInt(0, expenseCategories.length - 1)];
            const amount = cat.amounts[randomInt(0, cat.amounts.length - 1)];

            await prisma.expenses.create({
                data: {
                    pangkalan_id: pk.id,
                    category: cat.category,
                    amount: amount,
                    description: `${cat.category} - ${pk.name}`,
                    expense_date: randomDate(randomInt(0, 30)),
                }
            });
            expenseCount++;
        }
    }
    console.log(`   ✅ Created ${expenseCount} expenses\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: CREATE TIMELINE_TRACKS (Order Status History)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('4️⃣ CREATING TIMELINE_TRACKS...');

    // Clear existing
    await prisma.timeline_tracks.deleteMany({});

    const orders = await prisma.orders.findMany({
        orderBy: { created_at: 'asc' }
    });

    let timelineCount = 0;
    const statusFlow: status_pesanan[] = ['DRAFT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES', 'SIAP_KIRIM', 'DIKIRIM', 'SELESAI'];
    const statusDescriptions: Record<string, string> = {
        'DRAFT': 'Pesanan dibuat',
        'MENUNGGU_PEMBAYARAN': 'Menunggu pembayaran dari pangkalan',
        'DIPROSES': 'Pembayaran diterima, pesanan diproses',
        'SIAP_KIRIM': 'Barang siap untuk dikirim',
        'DIKIRIM': 'Barang dalam pengiriman',
        'SELESAI': 'Pesanan selesai, barang diterima',
        'BATAL': 'Pesanan dibatalkan',
    };

    for (const order of orders) {
        const targetStatusIndex = statusFlow.indexOf(order.current_status);
        if (targetStatusIndex === -1) continue;

        let baseTime = new Date(order.created_at);

        for (let i = 0; i <= targetStatusIndex; i++) {
            const status = statusFlow[i];

            await prisma.timeline_tracks.create({
                data: {
                    order_id: order.id,
                    status: status,
                    description: statusDescriptions[status] || `Status: ${status}`,
                    note: i === 0 ? `Pesanan ${order.code} dibuat` : null,
                    created_at: baseTime,
                }
            });

            // Add time between statuses (1-4 hours)
            baseTime = new Date(baseTime.getTime() + randomInt(1, 4) * 60 * 60 * 1000);
            timelineCount++;
        }
    }
    console.log(`   ✅ Created ${timelineCount} timeline_tracks\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 5: CREATE INVOICES
    // ═══════════════════════════════════════════════════════════════════════
    console.log('5️⃣ CREATING INVOICES...');

    // Clear existing
    await prisma.invoices.deleteMany({});

    const paidOrders = await prisma.orders.findMany({
        where: { current_status: { in: ['DIPROSES', 'SIAP_KIRIM', 'DIKIRIM', 'SELESAI'] } },
        include: { pangkalans: true }
    });

    let invoiceCount = 0;
    for (const order of paidOrders) {
        const invoiceDate = new Date(order.created_at);
        invoiceDate.setHours(invoiceDate.getHours() + randomInt(1, 24));

        await prisma.invoices.create({
            data: {
                order_id: order.id,
                invoice_number: `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`,
                invoice_date: invoiceDate,
                due_date: new Date(invoiceDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
                billing_address: order.pangkalans.address,
                billed_to_name: order.pangkalans.name,
                sub_total: order.subtotal,
                tax_rate: 0,
                tax_amount: order.tax_amount,
                grand_total: order.total_amount,
                payment_status: order.current_status === 'SELESAI' ? 'PAID' : 'UNPAID',
            }
        });
        invoiceCount++;
    }
    console.log(`   ✅ Created ${invoiceCount} invoices\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 6: CREATE PAYMENT_RECORDS
    // ═══════════════════════════════════════════════════════════════════════
    console.log('6️⃣ CREATING PAYMENT_RECORDS...');

    // Clear existing
    await prisma.payment_records.deleteMany({});

    // Get admin user for recorded_by
    const adminUser = await prisma.users.findFirst({ where: { role: 'ADMIN' } });

    if (!adminUser) {
        console.log('   ⚠️ No admin user found, skipping payment_records');
    } else {
        const invoices = await prisma.invoices.findMany({
            where: { payment_status: 'PAID' },
            include: { orders: true }
        });

        let paymentCount = 0;
        const methods: payment_method[] = ['TUNAI', 'TRANSFER'];

        for (const invoice of invoices) {
            const paymentDate = new Date(invoice.invoice_date);
            paymentDate.setHours(paymentDate.getHours() + randomInt(1, 48));

            await prisma.payment_records.create({
                data: {
                    order_id: invoice.order_id,
                    invoice_id: invoice.id,
                    method: methods[randomInt(0, 1)],
                    amount: invoice.grand_total,
                    payment_time: paymentDate,
                    recorded_by_user_id: adminUser.id,
                    note: `Pembayaran untuk ${invoice.invoice_number}`,
                }
            });
            paymentCount++;
        }
        console.log(`   ✅ Created ${paymentCount} payment_records\n`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 7: ADD ACTIVITY LOGS
    // ═══════════════════════════════════════════════════════════════════════
    console.log('7️⃣ ADDING ACTIVITY LOGS...');

    const recentOrders = await prisma.orders.findMany({
        take: 20,
        orderBy: { created_at: 'desc' },
        include: { pangkalans: true }
    });

    let logCount = 0;
    const logTypes = [
        { type: 'order_created', title: 'Pesanan Baru', icon: 'ShoppingCart' },
        { type: 'payment_received', title: 'Pembayaran Diterima', icon: 'CreditCard' },
        { type: 'stock_updated', title: 'Stok Diupdate', icon: 'Package' },
    ];

    for (const order of recentOrders) {
        const logType = logTypes[randomInt(0, logTypes.length - 1)];

        await prisma.activity_logs.create({
            data: {
                user_id: adminUser?.id,
                order_id: order.id,
                type: logType.type,
                title: logType.title,
                description: `${logType.title} - ${order.code} dari ${order.pangkalans.name}`,
                pangkalan_name: order.pangkalans.name,
                detail_numeric: order.total_amount,
                icon_name: logType.icon,
                order_status: order.current_status,
                timestamp: order.created_at,
            }
        });
        logCount++;
    }
    console.log(`   ✅ Added ${logCount} activity_logs\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // FINAL SUMMARY
    // ═══════════════════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    SYNC COMPLETE                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Final counts
    const counts = {
        agen: await prisma.agen.count(),
        agen_orders: await prisma.agen_orders.count(),
        expenses: await prisma.expenses.count(),
        timeline_tracks: await prisma.timeline_tracks.count(),
        invoices: await prisma.invoices.count(),
        payment_records: await prisma.payment_records.count(),
        activity_logs: await prisma.activity_logs.count(),
    };

    console.log('📊 FINAL COUNTS:');
    console.log(`   agen            : ${counts.agen}`);
    console.log(`   agen_orders     : ${counts.agen_orders}`);
    console.log(`   expenses        : ${counts.expenses}`);
    console.log(`   timeline_tracks : ${counts.timeline_tracks}`);
    console.log(`   invoices        : ${counts.invoices}`);
    console.log(`   payment_records : ${counts.payment_records}`);
    console.log(`   activity_logs   : ${counts.activity_logs}`);

    console.log('\n✅ ALL TABLES SYNCED SUCCESSFULLY!\n');
}

main()
    .catch(e => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
