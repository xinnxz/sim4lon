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
exports.CompanyProfileController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const company_profile_service_1 = require("./company-profile.service");
const update_company_profile_dto_1 = require("./dto/update-company-profile.dto");
let CompanyProfileController = class CompanyProfileController {
    companyProfileService;
    constructor(companyProfileService) {
        this.companyProfileService = companyProfileService;
    }
    async getProfile() {
        return this.companyProfileService.getProfile();
    }
    async updateProfile(dto) {
        return this.companyProfileService.updateProfile(dto);
    }
};
exports.CompanyProfileController = CompanyProfileController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_company_profile_dto_1.UpdateCompanyProfileDto]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "updateProfile", null);
exports.CompanyProfileController = CompanyProfileController = __decorate([
    (0, common_1.Controller)('company-profile'),
    __metadata("design:paramtypes", [company_profile_service_1.CompanyProfileService])
], CompanyProfileController);
//# sourceMappingURL=company-profile.controller.js.map