/**
 * Script to reset and seed consumer_orders for pangkalan@test.com
 * Run: npx ts-node scripts/seed-pangkalan-orders.ts
 */

import { PrismaClient, lpg_type } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting seed process...');

    // Step 1: Find pangkalan_id for pangkalan@test.com
    const user = await prisma.users.findFirst({
        where: { email: 'pangkalan@test.com' },
        select: { pangkalan_id: true }
    });

    if (!user?.pangkalan_id) {
        throw new Error('Pangkalan not found for email pangkalan@test.com');
    }

    const pangkalanId = user.pangkalan_id;
    console.log(`✅ Found pangkalan_id: ${pangkalanId}`);

    // Step 2: Delete existing consumer_orders for this pangkalan
    const deleted = await prisma.consumer_orders.deleteMany({
        where: { pangkalan_id: pangkalanId }
    });
    console.log(`🗑️ Deleted ${deleted.count} existing consumer_orders`);

    // Step 3: Get existing consumers for this pangkalan
    let consumers = await prisma.consumers.findMany({
        where: { pangkalan_id: pangkalanId, is_active: true },
        select: { id: true, name: true }
    });

    // Create default consumers if none exist
    if (consumers.length === 0) {
        console.log('📝 Creating default consumers...');
        await prisma.consumers.createMany({
            data: [
                { pangkalan_id: pangkalanId, name: 'Warung Madura', consumer_type: 'WARUNG' },
                { pangkalan_id: pangkalanId, name: 'Ibu Siti', consumer_type: 'RUMAH_TANGGA' },
                { pangkalan_id: pangkalanId, name: 'Pak Ahmad', consumer_type: 'RUMAH_TANGGA' },
                { pangkalan_id: pangkalanId, name: 'Warung Padang', consumer_type: 'WARUNG' },
                { pangkalan_id: pangkalanId, name: 'Bu Ani', consumer_type: 'RUMAH_TANGGA' },
            ]
        });
        consumers = await prisma.consumers.findMany({
            where: { pangkalan_id: pangkalanId, is_active: true },
            select: { id: true, name: true }
        });
    }
    console.log(`👥 Found ${consumers.length} consumers`);

    // Step 4: Generate random transactions from Dec 1-22, 2025
    const ordersToCreate: any[] = [];
    let orderCounter = 1;

    // LPG type config
    const lpgConfig = {
        kg3: { price: { min: 18000, max: 21000 }, cost: 16000, weight: 0.7 },
        kg5: { price: { min: 65000, max: 70000 }, cost: 52000, weight: 0.2 },
        kg12: { price: { min: 165000, max: 175000 }, cost: 142000, weight: 0.1 },
    };

    for (let day = 1; day <= 22; day++) {
        // Random 5-12 transactions per day
        const transactionsPerDay = 5 + Math.floor(Math.random() * 8);

        for (let i = 0; i < transactionsPerDay; i++) {
            // Random lpg type based on weight
            let lpgType: lpg_type;
            const rand = Math.random();
            if (rand < 0.7) {
                lpgType = 'kg3';
            } else if (rand < 0.9) {
                lpgType = 'kg5';
            } else {
                lpgType = 'kg12';
            }

            const config = lpgConfig[lpgType];
            const pricePerUnit = config.price.min + Math.floor(Math.random() * (config.price.max - config.price.min));
            const costPrice = config.cost;
            const qty = 1 + Math.floor(Math.random() * 5); // 1-5
            const totalAmount = qty * pricePerUnit;

            // Random consumer
            const consumer = consumers[Math.floor(Math.random() * consumers.length)];

            // Sale date (random hour 8-18)
            const hour = 8 + Math.floor(Math.random() * 10);
            const minute = Math.floor(Math.random() * 60);
            const saleDate = new Date(2025, 11, day, hour, minute, 0); // Month is 0-indexed, so 11 = December

            ordersToCreate.push({
                code: `P${orderCounter.toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
                pangkalan_id: pangkalanId,
                consumer_id: consumer.id,
                lpg_type: lpgType,
                qty,
                price_per_unit: pricePerUnit,
                cost_price: costPrice,
                total_amount: totalAmount,
                payment_status: 'LUNAS',
                sale_date: saleDate,
                created_at: saleDate,
                updated_at: saleDate,
            });

            orderCounter++;
        }
        console.log(`📅 Day ${day}: ${transactionsPerDay} transactions`);
    }

    console.log(`📦 Total orders to create: ${ordersToCreate.length}`);
    console.log(`📆 Date range: ${ordersToCreate[0].sale_date} - ${ordersToCreate[ordersToCreate.length - 1].sale_date}`);

    // Insert all orders
    const created = await prisma.consumer_orders.createMany({
        data: ordersToCreate,
        skipDuplicates: true,
    });

    console.log(`✅ Generated ${created.count} transactions from Dec 1-22, 2025`);

    // Summary
    const summary = await prisma.$queryRaw`
    SELECT 
      DATE(sale_date) as tanggal,
      COUNT(*) as total_transaksi,
      SUM(qty) as total_qty,
      SUM(total_amount) as total_penjualan
    FROM consumer_orders
    WHERE pangkalan_id = ${pangkalanId}::uuid
    GROUP BY DATE(sale_date)
    ORDER BY tanggal DESC
    LIMIT 10
  `;

    console.log('\n📊 Summary (last 10 days):');
    console.table(summary);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
