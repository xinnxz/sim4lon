"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
let PaymentService = class PaymentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllRecords(page = 1, limit = 10, orderId, invoiceId, method) {
        const skip = (page - 1) * limit;
        const where = {};
        if (orderId)
            where.order_id = orderId;
        if (invoiceId)
            where.invoice_id = invoiceId;
        if (method)
            where.method = method;
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
    async findOneRecord(id) {
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
            throw new common_1.NotFoundException('Payment record tidak ditemukan');
        }
        return record;
    }
    async createRecord(dto, userId) {
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
        if (dto.order_id) {
            await this.prisma.order_payment_details.upsert({
                where: { order_id: dto.order_id },
                create: {
                    order_id: dto.order_id,
                    payment_method: dto.method,
                    amount_paid: dto.amount,
                    payment_date: new Date(),
                    proof_url: dto.proof_url,
                    is_paid: false,
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
    async updateOrderPayment(orderId, dto) {
        const order = await this.prisma.orders.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order tidak ditemukan');
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
    async getOrderPayment(orderId) {
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
            throw new common_1.NotFoundException('Payment detail tidak ditemukan');
        }
        return payment;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map