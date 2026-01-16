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
    console.log('🚀 Creating test pangkalan user...\n');
    let pangkalan = await prisma.pangkalans.findFirst({
        where: { is_active: true },
    });
    if (!pangkalan) {
        console.log('📦 Creating test pangkalan...');
        const count = await prisma.pangkalans.count();
        pangkalan = await prisma.pangkalans.create({
            data: {
                code: `PKL-${String(count + 1).padStart(3, '0')}`,
                name: 'Pangkalan Test',
                address: 'Jl. Testing No. 123',
                region: 'Jakarta',
                pic_name: 'Budi Test',
                phone: '081234567890',
            },
        });
        console.log(`✅ Created pangkalan: ${pangkalan.name} (${pangkalan.code})\n`);
    }
    else {
        console.log(`📦 Using existing pangkalan: ${pangkalan.name} (${pangkalan.code})\n`);
    }
    const existingUser = await prisma.users.findUnique({
        where: { email: 'pangkalan@test.com' },
    });
    if (existingUser) {
        console.log('⚠️  User pangkalan@test.com already exists!\n');
        if (!existingUser.pangkalan_id) {
            await prisma.users.update({
                where: { id: existingUser.id },
                data: {
                    pangkalan_id: pangkalan.id,
                    role: 'PANGKALAN',
                },
            });
            console.log('✅ Updated user to link to pangkalan\n');
        }
    }
    else {
        console.log('👤 Creating pangkalan user...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userCount = await prisma.users.count();
        const user = await prisma.users.create({
            data: {
                code: `USR-${String(userCount + 1).padStart(3, '0')}`,
                email: 'pangkalan@test.com',
                password: hashedPassword,
                name: 'Pak Pangkalan',
                phone: '081234567890',
                role: 'PANGKALAN',
                pangkalan_id: pangkalan.id,
            },
        });
        console.log(`✅ Created user: ${user.name} (${user.email})\n`);
    }
    console.log('═══════════════════════════════════════');
    console.log('  TEST ACCOUNT READY');
    console.log('═══════════════════════════════════════');
    console.log('  Email    : pangkalan@test.com');
    console.log('  Password : password123');
    console.log('  Pangkalan: ' + pangkalan.name);
    console.log('═══════════════════════════════════════\n');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-pangkalan-user.js.map