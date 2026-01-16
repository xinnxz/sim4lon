import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
