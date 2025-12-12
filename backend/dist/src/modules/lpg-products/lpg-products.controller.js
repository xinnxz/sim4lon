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
exports.LpgProductsController = void 0;
const common_1 = require("@nestjs/common");
const lpg_products_service_1 = require("./lpg-products.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const client_1 = require("@prisma/client");
let LpgProductsController = class LpgProductsController {
    lpgProductsService;
    constructor(lpgProductsService) {
        this.lpgProductsService = lpgProductsService;
    }
    findAll(includeInactive) {
        return this.lpgProductsService.findAll(includeInactive === 'true');
    }
    getWithStock() {
        return this.lpgProductsService.getStockSummary();
    }
    findOne(id) {
        return this.lpgProductsService.findOne(id);
    }
    create(dto) {
        return this.lpgProductsService.create(dto);
    }
    update(id, dto) {
        return this.lpgProductsService.update(id, dto);
    }
    remove(id) {
        return this.lpgProductsService.remove(id);
    }
    addPrice(productId, dto) {
        return this.lpgProductsService.addPrice(productId, dto);
    }
    updatePrice(priceId, dto) {
        return this.lpgProductsService.updatePrice(priceId, dto);
    }
    removePrice(priceId) {
        return this.lpgProductsService.removePrice(priceId);
    }
};
exports.LpgProductsController = LpgProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('with-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "getWithStock", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateLpgProductDto]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateLpgProductDto]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':productId/prices'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateLpgPriceDto]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "addPrice", null);
__decorate([
    (0, common_1.Put)('prices/:priceId'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('priceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateLpgPriceDto]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Delete)('prices/:priceId'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('priceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LpgProductsController.prototype, "removePrice", null);
exports.LpgProductsController = LpgProductsController = __decorate([
    (0, common_1.Controller)('lpg-products'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [lpg_products_service_1.LpgProductsService])
], LpgProductsController);
//# sourceMappingURL=lpg-products.controller.js.map