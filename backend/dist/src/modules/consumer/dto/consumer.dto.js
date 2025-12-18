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
exports.UpdateConsumerDto = exports.CreateConsumerDto = void 0;
const class_validator_1 = require("class-validator");
class CreateConsumerDto {
    name;
    nik;
    kk;
    consumer_type;
    phone;
    address;
    note;
}
exports.CreateConsumerDto = CreateConsumerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateConsumerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(16, 16, { message: 'NIK harus 16 digit' }),
    __metadata("design:type", String)
], CreateConsumerDto.prototype, "nik", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(16, 16, { message: 'Nomor KK harus 16 digit' }),
    __metadata("design:type", String)
], CreateConsumerDto.prototype, "kk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['RUMAH_TANGGA', 'WARUNG'], { message: 'Jenis harus RUMAH_TANGGA atau WARUNG' }),
    __metadata("design:type", String)
], CreateConsumerDto.prototype, "consumer_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateConsumerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsumerDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsumerDto.prototype, "note", void 0);
class UpdateConsumerDto {
    name;
    nik;
    kk;
    consumer_type;
    phone;
    address;
    note;
    is_active;
}
exports.UpdateConsumerDto = UpdateConsumerDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateConsumerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(16, 16, { message: 'NIK harus 16 digit' }),
    __metadata("design:type", String)
], UpdateConsumerDto.prototype, "nik", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(16, 16, { message: 'Nomor KK harus 16 digit' }),
    __metadata("design:type", String)
], UpdateConsumerDto.prototype, "kk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['RUMAH_TANGGA', 'WARUNG'], { message: 'Jenis harus RUMAH_TANGGA atau WARUNG' }),
    __metadata("design:type", String)
], UpdateConsumerDto.prototype, "consumer_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateConsumerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsumerDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsumerDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateConsumerDto.prototype, "is_active", void 0);
//# sourceMappingURL=consumer.dto.js.map