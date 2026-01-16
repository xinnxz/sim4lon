"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const products = await prisma.lpg_products.findMany();
    console.log('Existing LPG Products:');
    products.forEach(p => {
        console.log(`  - ${p.code}: ${p.name} (active: ${p.is_active})`);
    });
    const brightGas = products.find(p => p.code === 'gr220' || p.code === 'g220' || p.name.toLowerCase().includes('bright'));
    if (!brightGas) {
        console.log('\n⚠️ Bright Gas Can not found, creating...');
        const newProduct = await prisma.lpg_products.create({
            data: {
                code: 'gr220',
                name: 'Bright Gas Can 220gr',
                base_price: 18000,
                sell_price: 20000,
                weight_kg: 0.22,
                is_active: true,
                is_subsidi: false,
            }
        });
        console.log(`✅ Created: ${newProduct.code} - ${newProduct.name}`);
    }
    else {
        console.log(`\n✅ Bright Gas already exists: ${brightGas.code} - ${brightGas.name}`);
    }
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-bright-gas.js.map