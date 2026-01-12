/**
 * Update Product Images
 * Run: npx ts-node --transpile-only prisma/update-product-images.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Image URL mapping based on product name/size
const imageMap: Record<string, string> = {
    '3': '/images/products/lpg-3kg.png',
    '5.5': '/images/products/lpg-5kg.png',
    '12': '/images/products/lpg-12kg.png',
    '50': '/images/products/lpg-50kg.png',
    '0.22': '/images/products/bright-gas-220gr.png',
};

async function updateProductImages() {
    console.log('🖼️ Updating Product Images...\n');

    const products = await prisma.lpg_products.findMany();

    for (const product of products) {
        const sizeKey = String(product.size_kg);
        let imageUrl = imageMap[sizeKey];

        // Check for Bright Gas specifically
        if (product.name.toLowerCase().includes('bright gas') && !product.name.includes('12kg')) {
            if (Number(product.size_kg) < 1) {
                imageUrl = '/images/products/bright-gas-220gr.png';
            }
        }

        if (imageUrl) {
            await prisma.lpg_products.update({
                where: { id: product.id },
                data: { image_url: imageUrl }
            });
            console.log(`✅ ${product.name} -> ${imageUrl}`);
        } else {
            console.log(`⏩ ${product.name} (no image mapping for size ${sizeKey})`);
        }
    }

    console.log('\n🎉 Image update complete!');
}

updateProductImages()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
