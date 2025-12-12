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
exports.UpdateOrderPaymentDto = exports.CreatePaymentRecordDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreatePaymentRecordDto {
    order_id;
    invoice_id;
    method;
    amount;
    proof_url;
    note;
}
exports.CreatePaymentRecordDto = CreatePaymentRecordDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentRecordDto.prototype, "order_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentRecordDto.prototype, "invoice_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.payment_method),
    __metadata("design:type", String)
], CreatePaymentRecordDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePaymentRecordDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentRecordDto.prototype, "proof_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentRecordDto.prototype, "note", void 0);
class UpdateOrderPaymentDto {
    is_paid;
    is_dp;
    payment_method;
    amount_paid;
    proof_url;
}
exports.UpdateOrderPaymentDto = UpdateOrderPaymentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateOrderPaymentDto.prototype, "is_paid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateOrderPaymentDto.prototype, "is_dp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.payment_method),
    __metadata("design:type", String)
], UpdateOrderPaymentDto.prototype, "payment_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateOrderPaymentDto.prototype, "amount_paid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderPaymentDto.prototype, "proof_url", void 0);
//# sourceMappingURL=payment.dto.js.map