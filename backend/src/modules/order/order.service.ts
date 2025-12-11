import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusPesanan, LpgType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: {
        page?: number;
        limit?: number;
        status?: StatusPesanan;
        pangkalanId?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const { page = 1, limit = 10, status, pangkalanId, startDate, endDate } = query;
        const skip = (page - 1) * limit;

        const where: any = { deletedAt: null };

        if (status) where.currentStatus = status;
        if (pangkalanId) where.pangkalanId = pangkalanId;
        if (startDate || endDate) {
            where.orderDate = {};
            if (startDate) where.orderDate.gte = new Date(startDate);
            if (endDate) where.orderDate.lte = new Date(endDate);
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    pangkalan: { select: { id: true, name: true } },
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);

        const data = orders.map((order) => ({
            id: order.id,
            pangkalan: order.pangkalan,
            orderDate: order.orderDate,
            totalAmount: order.totalAmount,
            totalQty: order.items.reduce((sum, item) => sum + item.qty, 0),
            currentStatus: order.currentStatus,
        }));

        return { data, meta: { page, limit, total } };
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id, deletedAt: null },
            include: {
                pangkalan: true,
                driver: true,
                items: true,
                paymentDetail: true,
                timelineTracks: { orderBy: { createdAt: 'asc' } },
            },
        });

        if (!order) {
            throw new NotFoundException('Order tidak ditemukan');
        }

        return order;
    }

    async create(data: {
        pangkalanId: string;
        orderDate: string;
        items: { lpgType: LpgType; qty: number; pricePerUnit: number }[];
        note?: string;
    }) {
        const { pangkalanId, orderDate, items, note } = data;

        // Calculate totals
        const orderItems = items.map((item) => ({
            lpgType: item.lpgType,
            label: this.getLpgLabel(item.lpgType),
            pricePerUnit: new Decimal(item.pricePerUnit),
            qty: item.qty,
            subTotal: new Decimal(item.pricePerUnit * item.qty),
        }));

        const totalAmount = orderItems.reduce(
            (sum, item) => sum.add(item.subTotal),
            new Decimal(0),
        );

        // Create order with items, payment detail, and timeline
        const order = await this.prisma.order.create({
            data: {
                pangkalanId,
                orderDate: new Date(orderDate),
                currentStatus: StatusPesanan.PESANAN_DIBUAT,
                totalAmount,
                note,
                items: { create: orderItems },
                paymentDetail: { create: { isPaid: false } },
                timelineTracks: {
                    create: {
                        status: StatusPesanan.PESANAN_DIBUAT,
                        description: 'Pesanan dibuat',
                    },
                },
            },
            include: {
                pangkalan: true,
                items: true,
                paymentDetail: true,
                timelineTracks: true,
            },
        });

        return order;
    }

    async updateStatus(id: string, data: { status: StatusPesanan; description?: string }) {
        await this.findOne(id);

        const [order] = await this.prisma.$transaction([
            this.prisma.order.update({
                where: { id },
                data: { currentStatus: data.status },
                include: { timelineTracks: { orderBy: { createdAt: 'asc' } } },
            }),
            this.prisma.timelineTrack.create({
                data: {
                    orderId: id,
                    status: data.status,
                    description: data.description || `Status diubah ke ${data.status}`,
                },
            }),
        ]);

        return order;
    }

    async assignDriver(id: string, driverId: string) {
        await this.findOne(id);

        return this.prisma.order.update({
            where: { id },
            data: { driverId },
            include: { driver: true },
        });
    }

    private getLpgLabel(type: LpgType): string {
        const labels = {
            kg3: 'LPG 3 Kg',
            kg12: 'LPG 12 Kg',
            kg50: 'LPG 50 Kg',
        };
        return labels[type] || type;
    }
}
