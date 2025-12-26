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
exports.StockController = void 0;
const common_1 = require("@nestjs/common");
const stock_service_1 = require("./stock.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const client_1 = require("@prisma/client");
let StockController = class StockController {
    stockService;
    constructor(stockService) {
        this.stockService = stockService;
    }
    getHistory(page, limit, lpgType, movementType) {
        return this.stockService.getHistory(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, lpgType, movementType);
    }
    getSummary() {
        return this.stockService.getSummary();
    }
    getHistoryByType(lpgType, limit) {
        return this.stockService.getHistoryByType(lpgType, limit ? parseInt(limit, 10) : 20);
    }
    createMovement(dto, userId) {
        return this.stockService.createMovement(dto, userId);
    }
};
exports.StockController = StockController;
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('lpg_type')),
    __param(3, (0, common_1.Query)('movement_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('history/:lpgType'),
    __param(0, (0, common_1.Param)('lpgType')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getHistoryByType", null);
__decorate([
    (0, common_1.Post)('movements'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN, client_1.user_role.OPERATOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateStockMovementDto, String]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "createMovement", null);
exports.StockController = StockController = __decorate([
    (0, common_1.Controller)('stocks'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockController);
//# sourceMappingURL=stock.controller.js.map