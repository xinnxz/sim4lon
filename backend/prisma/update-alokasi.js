const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Updating pangkalan alokasi to 2500-3000...');
    
    // Update all active pangkalan:
    // - alokasi_bulanan: 2500-3000 (kelipatan 100)
    // - capacity: 100-300 (kelipatan 50) = 100, 150, 200, 250, 300
    // - pic_name: sama dengan name pangkalan
    const result = await prisma.$executeRaw`
        UPDATE pangkalans 
        SET 
            alokasi_bulanan = (FLOOR(RANDOM() * 6)::INTEGER * 100) + 2500,
            capacity = (FLOOR(RANDOM() * 5)::INTEGER * 50) + 100,
            pic_name = name,
            updated_at = NOW()
        WHERE is_active = true
    `;
    
    console.log(`✅ Updated ${result} pangkalan(s)`);
    
    // Show results
    const data = await prisma.pangkalans.findMany({
        where: { is_active: true },
        select: { name: true, alokasi_bulanan: true, capacity: true },
        orderBy: { name: 'asc' }
    });
    
    console.log('\nHasil update:');
    data.forEach(d => console.log(`  ${d.name}: alokasi=${d.alokasi_bulanan}, capacity=${d.capacity}`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
