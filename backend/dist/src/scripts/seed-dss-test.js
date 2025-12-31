"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function sizeToLpgType(sizeKg) {
    const size = Number(sizeKg);
    switch (size) {
        case 3: return client_1.lpg_type.kg3;
        case 5.5: return client_1.lpg_type.kg5;
        case 12: return client_1.lpg_type.kg12;
        case 50: return client_1.lpg_type.kg50;
        default: return client_1.lpg_type.kg3;
    }
}
async function seedDSSTestData() {
    console.log('🧪 Starting DSS Test Data Seed...\n');
    try {
        console.log('📦 Setting up Low Stock Alert test data...');
        const products = await prisma.lpg_products.findMany({
            where: { is_active: true },
            take: 2
        });
        if (products.length > 0) {
            for (const product of products) {
                const stockIn = await prisma.stock_histories.aggregate({
                    where: { lpg_product_id: product.id, movement_type: 'MASUK' },
                    _sum: { qty: true }
                });
                const stockOut = await prisma.stock_histories.aggregate({
                    where: { lpg_product_id: product.id, movement_type: 'KELUAR' },
                    _sum: { qty: true }
                });
                const currentStock = (stockIn._sum.qty || 0) - (stockOut._sum.qty || 0);
                console.log(`  Current stock for ${product.name}: ${currentStock}`);
                if (currentStock >= 50) {
                    const reduceAmount = currentStock - 30;
                    if (reduceAmount > 0) {
                        await prisma.stock_histories.create({
                            data: {
                                lpg_product_id: product.id,
                                lpg_type: sizeToLpgType(product.size_kg),
                                movement_type: 'KELUAR',
                                qty: reduceAmount,
                                note: '🧪 [DSS TEST] Simulated stock reduction for alert testing',
                                timestamp: new Date()
                            }
                        });
                        console.log(`  ✅ Reduced ${product.name} by ${reduceAmount} units → Stock now: 30`);
                    }
                }
            }
        }
        else {
            console.log('  ⚠️ No products found to test');
        }
        console.log('\n💳 Setting up Payment Overdue Alert test data...');
        const pangkalan = await prisma.pangkalans.findFirst({
            where: { is_active: true }
        });
        if (pangkalan && products.length > 0) {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const orderCount = await prisma.orders.count();
            const orderCode = `ORD-TEST-${String(orderCount + 1).padStart(4, '0')}`;
            const pricePerUnit = Number(products[0].selling_price);
            const subTotal = pricePerUnit * 10;
            const order = await prisma.orders.create({
                data: {
                    code: orderCode,
                    pangkalan_id: pangkalan.id,
                    current_status: 'DIPROSES',
                    total_amount: 500000,
                    note: '🧪 [DSS TEST] Test order for payment overdue alert',
                    created_at: threeDaysAgo,
                    updated_at: threeDaysAgo,
                    order_items: {
                        create: {
                            lpg_type: sizeToLpgType(products[0].size_kg),
                            label: products[0].name,
                            price_per_unit: pricePerUnit,
                            qty: 10,
                            sub_total: subTotal
                        }
                    },
                    order_payment_details: {
                        create: {
                            is_paid: false,
                            is_dp: false,
                            amount_paid: 0,
                            created_at: threeDaysAgo,
                            updated_at: threeDaysAgo
                        }
                    }
                }
            });
            console.log(`  ✅ Created test order: ${order.code}`);
            console.log(`  📅 Order date: ${threeDaysAgo.toISOString()} (3 days ago)`);
            console.log(`  💰 Amount: Rp 500.000 (unpaid)`);
        }
        else {
            console.log('  ⚠️ No pangkalan or products found to create test order');
        }
        console.log('\n✅ DSS Test Data Seed Complete!');
        console.log('🔄 Refresh the dashboard to see alerts');
    }
    catch (error) {
        console.error('❌ Error seeding test data:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
seedDSSTestData()
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed-dss-test.js.map