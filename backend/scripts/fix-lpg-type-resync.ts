/**
 * Migration Script: Fix LPG Type Mapping & Resync Penyaluran
 * 
 * PENJELASAN:
 * Script ini akan:
 * 1. Query semua order_items dengan label
 * 2. Fix lpg_type berdasarkan label matching ke lpg_products
 * 3. Clear penyaluran_harian table
 * 4. Re-generate penyaluran_harian dari orders yang SELESAI
 * 
 * CARA PAKAI:
 * npx ts-node scripts/fix-lpg-type-resync.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Convert size_kg to Prisma enum name (as string)
function sizeKgToLpgType(sizeKg: number): string {
    if (sizeKg <= 0.3) return 'gr220';      // 220gr Bright Gas Can
    if (Math.abs(sizeKg - 3) < 0.1) return 'kg3';
    if (Math.abs(sizeKg - 5.5) < 0.1 || Math.abs(sizeKg - 5) < 0.1) return 'kg5';
    if (Math.abs(sizeKg - 12) < 0.1) return 'kg12';
    if (Math.abs(sizeKg - 50) < 0.1) return 'kg50';
    return 'kg3'; // Fallback
}

async function main() {
    console.log('🔧 Starting LPG Type Fix & Penyaluran Resync...\n');

    // Step 1: Get all lpg_products for reference (match by name)
    const products = await prisma.lpg_products.findMany({
        select: { id: true, name: true, size_kg: true },
    });
    console.log(`📦 Found ${products.length} LPG products`);

    // Create map by name (lowercase for matching)
    const productByName = new Map(products.map(p => [p.name.toLowerCase().trim(), p]));

    // Step 2: Fix order_items lpg_type based on label matching
    const orderItems = await prisma.order_items.findMany({
        where: { label: { not: null } },
        select: { id: true, lpg_type: true, label: true },
    });

    console.log(`📋 Found ${orderItems.length} order items with labels`);

    let fixedCount = 0;
    for (const item of orderItems) {
        if (!item.label) continue;

        // Find product by label match
        const labelLower = item.label.toLowerCase().trim();
        let matchedProduct = productByName.get(labelLower);

        if (!matchedProduct) {
            // Try partial match
            for (const [name, p] of productByName) {
                if (labelLower.includes(name) || name.includes(labelLower)) {
                    matchedProduct = p;
                    break;
                }
            }
        }

        if (!matchedProduct) continue;

        const correctLpgType = sizeKgToLpgType(Number(matchedProduct.size_kg));
        if (item.lpg_type !== correctLpgType) {
            await (prisma.order_items as any).update({
                where: { id: item.id },
                data: { lpg_type: correctLpgType },
            });
            console.log(`  ✅ Fixed: ${item.lpg_type} → ${correctLpgType} (${item.label})`);
            fixedCount++;
        }
    }
    console.log(`\n🔧 Fixed ${fixedCount} order items\n`);

    // Step 3: Clear penyaluran_harian (will be regenerated)
    const deletedCount = await prisma.penyaluran_harian.deleteMany({});
    console.log(`🗑️ Cleared ${deletedCount.count} penyaluran_harian records\n`);

    // Step 4: Re-generate penyaluran_harian from SELESAI orders
    const completedOrders = await prisma.orders.findMany({
        where: { current_status: 'SELESAI' },
        include: {
            order_items: true,
        },
    });

    console.log(`📦 Found ${completedOrders.length} completed orders to process`);

    let syncedCount = 0;
    for (const order of completedOrders) {
        // Use order_date if available, otherwise created_at
        const orderDate = order.order_date || order.created_at;
        const dateOnly = new Date(orderDate);
        dateOnly.setHours(0, 0, 0, 0);

        for (const item of order.order_items) {
            try {
                await (prisma.penyaluran_harian as any).upsert({
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
            } catch (err) {
                console.error(`  ❌ Error syncing order ${order.code}, item ${item.lpg_type}:`, err);
            }
        }
    }

    console.log(`\n✅ Synced ${syncedCount} penyaluran records from orders\n`);

    // Step 5: Summary
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
