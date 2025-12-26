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
exports.GetPenyaluranQueryDto = exports.BulkUpdatePenyaluranDto = exports.UpdatePenyaluranDto = exports.CreatePenyaluranDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePenyaluranDto {
    pangkalan_id;
    tanggal;
    jumlah;
    tipe_pembayaran;
}
exports.CreatePenyaluranDto = CreatePenyaluranDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePenyaluranDto.prototype, "pangkalan_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePenyaluranDto.prototype, "tanggal", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePenyaluranDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePenyaluranDto.prototype, "tipe_pembayaran", void 0);
class UpdatePenyaluranDto {
    jumlah;
    tipe_pembayaran;
}
exports.UpdatePenyaluranDto = UpdatePenyaluranDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePenyaluranDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePenyaluranDto.prototype, "tipe_pembayaran", void 0);
class BulkUpdatePenyaluranDto {
    pangkalan_id;
    tanggal_awal;
    tanggal_akhir;
    tipe_pembayaran;
    data;
}
exports.BulkUpdatePenyaluranDto = BulkUpdatePenyaluranDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdatePenyaluranDto.prototype, "pangkalan_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkUpdatePenyaluranDto.prototype, "tanggal_awal", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkUpdatePenyaluranDto.prototype, "tanggal_akhir", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdatePenyaluranDto.prototype, "tipe_pembayaran", void 0);
class GetPenyaluranQueryDto {
    pangkalan_id;
    tanggal_awal;
    tanggal_akhir;
    tipe_pembayaran;
    bulan;
}
exports.GetPenyaluranQueryDto = GetPenyaluranQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPenyaluranQueryDto.prototype, "pangkalan_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetPenyaluranQueryDto.prototype, "tanggal_awal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetPenyaluranQueryDto.prototype, "tanggal_akhir", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPenyaluranQueryDto.prototype, "tipe_pembayaran", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPenyaluranQueryDto.prototype, "bulan", void 0);
//# sourceMappingURL=index.js.map