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
exports.ConsumerController = void 0;
const common_1 = require("@nestjs/common");
const consumer_service_1 = require("./consumer.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ConsumerController = class ConsumerController {
    consumerService;
    constructor(consumerService) {
        this.consumerService = consumerService;
    }
    findAll(req, page, limit, search) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.findAll(pangkalanId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, search);
    }
    getStats(req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.getStats(pangkalanId);
    }
    findOne(id, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.findOne(id, pangkalanId);
    }
    create(dto, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.create(pangkalanId, dto);
    }
    update(id, dto, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.update(id, pangkalanId, dto);
    }
    remove(id, req) {
        const pangkalanId = req.user.pangkalan_id;
        return this.consumerService.remove(id, pangkalanId);
    }
};
exports.ConsumerController = ConsumerController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ConsumerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsumerController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsumerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateConsumerDto, Object]),
    __metadata("design:returntype", void 0)
], ConsumerController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateConsumerDto, Object]),
    __metadata("design:returntype", void 0)
], ConsumerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsumerController.prototype, "remove", null);
exports.ConsumerController = ConsumerController = __decorate([
    (0, common_1.Controller)('consumers'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.user_role.PANGKALAN),
    __metadata("design:paramtypes", [consumer_service_1.ConsumerService])
], ConsumerController);
//# sourceMappingURL=consumer.controller.js.map