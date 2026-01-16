"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function generateCode(prefix, num) {
    return `${prefix}${String(num).padStart(3, '0')}`;
}
async function main() {
    console.log('🔄 SYNC PANGKALAN DATA\n');
    const pangkalans = await prisma.pangkalans.findMany({
        where: { is_active: true },
        include: {
            agen: true,
        }
    });
    console.log(`📦 Found ${pangkalans.length} pangkalan(s)\n`);
    for (const pangkalan of pangkalans) {
        console.log(`\n━━━ ${pangkalan.name} (${pangkalan.code}) ━━━`);
        const completedOrders = await prisma.orders.findMany({
            where: {
                pangkalan_id: pangkalan.id,
                current_status: 'SELESAI',
            },
            include: {
                order_items: true,
            }
        });
        const stockIn = {};
        for (const order of completedOrders) {
            for (const item of order.order_items) {
                const type = item.lpg_type;
                stockIn[type] = (stockIn[type] || 0) + item.qty;
            }
        }
        console.log(`📥 Stok MASUK (dari ${completedOrders.length} orders SELESAI):`, stockIn);
        const consumerSales = await prisma.consumer_orders.findMany({
            where: { pangkalan_id: pangkalan.id }
        });
        const stockOut = {};
        for (const sale of consumerSales) {
            const type = sale.lpg_type;
            stockOut[type] = (stockOut[type] || 0) + sale.qty;
        }
        console.log(`📤 Stok KELUAR (dari ${consumerSales.length} penjualan):`, stockOut);
        const allTypes = new Set([...Object.keys(stockIn), ...Object.keys(stockOut)]);
        for (const lpgType of allTypes) {
            const masuk = stockIn[lpgType] || 0;
            const keluar = stockOut[lpgType] || 0;
            const finalQty = masuk - keluar;
            const adjustedQty = Math.max(0, finalQty);
            console.log(`  - ${lpgType}: ${masuk} masuk - ${keluar} keluar = ${adjustedQty} unit`);
            const existingStock = await prisma.pangkalan_stocks.findFirst({
                where: {
                    pangkalan_id: pangkalan.id,
                    lpg_type: lpgType,
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
            }
            else {
                await prisma.pangkalan_stocks.create({
                    data: {
                        pangkalan_id: pangkalan.id,
                        lpg_type: lpgType,
                        qty: adjustedQty,
                        warning_level: 20,
                        critical_level: 10,
                    }
                });
            }
        }
        const existingAgenOrders = await prisma.agen_orders.count({
            where: { pangkalan_id: pangkalan.id }
        });
        if (existingAgenOrders === 0 && pangkalan.agen_id) {
            console.log(`\n📱 Creating sample agen_orders (order via WA)...`);
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
                        lpg_type: order.lpgType,
                        qty_ordered: order.qty,
                        qty_received: order.status === 'DITERIMA' ? order.qty : 0,
                        status: order.status,
                        order_date: orderDate,
                        received_date: order.status === 'DITERIMA' ? orderDate : null,
                        note: order.status === 'PENDING' ? 'Menunggu pengiriman dari agen' : null,
                    }
                });
                console.log(`  ✅ AO-${orderNum}: ${order.qty} ${order.lpgType} (${order.status})`);
                orderNum++;
            }
        }
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
                        lpg_type: price.lpg_type,
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
//# sourceMappingURL=sync-pangkalan-data.js.map