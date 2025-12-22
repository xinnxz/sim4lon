import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAgenOrderDto, ReceiveAgenOrderDto } from './dto';

@Injectable()
export class AgenOrdersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generate next order code: AO-001, AO-002, etc.
     */
    private async generateCode(): Promise<string> {
        const lastOrder = await this.prisma.agen_orders.findFirst({
            orderBy: { created_at: 'desc' },
            select: { code: true },
        });

        if (!lastOrder) {
            return 'AO-001';
        }

        const lastNum = parseInt(lastOrder.code.replace('AO-', ''), 10);
        return `AO-${String(lastNum + 1).padStart(3, '0')}`;
    }

    /**
     * Create new order to agen
     */
    async create(pangkalanId: string, dto: CreateAgenOrderDto) {
        // Get pangkalan's agen
        const pangkalan = await this.prisma.pangkalans.findUnique({
            where: { id: pangkalanId },
            select: { agen_id: true },
        });

        const code = await this.generateCode();

        const order = await this.prisma.agen_orders.create({
            data: {
                code,
                pangkalan_id: pangkalanId,
                agen_id: pangkalan?.agen_id || null,
                lpg_type: dto.lpg_type as any,
                qty_ordered: dto.qty,
                note: dto.note,
                status: 'PENDING',
            },
            include: {
                agen: { select: { name: true, phone: true } },
            },
        });

        return order;
    }

    /**
     * Get all orders for a pangkalan
     */
    async findAll(pangkalanId: string, status?: string) {
        const where: any = { pangkalan_id: pangkalanId };
        if (status && status !== 'all') {
            where.status = status;
        }

        return this.prisma.agen_orders.findMany({
            where,
            orderBy: { order_date: 'desc' },
            include: {
                agen: { select: { name: true, phone: true } },
            },
        });
    }

    /**
     * Get single order by ID
     */
    async findOne(id: string, pangkalanId: string) {
        const order = await this.prisma.agen_orders.findFirst({
            where: { id, pangkalan_id: pangkalanId },
            include: {
                agen: { select: { name: true, phone: true } },
            },
        });

        if (!order) {
            throw new NotFoundException('Order tidak ditemukan');
        }

        return order;
    }

    /**
     * Receive order - update stock and mark as received
     */
    async receive(id: string, pangkalanId: string, dto: ReceiveAgenOrderDto) {
        const order = await this.findOne(id, pangkalanId);

        if (order.status === 'DITERIMA') {
            throw new BadRequestException('Order sudah diterima sebelumnya');
        }
        if (order.status === 'BATAL') {
            throw new BadRequestException('Order sudah dibatalkan');
        }

        // Transaction: update order + create movement + update stock
        return this.prisma.$transaction(async (tx) => {
            // 1. Update order status
            const updatedOrder = await tx.agen_orders.update({
                where: { id },
                data: {
                    status: 'DITERIMA',
                    qty_received: dto.qty_received,
                    received_date: new Date(),
                    note: dto.note || order.note,
                },
            });

            // 2. Create stock movement record
            await tx.pangkalan_stock_movements.create({
                data: {
                    pangkalan_id: pangkalanId,
                    lpg_type: order.lpg_type,
                    movement_type: 'IN',
                    qty: dto.qty_received,
                    source: 'AGEN_DELIVERY',
                    reference_id: id,
                    note: `Terima dari agen: ${dto.qty_received} tabung (Order: ${order.code})`,
                },
            });

            // 3. Update or create stock level
            const existingStock = await tx.pangkalan_stocks.findFirst({
                where: {
                    pangkalan_id: pangkalanId,
                    lpg_type: order.lpg_type,
                },
            });

            if (existingStock) {
                await tx.pangkalan_stocks.update({
                    where: { id: existingStock.id },
                    data: {
                        qty: { increment: dto.qty_received },
                        updated_at: new Date(),
                    },
                });
            } else {
                await tx.pangkalan_stocks.create({
                    data: {
                        pangkalan_id: pangkalanId,
                        lpg_type: order.lpg_type,
                        qty: dto.qty_received,
                    },
                });
            }

            return updatedOrder;
        });
    }

    /**
     * Cancel order
     */
    async cancel(id: string, pangkalanId: string) {
        const order = await this.findOne(id, pangkalanId);

        if (order.status === 'DITERIMA') {
            throw new BadRequestException('Order yang sudah diterima tidak bisa dibatalkan');
        }
        if (order.status === 'BATAL') {
            throw new BadRequestException('Order sudah dibatalkan');
        }

        return this.prisma.agen_orders.update({
            where: { id },
            data: { status: 'BATAL' },
        });
    }

    /**
     * Get order count by status for summary
     */
    async getStats(pangkalanId: string) {
        const [pending, dikirim, diterima, batal] = await Promise.all([
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'PENDING' } }),
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'DIKIRIM' } }),
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'DITERIMA' } }),
            this.prisma.agen_orders.count({ where: { pangkalan_id: pangkalanId, status: 'BATAL' } }),
        ]);

        return { pending, dikirim, diterima, batal, total: pending + dikirim + diterima + batal };
    }
}
