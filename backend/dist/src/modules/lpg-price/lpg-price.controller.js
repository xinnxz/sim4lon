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
exports.LpgPriceController = void 0;
const common_1 = require("@nestjs/common");
const lpg_price_service_1 = require("./lpg-price.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let LpgPriceController = class LpgPriceController {
    lpgPriceService;
    constructor(lpgPriceService) {
        this.lpgPriceService = lpgPriceService;
    }
    findAll(req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.lpgPriceService.findAll(pangkalanId);
    }
    update(id, dto, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.lpgPriceService.update(id, pangkalanId, dto);
    }
    bulkUpdate(dto, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.lpgPriceService.bulkUpdate(pangkalanId, dto.prices);
    }
};
exports.LpgPriceController = LpgPriceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LpgPriceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateLpgPriceDto, Object]),
    __metadata("design:returntype", void 0)
], LpgPriceController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkUpdateLpgPricesDto, Object]),
    __metadata("design:returntype", void 0)
], LpgPriceController.prototype, "bulkUpdate", null);
exports.LpgPriceController = LpgPriceController = __decorate([
    (0, common_1.Controller)('lpg-prices'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.user_role.PANGKALAN),
    __metadata("design:paramtypes", [lpg_price_service_1.LpgPriceService])
], LpgPriceController);
//# sourceMappingURL=lpg-price.controller.js.map