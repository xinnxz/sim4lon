import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePaymentRecordDto, UpdateOrderPaymentDto } from './dto';
import { payment_method } from '@prisma/client';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }

    async findAllRecords(
        page = 1,
        limit = 10,
        orderId?: string,
        invoiceId?: string,
        method?: payment_method,
    ) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (orderId) where.order_id = orderId;
        if (invoiceId) where.invoice_id = invoiceId;
        if (method) where.method = method;

        const [records, total] = await Promise.all([
            this.prisma.payment_records.findMany({
                where,
                skip,
                take: limit,
                orderBy: { payment_time: 'desc' },
                include: {
                    orders: {
                        select: { id: true, pangkalans: { select: { name: true } } },
                    },
                    invoices: {
                        select: { id: true, invoice_number: true },
                    },
                    users: {
                        select: { id: true, name: true },
                    },
                },
            }),
            this.prisma.payment_records.count({ where }),
        ]);

        return {
            data: records,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOneRecord(id: string) {
        const record = await this.prisma.payment_records.findUnique({
            where: { id },
            include: {
                orders: {
                    include: {
                        pangkalans: true,
                        order_items: true,
                    },
                },
                invoices: true,
                users: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!record) {
            throw new NotFoundException('Payment record tidak ditemukan');
        }

        return record;
    }

    async createRecord(dto: CreatePaymentRecordDto, userId: string) {
        const record = await this.prisma.payment_records.create({
            data: {
                order_id: dto.order_id,
                invoice_id: dto.invoice_id,
                method: dto.method,
                amount: dto.amount,
                proof_url: dto.proof_url,
                note: dto.note,
                recorded_by_user_id: userId,
            },
            include: {
                orders: true,
                invoices: true,
                users: {
                    select: { id: true, name: true },
                },
            },
        });

        // If linked to order, update order payment details
        if (dto.order_id) {
            await this.prisma.order_payment_details.upsert({
                where: { order_id: dto.order_id },
                create: {
                    order_id: dto.order_id,
                    payment_method: dto.method,
                    amount_paid: dto.amount,
                    payment_date: new Date(),
                    proof_url: dto.proof_url,
                    is_paid: false, // Will be updated based on total
                },
                update: {
                    amount_paid: {
                        increment: dto.amount,
                    },
                    payment_date: new Date(),
                },
            });
        }

        return record;
    }

    async updateOrderPayment(orderId: string, dto: UpdateOrderPaymentDto) {
        // Check if order exists
        const order = await this.prisma.orders.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order tidak ditemukan');
        }

        const paymentDetail = await this.prisma.order_payment_details.upsert({
            where: { order_id: orderId },
            create: {
                order_id: orderId,
                is_paid: dto.is_paid || false,
                is_dp: dto.is_dp || false,
                payment_method: dto.payment_method,
                amount_paid: dto.amount_paid || 0,
                payment_date: dto.is_paid || dto.amount_paid ? new Date() : null,
                proof_url: dto.proof_url,
            },
            update: {
                ...dto,
                payment_date: dto.is_paid || dto.amount_paid ? new Date() : undefined,
                updated_at: new Date(),
            },
        });

        return paymentDetail;
    }

    async getOrderPayment(orderId: string) {
        const payment = await this.prisma.order_payment_details.findUnique({
            where: { order_id: orderId },
            include: {
                orders: {
                    select: {
                        id: true,
                        total_amount: true,
                        pangkalans: { select: { name: true } },
                    },
                },
            },
        });

        if (!payment) {
            throw new NotFoundException('Payment detail tidak ditemukan');
        }

        return payment;
    }
}
