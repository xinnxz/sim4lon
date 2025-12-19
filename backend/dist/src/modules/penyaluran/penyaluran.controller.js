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
exports.PenyaluranController = void 0;
const common_1 = require("@nestjs/common");
const penyaluran_service_1 = require("./penyaluran.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const client_1 = require("@prisma/client");
let PenyaluranController = class PenyaluranController {
    penyaluranService;
    constructor(penyaluranService) {
        this.penyaluranService = penyaluranService;
    }
    findAll(query) {
        return this.penyaluranService.findAll(query);
    }
    getRekapitulasi(bulan, tipePembayaran, lpgType) {
        return this.penyaluranService.getRekapitulasi(bulan, tipePembayaran, lpgType);
    }
    create(dto) {
        return this.penyaluranService.create(dto);
    }
    bulkUpdate(dto) {
        return this.penyaluranService.bulkUpdate(dto);
    }
    update(id, dto) {
        return this.penyaluranService.update(id, dto);
    }
    delete(id) {
        return this.penyaluranService.delete(id);
    }
};
exports.PenyaluranController = PenyaluranController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetPenyaluranQueryDto]),
    __metadata("design:returntype", void 0)
], PenyaluranController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('rekapitulasi'),
    __param(0, (0, common_1.Query)('bulan')),
    __param(1, (0, common_1.Query)('tipe_pembayaran')),
    __param(2, (0, common_1.Query)('lpg_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PenyaluranController.prototype, "getRekapitulasi", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN, client_1.user_role.OPERATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePenyaluranDto]),
    __metadata("design:returntype", void 0)
], PenyaluranController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN, client_1.user_role.OPERATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkUpdatePenyaluranDto]),
    __metadata("design:returntype", void 0)
], PenyaluranController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN, client_1.user_role.OPERATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePenyaluranDto]),
    __metadata("design:returntype", void 0)
], PenyaluranController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PenyaluranController.prototype, "delete", null);
exports.PenyaluranController = PenyaluranController = __decorate([
    (0, common_1.Controller)('penyaluran'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [penyaluran_service_1.PenyaluranService])
], PenyaluranController);
//# sourceMappingURL=penyaluran.controller.js.map