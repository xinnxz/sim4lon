"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const users = await prisma.users.findMany({
        where: { role: 'PANGKALAN' },
        select: { email: true, name: true, pangkalan_id: true }
    });
    console.log('='.repeat(50));
    console.log('PANGKALAN USERS:', users.length);
    console.log('='.repeat(50));
    users.forEach(u => console.log(`${u.email} - ${u.name}`));
    console.log('='.repeat(50));
}
main()
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=check-users.js.map