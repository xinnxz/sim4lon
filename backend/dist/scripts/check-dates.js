"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const result = await prisma.$queryRaw `
        SELECT 
            DATE(sale_date) as tanggal, 
            COUNT(*) as count 
        FROM consumer_orders 
        GROUP BY DATE(sale_date) 
        ORDER BY tanggal DESC 
        LIMIT 25
    `;
    console.log('📊 Dates in consumer_orders:');
    console.table(result);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-dates.js.map