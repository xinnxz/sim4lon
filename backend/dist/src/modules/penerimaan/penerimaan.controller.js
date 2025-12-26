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
exports.PenerimaanController = void 0;
const common_1 = require("@nestjs/common");
const penerimaan_service_1 = require("./penerimaan.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const client_1 = require("@prisma/client");
let PenerimaanController = class PenerimaanController {
    penerimaanService;
    constructor(penerimaanService) {
        this.penerimaanService = penerimaanService;
    }
    findAll(query) {
        return this.penerimaanService.findAll(query);
    }
    getInOutAgen(bulan) {
        return this.penerimaanService.getInOutAgen(bulan);
    }
    create(dto) {
        return this.penerimaanService.create(dto);
    }
    delete(id) {
        return this.penerimaanService.delete(id);
    }
};
exports.PenerimaanController = PenerimaanController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetPenerimaanQueryDto]),
    __metadata("design:returntype", void 0)
], PenerimaanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('in-out-agen'),
    __param(0, (0, common_1.Query)('bulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PenerimaanController.prototype, "getInOutAgen", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN, client_1.user_role.OPERATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePenerimaanDto]),
    __metadata("design:returntype", void 0)
], PenerimaanController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PenerimaanController.prototype, "delete", null);
exports.PenerimaanController = PenerimaanController = __decorate([
    (0, common_1.Controller)('penerimaan'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [penerimaan_service_1.PenerimaanService])
], PenerimaanController);
//# sourceMappingURL=penerimaan.controller.js.map