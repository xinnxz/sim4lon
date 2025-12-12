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
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Starting seed...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const hashedOperatorPassword = await bcrypt.hash('operator123', 12);
    const adminUser = await prisma.users.upsert({
        where: { email: 'admin@sim4lon.co.id' },
        update: {
            password: hashedAdminPassword,
            name: 'Administrator',
        },
        create: {
            email: 'admin@sim4lon.co.id',
            password: hashedAdminPassword,
            role: 'ADMIN',
            name: 'Administrator',
            phone: '081234567890',
            is_active: true,
        },
    });
    console.log('✅ Created/Updated Admin:', adminUser.email);
    const operatorUser = await prisma.users.upsert({
        where: { email: 'operator@sim4lon.co.id' },
        update: {
            password: hashedOperatorPassword,
            name: 'Siti Rahmawati',
        },
        create: {
            email: 'operator@sim4lon.co.id',
            password: hashedOperatorPassword,
            role: 'OPERATOR',
            name: 'Siti Rahmawati',
            phone: '082211445566',
            is_active: true,
        },
    });
    console.log('✅ Created/Updated Operator:', operatorUser.email);
    const driver1 = await prisma.drivers.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Bambang Sugiharto',
            phone: '083399887766',
            vehicle_id: 'B 1234 ABC',
            is_active: true,
            note: 'Supir senior, sudah 5 tahun',
        },
    });
    console.log('✅ Created Driver:', driver1.name);
    const driver2 = await prisma.drivers.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Dedi Iskandar',
            phone: '089812312312',
            vehicle_id: 'B 5678 XYZ',
            is_active: true,
            note: 'Supir baru',
        },
    });
    console.log('✅ Created Driver:', driver2.name);
    const pangkalan1 = await prisma.pangkalans.upsert({
        where: { id: '00000000-0000-0000-0000-000000000011' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000011',
            name: 'Pangkalan Maju Jaya',
            address: 'Jl. Sudirman No. 12, Kel. Menteng, Jakarta Pusat',
            region: 'Jakarta Pusat',
            pic_name: 'Pak Ahmad',
            phone: '081234567890',
            capacity: 500,
            note: 'Pangkalan besar, pesanan sering di atas 100 unit',
            is_active: true,
        },
    });
    console.log('✅ Created Pangkalan:', pangkalan1.name);
    const pangkalan2 = await prisma.pangkalans.upsert({
        where: { id: '00000000-0000-0000-0000-000000000012' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000012',
            name: 'Pangkalan Berkah Sejahtera',
            address: 'Jalan Gajah Mada Blok C5 No. 4, Semarang',
            region: 'Semarang',
            pic_name: 'Bu Siti',
            phone: '087765432109',
            capacity: 200,
            note: 'Butuh LPG 3kg dan 12kg',
            is_active: true,
        },
    });
    console.log('✅ Created Pangkalan:', pangkalan2.name);
    const pangkalan3 = await prisma.pangkalans.upsert({
        where: { id: '00000000-0000-0000-0000-000000000013' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000013',
            name: 'Pangkalan Sumber Rezeki',
            address: 'Perumahan Indah Blok R No. 10, Bandung',
            region: 'Bandung',
            pic_name: 'Pak Joko',
            phone: '085611223344',
            capacity: 100,
            note: 'Pembayaran selalu tepat waktu',
            is_active: true,
        },
    });
    console.log('✅ Created Pangkalan:', pangkalan3.name);
    console.log('');
    console.log('🎉 Seed completed!');
    console.log('');
    console.log('📋 Login credentials:');
    console.log('   Admin    : admin@sim4lon.co.id / admin123');
    console.log('   Operator : operator@sim4lon.co.id / operator123');
}
main()
    .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map