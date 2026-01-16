import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const result = await prisma.agen_orders.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'DIKIRIM' }
    })
    console.log(`✅ Updated ${result.count} pesanan PENDING → DIKIRIM`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
