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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUpdateLpgPricesDto = exports.LpgPriceItemDto = exports.UpdateLpgPriceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class UpdateLpgPriceDto {
    cost_price;
    selling_price;
    is_active;
}
exports.UpdateLpgPriceDto = UpdateLpgPriceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateLpgPriceDto.prototype, "cost_price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateLpgPriceDto.prototype, "selling_price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLpgPriceDto.prototype, "is_active", void 0);
class LpgPriceItemDto {
    lpg_type;
    cost_price;
    selling_price;
    is_active;
}
exports.LpgPriceItemDto = LpgPriceItemDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.lpg_type),
    __metadata("design:type", String)
], LpgPriceItemDto.prototype, "lpg_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], LpgPriceItemDto.prototype, "cost_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], LpgPriceItemDto.prototype, "selling_price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LpgPriceItemDto.prototype, "is_active", void 0);
class BulkUpdateLpgPricesDto {
    prices;
}
exports.BulkUpdateLpgPricesDto = BulkUpdateLpgPricesDto;
//# sourceMappingURL=lpg-price.dto.js.map