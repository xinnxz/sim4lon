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
exports.PangkalanStockController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const pangkalan_stock_service_1 = require("./pangkalan-stock.service");
const dto_1 = require("./dto");
let PangkalanStockController = class PangkalanStockController {
    stockService;
    constructor(stockService) {
        this.stockService = stockService;
    }
    async getStockLevels(req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.getStockLevels(pangkalanId);
    }
    async getMovements(req, startDate, endDate, limit) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.getMovements(pangkalanId, startDate, endDate, limit ? parseInt(limit) : 50);
    }
    async receiveStock(req, dto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.receiveStock(pangkalanId, dto);
    }
    async adjustStock(req, dto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.adjustStock(pangkalanId, dto);
    }
    async updateLevels(req, dto) {
        const pangkalanId = req.user.pangkalan_id;
        return this.stockService.updateLevels(pangkalanId, dto);
    }
};
exports.PangkalanStockController = PangkalanStockController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PangkalanStockController.prototype, "getStockLevels", null);
__decorate([
    (0, common_1.Get)('movements'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PangkalanStockController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Post)('receive'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.ReceiveStockDto]),
    __metadata("design:returntype", Promise)
], PangkalanStockController.prototype, "receiveStock", null);
__decorate([
    (0, common_1.Post)('adjust'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AdjustStockDto]),
    __metadata("design:returntype", Promise)
], PangkalanStockController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Put)('levels'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdateStockLevelsDto]),
    __metadata("design:returntype", Promise)
], PangkalanStockController.prototype, "updateLevels", null);
exports.PangkalanStockController = PangkalanStockController = __decorate([
    (0, common_1.Controller)('pangkalan-stocks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PANGKALAN'),
    __metadata("design:paramtypes", [pangkalan_stock_service_1.PangkalanStockService])
], PangkalanStockController);
//# sourceMappingURL=pangkalan-stock.controller.js.map