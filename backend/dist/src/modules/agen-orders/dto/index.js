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
exports.ReceiveDto = exports.CreateDto = exports.ReceiveAgenOrderDto = exports.CreateAgenOrderDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAgenOrderDto {
    lpg_type;
    qty;
    note;
}
exports.CreateAgenOrderDto = CreateAgenOrderDto;
exports.CreateDto = CreateAgenOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgenOrderDto.prototype, "lpg_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Jumlah minimal 1 unit' }),
    __metadata("design:type", Number)
], CreateAgenOrderDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgenOrderDto.prototype, "note", void 0);
class ReceiveAgenOrderDto {
    qty_received;
    note;
}
exports.ReceiveAgenOrderDto = ReceiveAgenOrderDto;
exports.ReceiveDto = ReceiveAgenOrderDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Jumlah diterima minimal 1 unit' }),
    __metadata("design:type", Number)
], ReceiveAgenOrderDto.prototype, "qty_received", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiveAgenOrderDto.prototype, "note", void 0);
//# sourceMappingURL=index.js.map