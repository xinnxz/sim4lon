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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const client_1 = require("@prisma/client");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    findAllRecords(page, limit, orderId, invoiceId, method) {
        return this.paymentService.findAllRecords(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, orderId, invoiceId, method);
    }
    findOneRecord(id) {
        return this.paymentService.findOneRecord(id);
    }
    createRecord(dto, userId) {
        return this.paymentService.createRecord(dto, userId);
    }
    getOrderPayment(orderId) {
        return this.paymentService.getOrderPayment(orderId);
    }
    updateOrderPayment(orderId, dto) {
        return this.paymentService.updateOrderPayment(orderId, dto);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)('records'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('order_id')),
    __param(3, (0, common_1.Query)('invoice_id')),
    __param(4, (0, common_1.Query)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findAllRecords", null);
__decorate([
    (0, common_1.Get)('records/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findOneRecord", null);
__decorate([
    (0, common_1.Post)('records'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePaymentRecordDto, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "createRecord", null);
__decorate([
    (0, common_1.Get)('orders/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getOrderPayment", null);
__decorate([
    (0, common_1.Put)('orders/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateOrderPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "updateOrderPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map