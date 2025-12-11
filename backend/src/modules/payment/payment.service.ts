import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethod, StatusPesanan } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }

    async getPaymentDetail(orderId: string) {
        const payment = await this.prisma.orderPaymentDetail.findUnique({
            where: { orderId },
        });

        if (!payment) {
            throw new NotFoundException('Payment detail tidak ditemukan');
        }

        return payment;
    }

    async recordPayment(
        orderId: string,
        data: {
            paymentMethod: PaymentMethod;
            amountPaid: number;
            paymentDate?: string;
            isDp?: boolean;
            note?: string;
        },
    ) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId, deletedAt: null },
        });

        if (!order) {
            throw new NotFoundException('Order tidak ditemukan');
        }

        const isPaid = new Decimal(data.amountPaid).gte(order.totalAmount);

        // Update payment detail
        const payment = await this.prisma.orderPaymentDetail.update({
            where: { orderId },
            data: {
                paymentMethod: data.paymentMethod,
                amountPaid: new Decimal(data.amountPaid),
                paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
                isDp: data.isDp || false,
                isPaid,
            },
        });

        // Update order status if paid
        if (isPaid) {
            await this.prisma.$transaction([
                this.prisma.order.update({
                    where: { id: orderId },
                    data: { currentStatus: StatusPesanan.DIPROSES },
                }),
                this.prisma.timelineTrack.create({
                    data: {
                        orderId,
                        status: StatusPesanan.DIPROSES,
                        description: 'Pembayaran dikonfirmasi',
                    },
                }),
            ]);
        }

        return payment;
    }

    async uploadProof(orderId: string, proofUrl: string) {
        return this.prisma.orderPaymentDetail.update({
            where: { orderId },
            data: { proofUrl },
        });
    }
}
