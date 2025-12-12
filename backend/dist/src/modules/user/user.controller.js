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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const client_1 = require("@prisma/client");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    findAll(page, limit, search) {
        return this.userService.findAll(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, search);
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
    create(dto) {
        return this.userService.create(dto);
    }
    update(id, dto) {
        return this.userService.update(id, dto);
    }
    remove(id) {
        return this.userService.remove(id);
    }
    resetPassword(id) {
        return this.userService.resetPassword(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/reset-password'),
    (0, decorators_1.Roles)(client_1.user_role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "resetPassword", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map