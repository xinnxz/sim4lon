/**
 * SYNC PANGKALAN DATA
 * 
 * Script untuk menyinkronkan data pangkalan agar konsisten:
 * 1. Hitung stok dari orders SELESAI (masuk) dan consumer_orders (keluar)
 * 2. Buat stock movements yang sesuai
 * 3. Buat agen_orders sample (order via WhatsApp)
 * 
 * CARA PAKAI:
 * cd backend
 * npx ts-node prisma/sync-pangkalan-data.ts
 */

import { PrismaClient, lpg_type, agen_order_status } from '@prisma/client';

const prisma = new PrismaClient();

// Helper untuk generate kode
function generateCode(prefix: string, num: number): string {
    return `${prefix}${String(num).padStart(3, '0')}`;
}

async function main() {
    console.log('🔄 SYNC PANGKALAN DATA\n');

    // 1. Ambil semua pangkalan aktif
    const pangkalans = await prisma.pangkalans.findMany({
        where: { is_active: true },
        include: {
            agen: true,
        }
    });

    console.log(`📦 Found ${pangkalans.length} pangkalan(s)\n`);

    for (const pangkalan of pangkalans) {
        console.log(`\n━━━ ${pangkalan.name} (${pangkalan.code}) ━━━`);

        // 2. Hitung stok MASUK dari orders yang SELESAI ke pangkalan ini
        const completedOrders = await prisma.orders.findMany({
            where: {
                pangkalan_id: pangkalan.id,
                current_status: 'SELESAI',
            },
            include: {
                order_items: true,
            }
        });

        // Sum stok masuk per lpg_type
        const stockIn: Record<string, number> = {};
        for (const order of completedOrders) {
            for (const item of order.order_items) {
                const type = item.lpg_type;
                stockIn[type] = (stockIn[type] || 0) + item.qty;
            }
        }

        console.log(`📥 Stok MASUK (dari ${completedOrders.length} orders SELESAI):`, stockIn);

        // 3. Hitung stok KELUAR dari penjualan ke konsumen
        const consumerSales = await prisma.consumer_orders.findMany({
            where: { pangkalan_id: pangkalan.id }
        });

        const stockOut: Record<string, number> = {};
        for (const sale of consumerSales) {
            const type = sale.lpg_type;
            stockOut[type] = (stockOut[type] || 0) + sale.qty;
        }

        console.log(`📤 Stok KELUAR (dari ${consumerSales.length} penjualan):`, stockOut);

        // 4. Hitung stok final
        const allTypes = new Set([...Object.keys(stockIn), ...Object.keys(stockOut)]);

        for (const lpgType of allTypes) {
            const masuk = stockIn[lpgType] || 0;
            const keluar = stockOut[lpgType] || 0;
            const finalQty = masuk - keluar;

            // Ensure qty is never negative (add initial stock if needed)
            const adjustedQty = Math.max(0, finalQty);

            console.log(`  - ${lpgType}: ${masuk} masuk - ${keluar} keluar = ${adjustedQty} unit`);

            // 5. Update pangkalan_stocks
            const existingStock = await prisma.pangkalan_stocks.findFirst({
                where: {
                    pangkalan_id: pangkalan.id,
                    lpg_type: lpgType as lpg_type,
                }
            });

            if (existingStock) {
                await prisma.pangkalan_stocks.update({
                    where: { id: existingStock.id },
                    data: {
                        qty: adjustedQty,
                        updated_at: new Date(),
                    }
                });
            } else {
                await prisma.pangkalan_stocks.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        lpg_type: lpgType as lpg_type,
                        qty: adjustedQty,
                        warning_level: 20,
                        critical_level: 10,
                    }
                });
            }
        }

        // 6. Buat sample agen_orders jika belum ada
        const existingAgenOrders = await prisma.agen_orders.count({
            where: { pangkalan_id: pangkalan.id }
        });

        if (existingAgenOrders === 0 && pangkalan.agen_id) {
            console.log(`\n📱 Creating sample agen_orders (order via WA)...`);

            // Buat 3 sample agen orders
            const sampleOrders = [
                { lpgType: 'kg3', qty: 50, status: 'DITERIMA', daysAgo: 5 },
                { lpgType: 'kg3', qty: 30, status: 'DITERIMA', daysAgo: 2 },
                { lpgType: 'kg12', qty: 10, status: 'PENDING', daysAgo: 0 },
            ];

            let orderNum = 1;
            for (const order of sampleOrders) {
                const orderDate = new Date();
                orderDate.setDate(orderDate.getDate() - order.daysAgo);

                await prisma.agen_orders.create({
                    data: {
                        code: generateCode(`AO-${pangkalan.code.replace('PKL-', '')}-`, orderNum),
                        pangkalan_id: pangkalan.id,
                        agen_id: pangkalan.agen_id,
                        lpg_type: order.lpgType as lpg_type,
                        qty_ordered: order.qty,
                        qty_received: order.status === 'DITERIMA' ? order.qty : 0,
                        status: order.status as agen_order_status,
                        order_date: orderDate,
                        received_date: order.status === 'DITERIMA' ? orderDate : null,
                        note: order.status === 'PENDING' ? 'Menunggu pengiriman dari agen' : null,
                    }
                });

                console.log(`  ✅ AO-${orderNum}: ${order.qty} ${order.lpgType} (${order.status})`);
                orderNum++;
            }
        }

        // 7. Pastikan lpg_prices ada untuk pangkalan
        const existingPrices = await prisma.lpg_prices.count({
            where: { pangkalan_id: pangkalan.id }
        });

        if (existingPrices === 0) {
            console.log(`\n💰 Creating default lpg_prices...`);

            const defaultPrices = [
                { lpg_type: 'kg3', cost_price: 14000, selling_price: 16000 },
                { lpg_type: 'kg5', cost_price: 29000, selling_price: 32000 },
                { lpg_type: 'kg12', cost_price: 135000, selling_price: 150000 },
                { lpg_type: 'kg50', cost_price: 570000, selling_price: 610000 },
            ];

            for (const price of defaultPrices) {
                await prisma.lpg_prices.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        lpg_type: price.lpg_type as lpg_type,
                        cost_price: price.cost_price,
                        selling_price: price.selling_price,
                        is_active: true,
                    }
                });
                console.log(`  ✅ ${price.lpg_type}: Modal ${price.cost_price}, Jual ${price.selling_price}`);
            }
        }
    }

    console.log('\n\n✅ SYNC COMPLETE!');

    // Summary
    const stockSummary = await prisma.pangkalan_stocks.groupBy({
        by: ['lpg_type'],
        _sum: { qty: true }
    });

    console.log('\n📊 STOCK SUMMARY (All Pangkalan):');
    for (const s of stockSummary) {
        console.log(`  ${s.lpg_type}: ${s._sum.qty} unit`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
