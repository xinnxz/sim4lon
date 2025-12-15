import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateActivityLogDto } from './dto';

@Injectable()
export class ActivityService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, type?: string, userId?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (type) where.type = type;
        if (userId) where.user_id = userId;

        const [logs, total] = await Promise.all([
            this.prisma.activity_logs.findMany({
                where,
                skip,
                take: limit,
                orderBy: { timestamp: 'desc' },
                include: {
                    users: {
                        select: { id: true, name: true },
                    },
                    orders: {
                        select: { id: true, pangkalans: { select: { name: true } } },
                    },
                },
            }),
            this.prisma.activity_logs.count({ where }),
        ]);

        return {
            data: logs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async create(dto: CreateActivityLogDto) {
        const log = await this.prisma.activity_logs.create({
            data: {
                user_id: dto.user_id,
                order_id: dto.order_id,
                type: dto.type,
                title: dto.title,
                description: dto.description,
                pangkalan_name: dto.pangkalan_name,
                detail_numeric: dto.detail_numeric,
                icon_name: dto.icon_name,
                order_status: dto.order_status,
            },
        });

        return log;
    }

    async getRecent(limit = 10) {
        const logs = await this.prisma.activity_logs.findMany({
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: {
                users: {
                    select: { id: true, name: true },
                },
                orders: {
                    select: { id: true, pangkalans: { select: { name: true } } },
                },
            },
        });

        return logs;
    }

    async getByType(type: string, limit = 20) {
        const logs = await this.prisma.activity_logs.findMany({
            where: { type },
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: {
                users: {
                    select: { id: true, name: true },
                },
                orders: {
                    select: { id: true, pangkalans: { select: { name: true } } },
                },
            },
        });

        return logs;
    }

    // Helper method to log activity from other services
    async logActivity(
        type: string,
        title: string,
        options?: {
            userId?: string;
            orderId?: string;
            description?: string;
            pangkalanName?: string;
            detailNumeric?: number;
            iconName?: string;
            orderStatus?: any;
        },
    ) {
        return this.create({
            type,
            title,
            user_id: options?.userId,
            order_id: options?.orderId,
            description: options?.description,
            pangkalan_name: options?.pangkalanName,
            detail_numeric: options?.detailNumeric,
            icon_name: options?.iconName,
            order_status: options?.orderStatus,
        });
    }

    // DEV ONLY: Seed sample activities for testing
    async seedSampleActivities() {
        // Get first user
        const user = await this.prisma.users.findFirst();
        if (!user) {
            throw new Error('No users found. Please seed users first.');
        }

        const activities = [
            { type: 'ORDER_NEW', title: 'Pesanan Baru Dibuat', description: 'Pesanan untuk Pangkalan Maju Jaya - 50 tabung LPG 3kg', pangkalan_name: 'Pangkalan Maju Jaya', detail_numeric: 50, icon_name: 'ShoppingCart', offsetMins: 5 },
            { type: 'PAYMENT_RECEIVED', title: 'Pembayaran Diterima', description: 'Pembayaran lunas dari Pangkalan Sejahtera - Rp 2.500.000', pangkalan_name: 'Pangkalan Sejahtera', detail_numeric: 2500000, icon_name: 'Banknote', offsetMins: 30 },
            { type: 'STOCK_IN', title: 'Stok Masuk', description: 'Penerimaan stok LPG 3kg dari supplier', detail_numeric: 200, icon_name: 'PackagePlus', offsetMins: 60 },
            { type: 'ORDER_COMPLETED', title: 'Pesanan Selesai', description: 'Pesanan telah selesai - Pangkalan Bersama', pangkalan_name: 'Pangkalan Bersama', detail_numeric: 100, icon_name: 'CheckCircle2', offsetMins: 120 },
            { type: 'STOCK_OUT', title: 'Stok Keluar', description: 'Pengiriman ke Pangkalan ABC - LPG 12kg', detail_numeric: 30, icon_name: 'PackageMinus', offsetMins: 180 },
            { type: 'ORDER_NEW', title: 'Pesanan Baru Dibuat', description: 'Pesanan untuk Pangkalan Sentosa - 25 tabung LPG 12kg', pangkalan_name: 'Pangkalan Sentosa', detail_numeric: 25, icon_name: 'ShoppingCart', offsetMins: 240 },
            { type: 'PAYMENT_RECEIVED', title: 'Pembayaran Diterima', description: 'DP 50% dari Pangkalan XYZ - Rp 1.000.000', pangkalan_name: 'Pangkalan XYZ', detail_numeric: 1000000, icon_name: 'Banknote', offsetMins: 300 },
            { type: 'STOCK_IN', title: 'Stok Masuk', description: 'Penerimaan stok LPG 12kg dari supplier utama', detail_numeric: 100, icon_name: 'PackagePlus', offsetMins: 1440 },
            { type: 'ORDER_CANCELLED', title: 'Pesanan Dibatalkan', description: 'Pesanan dari Pangkalan Lama dibatalkan atas permintaan pelanggan', pangkalan_name: 'Pangkalan Lama', detail_numeric: 10, icon_name: 'XCircle', offsetMins: 2880 },
            { type: 'ORDER_COMPLETED', title: 'Pesanan Selesai', description: 'Pengiriman sukses ke Pangkalan Prima', pangkalan_name: 'Pangkalan Prima', detail_numeric: 75, icon_name: 'CheckCircle2', offsetMins: 4320 },
        ];

        const created: any[] = [];
        for (const act of activities) {
            const log = await this.prisma.activity_logs.create({
                data: {
                    user_id: user.id,
                    type: act.type,
                    title: act.title,
                    description: act.description,
                    pangkalan_name: act.pangkalan_name,
                    detail_numeric: act.detail_numeric,
                    icon_name: act.icon_name,
                    timestamp: new Date(Date.now() - act.offsetMins * 60 * 1000),
                },
            });
            created.push(log);
        }

        return { message: `Created ${created.length} sample activities`, count: created.length };
    }
}

