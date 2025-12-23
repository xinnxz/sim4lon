const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearActivities() {
    // Delete all activity logs
    const result = await prisma.activity_logs.deleteMany();
    console.log('Deleted activity logs:', result.count);
    
    await prisma.$disconnect();
}

clearActivities();
