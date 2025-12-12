import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto';
import { status_pesanan } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    async findAll(
        page = 1,
        limit = 10,
        status?: status_pesanan,
        pangkalanId?: string,
        driverId?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: any = { deleted_at: null };
        if (status) where.current_status = status;
        if (pangkalanId) where.pangkalan_id = pangkalanId;
        if (driverId) where.driver_id = driverId;

        const [orders, total] = await Promise.all([
            this.prisma.orders.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    pangkalans: {
                        select: { id: true, name: true, region: true },
                    },
                    drivers: {
                        select: { id: true, name: true },
                    },
                    order_items: true,
                    order_payment_details: true,
                },
            }),
            this.prisma.orders.count({ where }),
        ]);

        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const order = await this.prisma.orders.findFirst({
            where: { id, deleted_at: null },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
                order_payment_details: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
                invoices: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order tidak ditemukan');
        }

        return order;
    }

    async create(dto: CreateOrderDto) {
        // Calculate total amount
        const totalAmount = dto.items.reduce(
            (sum, item) => sum + item.price_per_unit * item.qty,
            0,
        );

        const order = await this.prisma.orders.create({
            data: {
                pangkalan_id: dto.pangkalan_id,
                driver_id: dto.driver_id,
                note: dto.note,
                total_amount: totalAmount,
                current_status: 'DRAFT',
                order_items: {
                    create: dto.items.map((item) => ({
                        lpg_type: item.lpg_type,
                        label: item.label,
                        price_per_unit: item.price_per_unit,
                        qty: item.qty,
                        sub_total: item.price_per_unit * item.qty,
                    })),
                },
                timeline_tracks: {
                    create: {
                        status: 'DRAFT',
                        description: 'Order dibuat',
                    },
                },
            },
            include: {
                pangkalans: true,
                order_items: true,
                timeline_tracks: true,
            },
        });

        return order;
    }

    async update(id: string, dto: UpdateOrderDto) {
        await this.findOne(id);

        const order = await this.prisma.orders.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
            },
        });

        return order;
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.findOne(id);

        // Validate status transition
        this.validateStatusTransition(order.current_status, dto.status);

        const updated = await this.prisma.orders.update({
            where: { id },
            data: {
                current_status: dto.status,
                updated_at: new Date(),
                timeline_tracks: {
                    create: {
                        status: dto.status,
                        description: dto.description,
                        note: dto.note,
                    },
                },
            },
            include: {
                pangkalans: true,
                drivers: true,
                order_items: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });

        return updated;
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.orders.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        return { message: 'Order berhasil dihapus' };
    }

    private validateStatusTransition(
        currentStatus: status_pesanan,
        newStatus: status_pesanan,
    ) {
        const validTransitions: Record<status_pesanan, status_pesanan[]> = {
            DRAFT: ['MENUNGGU_PEMBAYARAN', 'BATAL'],
            MENUNGGU_PEMBAYARAN: ['DIPROSES', 'BATAL'],
            DIPROSES: ['SIAP_KIRIM', 'BATAL'],
            SIAP_KIRIM: ['DIKIRIM', 'BATAL'],
            DIKIRIM: ['SELESAI', 'BATAL'],
            SELESAI: [],
            BATAL: [],
        };

        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new BadRequestException(
                `Tidak dapat mengubah status dari ${currentStatus} ke ${newStatus}`,
            );
        }
    }
}
