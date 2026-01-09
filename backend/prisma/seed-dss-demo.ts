/**
 * SEED: DSS Demo Data & LPG Variety
 * 
 * Creates additional data for realistic DSS dashboard:
 * 1. Orders with various statuses (pending, urgent)
 * 2. Overdue payment orders
 * 3. Orders for 12kg and 50kg LPG
 * 4. Low stock for Bright Gas 220gr
 * 
 * Target Health Score: ~70-80%
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/seed-dss-demo.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// LPG Pricing (from database)
const LPG_PRICES = {
    'kg3': { cost: 18500, sell: 22000, label: 'LPG 3 kg (Subsidi)' },
    'kg12': { cost: 165000, sell: 185000, label: 'LPG 12 kg' },
    'kg50': { cost: 680000, sell: 750000, label: 'LPG 50 kg' },
};

async function main() {
    console.log('🎯 Seeding DSS Demo Data...\n');

    // Get dependencies
    const agen = await prisma.agen.findFirst();
    const admin = await prisma.users.findFirst({ where: { role: 'ADMIN' } });
    const pangkalans = await prisma.pangkalans.findMany({ take: 3 });
    const products = await prisma.lpg_products.findMany({ where: { is_active: true } });

    if (!agen || pangkalans.length === 0) {
        console.error('❌ Jalankan seed-penyaluran dulu!');
        return;
    }

    // Get product IDs
    const lpg3kg = products.find(p => Number(p.size_kg) === 3);
    const lpg12kg = products.find(p => Number(p.size_kg) === 12);
    const lpg50kg = products.find(p => Number(p.size_kg) === 50);
    const brightGas = products.find(p => Number(p.size_kg) < 1);

    console.log('📦 Products found:', {
        '3kg': lpg3kg?.name,
        '12kg': lpg12kg?.name,
        '50kg': lpg50kg?.name,
        '220gr': brightGas?.name,
    });

    // ============================================
    // CLEANUP: Delete previous DSS demo orders
    // ============================================
    console.log('\n🧹 Cleaning up previous DSS demo data...');

    // Delete DSS demo orders (ORD-P, ORD-U, ORD-D, ORD-L, ORD-B prefixes)
    const dssOrderPrefixes = ['ORD-P', 'ORD-U', 'ORD-D', 'ORD-L', 'ORD-B'];
    for (const prefix of dssOrderPrefixes) {
        const orders = await prisma.orders.findMany({
            where: { code: { startsWith: prefix } },
            select: { id: true }
        });

        if (orders.length > 0) {
            // Delete related records first
            await prisma.order_items.deleteMany({
                where: { order_id: { in: orders.map(o => o.id) } }
            });
            await prisma.order_payment_details.deleteMany({
                where: { order_id: { in: orders.map(o => o.id) } }
            });
            await prisma.orders.deleteMany({
                where: { id: { in: orders.map(o => o.id) } }
            });
            console.log(`  ✓ Deleted ${orders.length} orders with prefix ${prefix}`);
        }
    }

    // Delete 12kg and 50kg stock movements
    if (lpg12kg) {
        await prisma.stock_histories.deleteMany({
            where: { lpg_product_id: lpg12kg.id }
        });
    }
    if (lpg50kg) {
        await prisma.stock_histories.deleteMany({
            where: { lpg_product_id: lpg50kg.id }
        });
    }
    console.log('  ✓ Cleared 12kg/50kg stock histories');

    let orderNum = 500; // Start from 500 to avoid conflicts

    // ============================================
    // 1. PENDING ORDERS (status: DRAFT, MENUNGGU_PEMBAYARAN)
    // ============================================
    console.log('\n📋 Creating PENDING orders...');

    const pendingStatuses = ['DRAFT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES'];
    for (let i = 0; i < 3; i++) {
        const pkl = pangkalans[i % pangkalans.length];
        const status = pendingStatuses[i];
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - 1); // Yesterday

        const qty = 10 + Math.floor(Math.random() * 20);
        const subtotal = qty * LPG_PRICES.kg3.sell;

        const order = await prisma.orders.create({
            data: {
                code: `ORD-P${String(++orderNum).padStart(4, '0')}`,
                pangkalan_id: pkl.id,
                order_date: orderDate,
                current_status: status as any,
                subtotal,
                tax_amount: 0,
                total_amount: subtotal,
                note: `Order pending - status ${status}`,
            },
        });

        await prisma.order_items.create({
            data: {
                order_id: order.id,
                lpg_type: 'kg3',
                label: LPG_PRICES.kg3.label,
                price_per_unit: LPG_PRICES.kg3.sell,
                qty,
                sub_total: subtotal,
                is_taxable: false,
                tax_amount: 0,
            },
        });

        console.log(`  ✓ ${order.code} - ${status} (${qty} x 3kg)`);
    }

    // ============================================
    // 2. URGENT ORDERS (status: SIAP_KIRIM, DIKIRIM)
    // ============================================
    console.log('\n🚨 Creating URGENT orders...');

    const urgentStatuses = ['SIAP_KIRIM', 'DIKIRIM', 'SIAP_KIRIM'];
    for (let i = 0; i < 3; i++) {
        const pkl = pangkalans[i % pangkalans.length];
        const status = urgentStatuses[i];
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - 2); // 2 days ago

        const qty = 15 + Math.floor(Math.random() * 15);
        const subtotal = qty * LPG_PRICES.kg3.sell;

        const order = await prisma.orders.create({
            data: {
                code: `ORD-U${String(++orderNum).padStart(4, '0')}`,
                pangkalan_id: pkl.id,
                order_date: orderDate,
                current_status: status as any,
                subtotal,
                tax_amount: 0,
                total_amount: subtotal,
                note: `Order urgent - ${status}`,
            },
        });

        await prisma.order_items.create({
            data: {
                order_id: order.id,
                lpg_type: 'kg3',
                label: LPG_PRICES.kg3.label,
                price_per_unit: LPG_PRICES.kg3.sell,
                qty,
                sub_total: subtotal,
                is_taxable: false,
                tax_amount: 0,
            },
        });

        console.log(`  ✓ ${order.code} - ${status} (${qty} x 3kg) - URGENT!`);
    }

    // ============================================
    // 3. OVERDUE PAYMENT ORDERS
    // ============================================
    console.log('\n💸 Creating OVERDUE payment orders...');

    for (let i = 0; i < 2; i++) {
        const pkl = pangkalans[i];
        const daysAgo = 3 + i * 5; // 3 days and 8 days ago
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - daysAgo);

        const qty = 20 + Math.floor(Math.random() * 30);
        const subtotal = qty * LPG_PRICES.kg3.sell;

        const order = await prisma.orders.create({
            data: {
                code: `ORD-D${String(++orderNum).padStart(4, '0')}`,
                pangkalan_id: pkl.id,
                order_date: orderDate,
                current_status: 'DIPROSES',
                subtotal,
                tax_amount: 0,
                total_amount: subtotal,
                note: `Order dengan pembayaran tertunda ${daysAgo} hari`,
            },
        });

        // Create unpaid payment detail
        await prisma.order_payment_details.create({
            data: {
                order_id: order.id,
                is_paid: false,
                amount_paid: 0,
            },
        });

        await prisma.order_items.create({
            data: {
                order_id: order.id,
                lpg_type: 'kg3',
                label: LPG_PRICES.kg3.label,
                price_per_unit: LPG_PRICES.kg3.sell,
                qty,
                sub_total: subtotal,
                is_taxable: false,
                tax_amount: 0,
            },
        });

        console.log(`  ✓ ${order.code} - OVERDUE ${daysAgo} days (${qty} x 3kg = Rp ${subtotal.toLocaleString()})`);
    }

    // ============================================
    // 4. 12KG ORDERS (~25 orders across past week)
    // ============================================
    console.log('\n📦 Creating 12kg LPG orders...');
    let count12kg = 0;

    for (let i = 0; i < 7; i++) {
        // 3-4 orders per day to get ~25 total
        const ordersPerDay = 3 + Math.floor(Math.random() * 2);

        for (let j = 0; j < ordersPerDay; j++) {
            const pkl = pangkalans[Math.floor(Math.random() * pangkalans.length)];
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - i);
            // Add hour variation
            orderDate.setHours(8 + Math.floor(Math.random() * 10));

            const qty = 2 + Math.floor(Math.random() * 4); // 2-5 units
            const subtotal = qty * LPG_PRICES.kg12.sell;

            const order = await prisma.orders.create({
                data: {
                    code: `ORD-L${String(++orderNum).padStart(4, '0')}`,
                    pangkalan_id: pkl.id,
                    order_date: orderDate,
                    current_status: 'SELESAI',
                    subtotal,
                    tax_amount: 0,
                    total_amount: subtotal,
                    note: `Pesanan LPG 12kg`,
                },
            });

            await prisma.order_items.create({
                data: {
                    order_id: order.id,
                    lpg_type: 'kg12',
                    label: LPG_PRICES.kg12.label,
                    price_per_unit: LPG_PRICES.kg12.sell,
                    qty,
                    sub_total: subtotal,
                    is_taxable: false,
                    tax_amount: 0,
                },
            });

            // Stock movement
            if (lpg12kg) {
                await prisma.stock_histories.create({
                    data: {
                        lpg_product_id: lpg12kg.id,
                        lpg_type: 'kg12',
                        movement_type: 'KELUAR',
                        qty,
                        note: `Penyaluran 12kg ke ${pkl.name}`,
                        recorded_by_user_id: admin?.id,
                        timestamp: orderDate,
                    },
                });
            }
            count12kg++;
        }
    }
    console.log(`  ✓ Created ${count12kg} orders for 12kg LPG`);

    // ============================================
    // 5. 50KG ORDERS (~10 orders across past week)
    // ============================================
    console.log('\n🛢️ Creating 50kg LPG orders...');
    let count50kg = 0;

    for (let i = 0; i < 7; i++) {
        // 1-2 orders per day to get ~10 total
        const ordersPerDay = Math.random() > 0.3 ? 2 : 1;

        for (let j = 0; j < ordersPerDay; j++) {
            const pkl = pangkalans[Math.floor(Math.random() * pangkalans.length)];
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - i);
            orderDate.setHours(9 + Math.floor(Math.random() * 8));

            const qty = 1 + Math.floor(Math.random() * 3); // 1-3 units
            const subtotal = qty * LPG_PRICES.kg50.sell;

            const order = await prisma.orders.create({
                data: {
                    code: `ORD-B${String(++orderNum).padStart(4, '0')}`,
                    pangkalan_id: pkl.id,
                    order_date: orderDate,
                    current_status: 'SELESAI',
                    subtotal,
                    tax_amount: 0,
                    total_amount: subtotal,
                    note: `Pesanan LPG 50kg industri`,
                },
            });

            await prisma.order_items.create({
                data: {
                    order_id: order.id,
                    lpg_type: 'kg50',
                    label: LPG_PRICES.kg50.label,
                    price_per_unit: LPG_PRICES.kg50.sell,
                    qty,
                    sub_total: subtotal,
                    is_taxable: false,
                    tax_amount: 0,
                },
            });

            // Stock movement
            if (lpg50kg) {
                await prisma.stock_histories.create({
                    data: {
                        lpg_product_id: lpg50kg.id,
                        lpg_type: 'kg50',
                        movement_type: 'KELUAR',
                        qty,
                        note: `Penyaluran 50kg ke ${pkl.name}`,
                        recorded_by_user_id: admin?.id,
                        timestamp: orderDate,
                    },
                });
            }
            count50kg++;
        }
    }
    console.log(`  ✓ Created ${count50kg} orders for 50kg LPG`);

    // ============================================
    // 6. LOW STOCK - Bright Gas 220gr (no incoming, just very low)
    // ============================================
    console.log('\n⚠️ Setting LOW STOCK for Bright Gas 220gr...');

    if (brightGas) {
        // Clear any existing stock for Bright Gas
        await prisma.stock_histories.deleteMany({
            where: { lpg_product_id: brightGas.id },
        });

        // Add minimal stock (20 units only - below threshold of 50)
        await prisma.stock_histories.create({
            data: {
                lpg_product_id: brightGas.id,
                lpg_type: 'gr220',
                movement_type: 'MASUK',
                qty: 20, // Very low stock
                note: 'Initial low stock for Bright Gas demo',
                recorded_by_user_id: admin?.id,
                timestamp: new Date(),
            },
        });

        console.log(`  ✓ Bright Gas 220gr - Stock set to 20 units (CRITICAL)`);
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n═══════════════════════════════════════');
    console.log('✅ DSS Demo Seed Complete!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Expected Dashboard State:');
    console.log('   - Health Score: ~74% (100 - 10 low stock - 16 overdue)');
    console.log('   - Pending: 3 orders');
    console.log('   - Urgent: 3 orders (SIAP_KIRIM/DIKIRIM)');
    console.log('   - Low Stock: 1 product (Bright Gas 220gr)');
    console.log('   - Overdue: 2 payments');
    console.log('\n📦 LPG Variety:');
    console.log('   - 3kg: Many orders (existing + new)');
    console.log('   - 12kg: ~3-4 orders this week');
    console.log('   - 50kg: ~2-3 orders this week');
    console.log('   - 220gr: 0 orders (low stock demo)');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
