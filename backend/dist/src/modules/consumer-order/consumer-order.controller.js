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
exports.ConsumerOrderController = void 0;
const common_1 = require("@nestjs/common");
const consumer_order_service_1 = require("./consumer-order.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ConsumerOrderController = class ConsumerOrderController {
    consumerOrderService;
    constructor(consumerOrderService) {
        this.consumerOrderService = consumerOrderService;
    }
    findAll(req, page, limit, startDate, endDate, paymentStatus, consumerId) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.findAll(pangkalanId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, { startDate, endDate, paymentStatus, consumerId });
    }
    getStats(req, today) {
        const pangkalanId = req.user.pangkalan_id;
        const todayOnly = today === 'true';
        return this.consumerOrderService.getStats(pangkalanId, todayOnly);
    }
    getRecentSales(req, limit) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.getRecentSales(pangkalanId, limit ? parseInt(limit, 10) : 5);
    }
    findOne(id, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.findOne(id, pangkalanId);
    }
    create(dto, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.create(pangkalanId, dto);
    }
    update(id, dto, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.update(id, pangkalanId, dto);
    }
    remove(id, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerOrderService.remove(id, pangkalanId);
    }
};
exports.ConsumerOrderController = ConsumerOrderController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('paymentStatus')),
    __param(6, (0, common_1.Query)('consumerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ConsumerOrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('today')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConsumerOrderController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConsumerOrderController.prototype, "getRecentSales", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsumerOrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateConsumerOrderDto, Object]),
    __metadata("design:returntype", void 0)
], ConsumerOrderController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateConsumerOrderDto, Object]),
    __metadata("design:returntype", void 0)
], ConsumerOrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsumerOrderController.prototype, "remove", null);
exports.ConsumerOrderController = ConsumerOrderController = __decorate([
    (0, common_1.Controller)('consumer-orders'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.user_role.PANGKALAN),
    __metadata("design:paramtypes", [consumer_order_service_1.ConsumerOrderService])
], ConsumerOrderController);
//# sourceMappingURL=consumer-order.controller.js.map