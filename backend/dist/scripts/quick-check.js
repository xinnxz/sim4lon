"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const total = await prisma.consumer_orders.count();
    console.log('Total orders:', total);
    const samples = await prisma.consumer_orders.findMany({
        take: 20,
        orderBy: { sale_date: 'asc' },
        select: { sale_date: true }
    });
    console.log('Sample dates (oldest first):');
    samples.forEach((s, i) => console.log(`${i + 1}. ${s.sale_date.toISOString()}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=quick-check.js.map