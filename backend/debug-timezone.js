// Test the fixed timezone utilities
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function nowWIB() {
    const now = new Date();
    return new Date(now.getTime() + WIB_OFFSET_MS);
}

function todayWIB() {
    const wibNow = nowWIB();
    wibNow.setUTCHours(0, 0, 0, 0);
    return new Date(wibNow.getTime() - WIB_OFFSET_MS);
}

console.log('=== FIXED Timezone Test ===');
console.log('Current UTC:', new Date().toISOString());
console.log('nowWIB():', nowWIB().toISOString());
console.log('todayWIB():', todayWIB().toISOString());

// Test with Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const today = todayWIB();
    console.log('\nQuerying orders where order_date >= todayWIB():');
    console.log('todayWIB() =', today.toISOString());
    
    const count = await prisma.orders.count({
        where: { order_date: { gte: today } }
    });
    console.log('Orders count:', count);
    
    // Check recent orders
    const orders = await prisma.orders.findMany({
        orderBy: { order_date: 'desc' },
        take: 3,
        select: { code: true, order_date: true }
    });
    console.log('\nRecent orders:');
    orders.forEach(o => console.log('  ', o.code, o.order_date.toISOString()));
}

main().catch(console.error).finally(() => prisma.$disconnect());
