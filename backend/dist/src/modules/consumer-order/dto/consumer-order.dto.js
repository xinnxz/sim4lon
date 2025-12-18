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
exports.UpdateConsumerOrderDto = exports.CreateConsumerOrderDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const ALL_LPG_TYPES = ['3kg', '5kg', '12kg', '50kg', 'kg3', 'kg5', 'kg12', 'kg50'];
function toPrismaLpgType(value) {
    const mapping = {
        '3kg': 'kg3', '5kg': 'kg5', '12kg': 'kg12', '50kg': 'kg50',
        'kg3': 'kg3', 'kg5': 'kg5', 'kg12': 'kg12', 'kg50': 'kg50',
    };
    return mapping[value] || 'kg3';
}
class CreateConsumerOrderDto {
    consumer_id;
    consumer_name;
    lpg_type;
    qty;
    price_per_unit;
    payment_status;
    note;
}
exports.CreateConsumerOrderDto = CreateConsumerOrderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConsumerOrderDto.prototype, "consumer_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateConsumerOrderDto.prototype, "consumer_name", void 0);
__decorate([
    (0, class_validator_1.IsIn)(ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' }),
    (0, class_transformer_1.Transform)(({ value }) => toPrismaLpgType(value)),
    __metadata("design:type", String)
], CreateConsumerOrderDto.prototype, "lpg_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateConsumerOrderDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateConsumerOrderDto.prototype, "price_per_unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.consumer_payment_status),
    __metadata("design:type", String)
], CreateConsumerOrderDto.prototype, "payment_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsumerOrderDto.prototype, "note", void 0);
class UpdateConsumerOrderDto {
    consumer_id;
    consumer_name;
    qty;
    price_per_unit;
    payment_status;
    note;
}
exports.UpdateConsumerOrderDto = UpdateConsumerOrderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateConsumerOrderDto.prototype, "consumer_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateConsumerOrderDto.prototype, "consumer_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateConsumerOrderDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateConsumerOrderDto.prototype, "price_per_unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.consumer_payment_status),
    __metadata("design:type", String)
], UpdateConsumerOrderDto.prototype, "payment_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsumerOrderDto.prototype, "note", void 0);
//# sourceMappingURL=consumer-order.dto.js.map