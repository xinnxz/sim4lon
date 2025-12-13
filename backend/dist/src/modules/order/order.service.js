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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
let OrderService = class OrderService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, status, pangkalanId, driverId) {
        const skip = (page - 1) * limit;
        const where = { deleted_at: null };
        if (status)
            where.current_status = status;
        if (pangkalanId)
            where.pangkalan_id = pangkalanId;
        if (driverId)
            where.driver_id = driverId;
        const [orders, total] = await Promise.all([
            this.prisma.orders.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    pangkalans: {
                        select: { id: true, code: true, name: true, region: true, address: true, phone: true },
                    },
                    drivers: {
                        select: { id: true, code: true, name: true, phone: true },
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Order tidak ditemukan');
        }
        return order;
    }
    async create(dto) {
        const mapStringToLpgType = (strType) => {
            const normalized = strType.toLowerCase().trim();
            const mapping = {
                '3kg': 'kg3',
                '12kg': 'kg12',
                '50kg': 'kg50',
                'kg3': 'kg3',
                'kg12': 'kg12',
                'kg50': 'kg50',
                '3': 'kg3',
                '12': 'kg12',
                '50': 'kg50',
                '3.0': 'kg3',
                '3.00': 'kg3',
                '12.0': 'kg12',
                '12.00': 'kg12',
                '50.0': 'kg50',
                '50.00': 'kg50',
            };
            const result = mapping[normalized];
            if (result) {
                return result;
            }
            const numberMatch = normalized.match(/(\d+(?:\.\d+)?)/);
            if (numberMatch) {
                const size = parseFloat(numberMatch[1]);
                if (size <= 5)
                    return 'kg3';
                if (size <= 30)
                    return 'kg12';
                return 'kg50';
            }
            console.warn(`Unable to map lpg_type: ${strType}, defaulting to kg12`);
            return 'kg12';
        };
        const orderCount = await this.prisma.orders.count();
        const orderCode = `ORD-${String(orderCount + 1).padStart(4, '0')}`;
        const PPN_RATE = 0.12;
        let subtotal = 0;
        let totalTax = 0;
        const orderItemsData = dto.items.map((item) => {
            const itemSubtotal = item.price_per_unit * item.qty;
            const isTaxable = item.is_taxable ?? false;
            const itemTax = isTaxable ? Math.round(itemSubtotal * PPN_RATE) : 0;
            subtotal += itemSubtotal;
            totalTax += itemTax;
            return {
                lpg_type: mapStringToLpgType(item.lpg_type),
                label: item.label,
                price_per_unit: item.price_per_unit,
                qty: item.qty,
                sub_total: itemSubtotal,
                is_taxable: isTaxable,
                tax_amount: itemTax,
            };
        });
        const totalAmount = subtotal + totalTax;
        const order = await this.prisma.orders.create({
            data: {
                code: orderCode,
                pangkalan_id: dto.pangkalan_id,
                driver_id: dto.driver_id,
                note: dto.note,
                subtotal: subtotal,
                tax_amount: totalTax,
                total_amount: totalAmount,
                current_status: 'DRAFT',
                order_items: {
                    create: orderItemsData,
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
    async update(id, dto) {
        await this.findOne(id);
        const order = await this.prisma.orders.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date(),
            },
            include: {
                pangkalans: {
                    select: { id: true, code: true, name: true, region: true, address: true, phone: true },
                },
                drivers: {
                    select: { id: true, code: true, name: true, phone: true },
                },
                order_items: true,
                timeline_tracks: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.findOne(id);
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
    async remove(id) {
        await this.findOne(id);
        await this.prisma.orders.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return { message: 'Order berhasil dihapus' };
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            DRAFT: ['MENUNGGU_PEMBAYARAN', 'BATAL'],
            MENUNGGU_PEMBAYARAN: ['DIPROSES', 'BATAL'],
            DIPROSES: ['SIAP_KIRIM', 'DIKIRIM', 'BATAL'],
            SIAP_KIRIM: ['DIKIRIM', 'BATAL'],
            DIKIRIM: ['SELESAI', 'BATAL'],
            SELESAI: [],
            BATAL: [],
        };
        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new common_1.BadRequestException(`Tidak dapat mengubah status dari ${currentStatus} ke ${newStatus}`);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map