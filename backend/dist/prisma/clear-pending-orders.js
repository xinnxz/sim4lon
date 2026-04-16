"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const result = await prisma.agen_orders.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'DIKIRIM' }
    });
    console.log(`✅ Updated ${result.count} pesanan PENDING → DIKIRIM`);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=clear-pending-orders.js.map