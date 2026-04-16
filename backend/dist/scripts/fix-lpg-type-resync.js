"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function sizeKgToLpgType(sizeKg) {
    if (sizeKg <= 0.3)
        return 'gr220';
    if (Math.abs(sizeKg - 3) < 0.1)
        return 'kg3';
    if (Math.abs(sizeKg - 5.5) < 0.1 || Math.abs(sizeKg - 5) < 0.1)
        return 'kg5';
    if (Math.abs(sizeKg - 12) < 0.1)
        return 'kg12';
    if (Math.abs(sizeKg - 50) < 0.1)
        return 'kg50';
    return 'kg3';
}
async function main() {
    console.log('🔧 Starting LPG Type Fix & Penyaluran Resync...\n');
    const products = await prisma.lpg_products.findMany({
        select: { id: true, name: true, size_kg: true },
    });
    console.log(`📦 Found ${products.length} LPG products`);
    const productByName = new Map(products.map(p => [p.name.toLowerCase().trim(), p]));
    const orderItems = await prisma.order_items.findMany({
        where: { label: { not: null } },
        select: { id: true, lpg_type: true, label: true },
    });
    console.log(`📋 Found ${orderItems.length} order items with labels`);
    let fixedCount = 0;
    for (const item of orderItems) {
        if (!item.label)
            continue;
        const labelLower = item.label.toLowerCase().trim();
        let matchedProduct = productByName.get(labelLower);
        if (!matchedProduct) {
            for (const [name, p] of productByName) {
                if (labelLower.includes(name) || name.includes(labelLower)) {
                    matchedProduct = p;
                    break;
                }
            }
        }
        if (!matchedProduct)
            continue;
        const correctLpgType = sizeKgToLpgType(Number(matchedProduct.size_kg));
        if (item.lpg_type !== correctLpgType) {
            await prisma.order_items.update({
                where: { id: item.id },
                data: { lpg_type: correctLpgType },
            });
            console.log(`  ✅ Fixed: ${item.lpg_type} → ${correctLpgType} (${item.label})`);
            fixedCount++;
        }
    }
    console.log(`\n🔧 Fixed ${fixedCount} order items\n`);
    const deletedCount = await prisma.penyaluran_harian.deleteMany({});
    console.log(`🗑️ Cleared ${deletedCount.count} penyaluran_harian records\n`);
    const completedOrders = await prisma.orders.findMany({
        where: { current_status: 'SELESAI' },
        include: {
            order_items: true,
        },
    });
    console.log(`📦 Found ${completedOrders.length} completed orders to process`);
    let syncedCount = 0;
    for (const order of completedOrders) {
        const orderDate = order.order_date || order.created_at;
        const dateOnly = new Date(orderDate);
        dateOnly.setHours(0, 0, 0, 0);
        for (const item of order.order_items) {
            try {
                await prisma.penyaluran_harian.upsert({
                    where: {
                        pangkalan_id_tanggal_lpg_type: {
                            pangkalan_id: order.pangkalan_id,
                            tanggal: dateOnly,
                            lpg_type: item.lpg_type,
                        },
                    },
                    create: {
                        pangkalan_id: order.pangkalan_id,
                        tanggal: dateOnly,
                        lpg_type: item.lpg_type,
                        jumlah_normal: item.qty,
                        jumlah_fakultatif: 0,
                        tipe_pembayaran: 'CASHLESS',
                    },
                    update: {
                        jumlah_normal: { increment: item.qty },
                    },
                });
                syncedCount++;
            }
            catch (err) {
                console.error(`  ❌ Error syncing order ${order.code}, item ${item.lpg_type}:`, err);
            }
        }
    }
    console.log(`\n✅ Synced ${syncedCount} penyaluran records from orders\n`);
    const finalStats = await prisma.penyaluran_harian.groupBy({
        by: ['lpg_type'],
        _count: { id: true },
        _sum: { jumlah_normal: true, jumlah_fakultatif: true },
    });
    console.log('📊 Final Penyaluran Stats by LPG Type:');
    console.log('────────────────────────────────────');
    for (const stat of finalStats) {
        const total = (stat._sum?.jumlah_normal || 0) + (stat._sum?.jumlah_fakultatif || 0);
        console.log(`  ${stat.lpg_type}: ${stat._count?.id || 0} records, total ${total} units`);
    }
    console.log('\n🎉 Migration complete!');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=fix-lpg-type-resync.js.map