/**
 * Cleanup orphan PKL-DEMO data
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    console.log('🧹 Cleaning up PKL-DEMO...\n');

    // Find the pangkalan
    const pklDemo = await prisma.pangkalans.findFirst({
        where: { code: 'PKL-DEMO' }
    });

    if (!pklDemo) {
        console.log('✅ PKL-DEMO not found, nothing to clean');
        return;
    }

    console.log('Found PKL-DEMO:', pklDemo.id);

    // Delete related data in order
    console.log('Deleting agen_orders...');
    await prisma.agen_orders.deleteMany({ where: { pangkalan_id: pklDemo.id } });

    console.log('Deleting stock_movements...');
    await prisma.pangkalan_stock_movements.deleteMany({ where: { pangkalan_id: pklDemo.id } });

    console.log('Deleting stocks...');
    await prisma.pangkalan_stocks.deleteMany({ where: { pangkalan_id: pklDemo.id } });

    console.log('Deleting lpg_prices...');
    await prisma.lpg_prices.deleteMany({ where: { pangkalan_id: pklDemo.id } });

    // Find and delete user
    const user = await prisma.users.findFirst({
        where: { pangkalan_id: pklDemo.id }
    });

    if (user) {
        console.log('Deleting activity_logs for user...');
        await prisma.activity_logs.deleteMany({ where: { user_id: user.id } });

        console.log('Deleting user...');
        await prisma.users.delete({ where: { id: user.id } });
    }

    // Finally delete pangkalan
    console.log('Deleting pangkalan...');
    await prisma.pangkalans.delete({ where: { id: pklDemo.id } });

    console.log('\n✅ PKL-DEMO cleaned up!');
}

cleanup()
    .catch(e => console.error('Error:', e))
    .finally(() => prisma.$disconnect());
