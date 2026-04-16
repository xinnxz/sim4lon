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
exports.PangkalanController = void 0;
const common_1 = require("@nestjs/common");
const pangkalan_service_1 = require("./pangkalan.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
let PangkalanController = class PangkalanController {
    pangkalanService;
    constructor(pangkalanService) {
        this.pangkalanService = pangkalanService;
    }
    findAll(page, limit, isActive, search) {
        return this.pangkalanService.findAll(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, isActive !== undefined ? isActive === 'true' : undefined, search);
    }
    findOne(id) {
        return this.pangkalanService.findOne(id);
    }
    create(dto) {
        return this.pangkalanService.create(dto);
    }
    update(id, dto) {
        return this.pangkalanService.update(id, dto);
    }
    remove(id) {
        return this.pangkalanService.remove(id);
    }
};
exports.PangkalanController = PangkalanController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('is_active')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PangkalanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PangkalanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePangkalanDto]),
    __metadata("design:returntype", void 0)
], PangkalanController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePangkalanDto]),
    __metadata("design:returntype", void 0)
], PangkalanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PangkalanController.prototype, "remove", null);
exports.PangkalanController = PangkalanController = __decorate([
    (0, common_1.Controller)('pangkalans'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pangkalan_service_1.PangkalanService])
], PangkalanController);
//# sourceMappingURL=pangkalan.controller.js.map