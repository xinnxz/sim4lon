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
exports.GeminiController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const gemini_service_1 = require("./gemini.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
class ParseVoiceCommandDto {
    text;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ParseVoiceCommandDto.prototype, "text", void 0);
let GeminiController = class GeminiController {
    geminiService;
    constructor(geminiService) {
        this.geminiService = geminiService;
    }
    async parseVoiceCommand(dto) {
        const parsed = await this.geminiService.parseVoiceCommand(dto.text);
        const validated = await this.geminiService.validateParsedOrder(parsed);
        return validated;
    }
};
exports.GeminiController = GeminiController;
__decorate([
    (0, common_1.Post)('parse-order'),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ParseVoiceCommandDto]),
    __metadata("design:returntype", Promise)
], GeminiController.prototype, "parseVoiceCommand", null);
exports.GeminiController = GeminiController = __decorate([
    (0, common_1.Controller)('gemini'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [gemini_service_1.GeminiService])
], GeminiController);
//# sourceMappingURL=gemini.controller.js.map