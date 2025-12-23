"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🚀 Creating COMPLETE Pangkalan Demo...\n');
    let agen = await prisma.agen.findFirst({ where: { is_active: true } });
    if (!agen) {
        console.log('📦 Creating agen...');
        agen = await prisma.agen.create({
            data: {
                code: 'AGN-001',
                name: 'PT. Mitra Surya Natasya',
                address: 'CHOBA RT.002 RW.006 DESA MAYAK',
                phone: '081234567890',
                pic_name: 'Admin Agen',
                email: 'admin@agen.com',
            },
        });
        console.log(`✅ Created agen: ${agen.name}\n`);
    }
    else {
        console.log(`📦 Using existing agen: ${agen.name}\n`);
    }
    let pangkalan = await prisma.pangkalans.findFirst({
        where: { code: 'PKL-001' },
    });
    if (!pangkalan) {
        pangkalan = await prisma.pangkalans.findFirst({ where: { is_active: true } });
    }
    if (!pangkalan) {
        console.log('🏪 No pangkalan found, creating demo...');
        pangkalan = await prisma.pangkalans.create({
            data: {
                code: 'PKL-001',
                name: 'Pangkalan Maju Jaya',
                address: 'Jl. Sudirman No. 12, Kec. Menteng, Jakarta Pusat',
                region: 'Jakarta Pusat',
                pic_name: 'Pak Ahmad',
                phone: '081234567890',
                capacity: 500,
                agen_id: agen.id,
            },
        });
        console.log(`✅ Created pangkalan: ${pangkalan.name}\n`);
    }
    else {
        console.log(`🏪 Using existing pangkalan: ${pangkalan.name} (${pangkalan.code})\n`);
    }
    let user = await prisma.users.findUnique({
        where: { email: 'pangkalan@demo.com' },
    });
    if (!user) {
        console.log('👤 Creating user account...');
        const hashedPassword = await bcrypt.hash('demo123', 10);
        user = await prisma.users.create({
            data: {
                code: 'USR-DEMO',
                email: 'pangkalan@demo.com',
                password: hashedPassword,
                name: 'Pak Demo',
                phone: '081298765432',
                role: 'PANGKALAN',
                pangkalan_id: pangkalan.id,
            },
        });
        console.log(`✅ Created user: ${user.email}\n`);
    }
    else {
        console.log(`👤 User exists: ${user.email}\n`);
        if (!user.pangkalan_id) {
            await prisma.users.update({
                where: { id: user.id },
                data: { pangkalan_id: pangkalan.id, role: 'PANGKALAN' },
            });
        }
    }
    console.log('💰 Setting up LPG prices...');
    const lpgPrices = [
        { lpg_type: 'gr220', cost_price: 18000, selling_price: 20000 },
        { lpg_type: 'kg3', cost_price: 18500, selling_price: 22000 },
        { lpg_type: 'kg5', cost_price: 62000, selling_price: 70000 },
        { lpg_type: 'kg12', cost_price: 150000, selling_price: 175000 },
        { lpg_type: 'kg50', cost_price: 600000, selling_price: 700000 },
    ];
    for (const price of lpgPrices) {
        await prisma.lpg_prices.deleteMany({
            where: {
                pangkalan_id: pangkalan.id,
                lpg_type: price.lpg_type,
            },
        });
        await prisma.lpg_prices.create({
            data: {
                pangkalan_id: pangkalan.id,
                lpg_type: price.lpg_type,
                cost_price: price.cost_price,
                selling_price: price.selling_price,
                is_active: true,
            },
        });
    }
    console.log('✅ LPG prices configured\n');
    console.log('📊 Setting up stock levels...');
    const stocks = [
        { lpg_type: 'gr220', qty: 50 },
        { lpg_type: 'kg3', qty: 100 },
        { lpg_type: 'kg5', qty: 30 },
        { lpg_type: 'kg12', qty: 25 },
        { lpg_type: 'kg50', qty: 10 },
    ];
    for (const stock of stocks) {
        await prisma.pangkalan_stocks.deleteMany({
            where: {
                pangkalan_id: pangkalan.id,
                lpg_type: stock.lpg_type,
            },
        });
        await prisma.pangkalan_stocks.create({
            data: {
                pangkalan_id: pangkalan.id,
                lpg_type: stock.lpg_type,
                qty: stock.qty,
            },
        });
    }
    console.log('✅ Stock levels set\n');
    console.log('📜 Creating stock movement history...');
    const now = new Date();
    await prisma.pangkalan_stock_movements.deleteMany({
        where: { pangkalan_id: pangkalan.id },
    });
    for (let day = 30; day >= 0; day--) {
        const date = new Date(now);
        date.setDate(date.getDate() - day);
        if (day % 3 === 0) {
            await prisma.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pangkalan.id,
                    lpg_type: 'kg3',
                    movement_type: 'IN',
                    qty: 50 + Math.floor(Math.random() * 30),
                    note: 'Penerimaan dari Agen',
                    movement_date: date,
                    created_at: date,
                },
            });
        }
        await prisma.pangkalan_stock_movements.create({
            data: {
                pangkalan_id: pangkalan.id,
                lpg_type: 'kg3',
                movement_type: 'OUT',
                qty: 10 + Math.floor(Math.random() * 20),
                note: 'Penjualan harian',
                movement_date: date,
                created_at: date,
            },
        });
    }
    console.log('✅ Stock movements created\n');
    console.log('📦 Creating agen orders...');
    await prisma.agen_orders.deleteMany({
        where: { pangkalan_id: pangkalan.id },
    });
    for (let i = 0; i < 5; i++) {
        const orderDate = new Date(now);
        orderDate.setDate(orderDate.getDate() - (i * 5));
        const status = i < 2 ? 'DITERIMA' : (i === 2 ? 'DIKIRIM' : 'PENDING');
        const qtyOrdered = 50 + (i * 10);
        await prisma.agen_orders.create({
            data: {
                code: `AO-DEMO-${String(i + 1).padStart(3, '0')}`,
                pangkalan_id: pangkalan.id,
                agen_id: agen.id,
                lpg_type: 'kg3',
                qty_ordered: qtyOrdered,
                qty_received: status === 'DITERIMA' ? qtyOrdered : 0,
                status: status,
                order_date: orderDate,
                note: `Pesanan demo #${i + 1}`,
                created_at: orderDate,
                updated_at: orderDate,
            },
        });
    }
    console.log('✅ Agen orders created\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('  🎉 COMPLETE PANGKALAN DEMO READY!');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('  📧 LOGIN PANGKALAN:');
    console.log('     Email    : pangkalan@demo.com');
    console.log('     Password : demo123');
    console.log('');
    console.log('  📧 LOGIN ADMIN:');
    console.log('     Email    : admin@agen.com');
    console.log('     Password : admin123');
    console.log('');
    console.log('  📊 DATA INCLUDED:');
    console.log('     ✓ Pangkalan: ' + pangkalan.name);
    console.log('     ✓ Stock levels for 5 LPG types');
    console.log('     ✓ 30 days of stock movements');
    console.log('     ✓ 5 agen orders');
    console.log('     ✓ LPG price configuration');
    console.log('═══════════════════════════════════════════════════\n');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-complete-pangkalan.js.map