import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedActivities() {
    console.log('🌱 Seeding activity_logs...')

    // Get first user for reference
    const user = await prisma.users.findFirst()
    if (!user) {
        console.log('❌ No users found. Please seed users first.')
        return
    }

    // Sample activities with various types
    const activities = [
        {
            user_id: user.id,
            type: 'ORDER_NEW',
            title: 'Pesanan Baru Dibuat',
            description: 'Pesanan untuk Pangkalan Maju Jaya - 50 tabung LPG 3kg',
            pangkalan_name: 'Pangkalan Maju Jaya',
            detail_numeric: 50,
            icon_name: 'ShoppingCart',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
        },
        {
            user_id: user.id,
            type: 'PAYMENT_RECEIVED',
            title: 'Pembayaran Diterima',
            description: 'Pembayaran lunas dari Pangkalan Sejahtera - Rp 2.500.000',
            pangkalan_name: 'Pangkalan Sejahtera',
            detail_numeric: 2500000,
            icon_name: 'Banknote',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        },
        {
            user_id: user.id,
            type: 'STOCK_IN',
            title: 'Stok Masuk',
            description: 'Penerimaan stok LPG 3kg dari supplier',
            detail_numeric: 200,
            icon_name: 'PackagePlus',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        },
        {
            user_id: user.id,
            type: 'ORDER_COMPLETED',
            title: 'Pesanan Selesai',
            description: 'Pesanan telah selesai - Pangkalan Bersama',
            pangkalan_name: 'Pangkalan Bersama',
            detail_numeric: 100,
            icon_name: 'CheckCircle2',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
            user_id: user.id,
            type: 'STOCK_OUT',
            title: 'Stok Keluar',
            description: 'Pengiriman ke Pangkalan ABC - LPG 12kg',
            detail_numeric: 30,
            icon_name: 'PackageMinus',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        },
        {
            user_id: user.id,
            type: 'ORDER_NEW',
            title: 'Pesanan Baru Dibuat',
            description: 'Pesanan untuk Pangkalan Sentosa - 25 tabung LPG 12kg',
            pangkalan_name: 'Pangkalan Sentosa',
            detail_numeric: 25,
            icon_name: 'ShoppingCart',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        },
        {
            user_id: user.id,
            type: 'PAYMENT_RECEIVED',
            title: 'Pembayaran Diterima',
            description: 'DP 50% dari Pangkalan XYZ - Rp 1.000.000',
            pangkalan_name: 'Pangkalan XYZ',
            detail_numeric: 1000000,
            icon_name: 'Banknote',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
            user_id: user.id,
            type: 'STOCK_IN',
            title: 'Stok Masuk',
            description: 'Penerimaan stok LPG 12kg dari supplier utama',
            detail_numeric: 100,
            icon_name: 'PackagePlus',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
            user_id: user.id,
            type: 'ORDER_CANCELLED',
            title: 'Pesanan Dibatalkan',
            description: 'Pesanan dari Pangkalan Lama dibatalkan atas permintaan pelanggan',
            pangkalan_name: 'Pangkalan Lama',
            detail_numeric: 10,
            icon_name: 'XCircle',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
            user_id: user.id,
            type: 'ORDER_COMPLETED',
            title: 'Pesanan Selesai',
            description: 'Pengiriman sukses ke Pangkalan Prima',
            pangkalan_name: 'Pangkalan Prima',
            detail_numeric: 75,
            icon_name: 'CheckCircle2',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
    ]

    // Insert activities
    for (const activity of activities) {
        await prisma.activity_logs.create({
            data: activity,
        })
    }

    console.log(`✅ Created ${activities.length} sample activities`)
}

seedActivities()
    .catch((e) => {
        console.error('❌ Error seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
