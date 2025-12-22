"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🚀 Starting...');
    const user = await prisma.users.findFirst({
        where: { email: 'pangkalan@test.com' },
        select: { pangkalan_id: true }
    });
    if (!user?.pangkalan_id)
        throw new Error('Pangkalan not found');
    const pangkalanId = user.pangkalan_id;
    console.log('Pangkalan:', pangkalanId);
    await prisma.consumer_orders.deleteMany({ where: { pangkalan_id: pangkalanId } });
    console.log('Deleted old data');
    const consumers = await prisma.consumers.findMany({
        where: { pangkalan_id: pangkalanId, is_active: true },
        select: { id: true }
    });
    console.log('Consumers:', consumers.length);
    const orders = [];
    let counter = 1;
    for (let day = 1; day <= 22; day++) {
        const numTx = 15 + Math.floor(Math.random() * 10);
        for (let i = 0; i < numTx; i++) {
            const saleDate = new Date(Date.UTC(2025, 11, day, 8 + Math.floor(i / 3), i % 60, 0));
            const qty = 2 + Math.floor(Math.random() * 7);
            const pricePerUnit = 18000 + Math.floor(Math.random() * 3000);
            const costPrice = 16000;
            const totalAmount = qty * pricePerUnit;
            orders.push({
                code: `S${day.toString().padStart(2, '0')}${i}${Math.random().toString(36).slice(2, 6)}`,
                pangkalan_id: pangkalanId,
                consumer_id: consumers[i % consumers.length]?.id,
                lpg_type: 'kg3',
                qty,
                price_per_unit: pricePerUnit,
                cost_price: costPrice,
                total_amount: totalAmount,
                payment_status: 'LUNAS',
                sale_date: saleDate,
            });
            counter++;
        }
    }
    console.log('Orders generated:', orders.length);
    console.log('First date:', orders[0].sale_date);
    console.log('Last date:', orders[orders.length - 1].sale_date);
    const result = await prisma.consumer_orders.createMany({
        data: orders,
        skipDuplicates: true
    });
    console.log('Inserted:', result.count);
}
main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=simple-seed.js.map