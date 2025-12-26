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
exports.AgenOrdersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const agen_orders_service_1 = require("./agen-orders.service");
const dto_1 = require("./dto");
let AgenOrdersController = class AgenOrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async findAllForAgen(status) {
        return this.ordersService.findAllForAgen(status);
    }
    async getStatsForAgen() {
        return this.ordersService.getStatsForAgen();
    }
    async confirmOrder(id) {
        return this.ordersService.confirmOrder(id);
    }
    async completeOrder(id, dto) {
        return this.ordersService.completeOrder(id, dto);
    }
    async cancelFromAgen(id) {
        return this.ordersService.cancelFromAgen(id);
    }
    async findAll(req, status) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.findAll(pangkalanId, status);
    }
    async getStats(req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.getStats(pangkalanId);
    }
    async findOne(req, id) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.findOne(id, pangkalanId);
    }
    async create(req, dto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.create(pangkalanId, dto);
    }
    async receive(req, id, dto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.receive(id, pangkalanId, dto);
    }
    async cancel(req, id) {
        const pangkalanId = req.user.pangkalan_id;
        return this.ordersService.cancel(id, pangkalanId);
    }
};
exports.AgenOrdersController = AgenOrdersController;
__decorate([
    (0, common_1.Get)('agen/all'),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "findAllForAgen", null);
__decorate([
    (0, common_1.Get)('agen/stats'),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "getStatsForAgen", null);
__decorate([
    (0, common_1.Patch)('agen/:id/confirm'),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "confirmOrder", null);
__decorate([
    (0, common_1.Patch)('agen/:id/complete'),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ReceiveAgenOrderDto]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "completeOrder", null);
__decorate([
    (0, common_1.Patch)('agen/:id/cancel'),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "cancelFromAgen", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateAgenOrderDto]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/receive'),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.ReceiveAgenOrderDto]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "receive", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "cancel", null);
exports.AgenOrdersController = AgenOrdersController = __decorate([
    (0, common_1.Controller)('agen-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [agen_orders_service_1.AgenOrdersService])
], AgenOrdersController);
//# sourceMappingURL=agen-orders.controller.js.map