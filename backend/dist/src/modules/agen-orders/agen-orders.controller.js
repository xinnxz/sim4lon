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
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateAgenOrderDto]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/receive'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.ReceiveAgenOrderDto]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "receive", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgenOrdersController.prototype, "cancel", null);
exports.AgenOrdersController = AgenOrdersController = __decorate([
    (0, common_1.Controller)('agen-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __metadata("design:paramtypes", [agen_orders_service_1.AgenOrdersService])
], AgenOrdersController);
//# sourceMappingURL=agen-orders.controller.js.map