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
exports.GetPerencanaanQueryDto = exports.BulkUpdatePerencanaanDto = exports.UpdatePerencanaanDto = exports.CreatePerencanaanDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PerencanaanDataItemDto {
    tanggal;
    jumlah;
    jumlah_normal;
    jumlah_fakultatif;
}
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PerencanaanDataItemDto.prototype, "tanggal", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PerencanaanDataItemDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PerencanaanDataItemDto.prototype, "jumlah_normal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PerencanaanDataItemDto.prototype, "jumlah_fakultatif", void 0);
class CreatePerencanaanDto {
    pangkalan_id;
    tanggal;
    jumlah;
    kondisi;
    alokasi_bulan;
}
exports.CreatePerencanaanDto = CreatePerencanaanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePerencanaanDto.prototype, "pangkalan_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePerencanaanDto.prototype, "tanggal", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePerencanaanDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePerencanaanDto.prototype, "kondisi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePerencanaanDto.prototype, "alokasi_bulan", void 0);
class UpdatePerencanaanDto {
    jumlah;
    kondisi;
}
exports.UpdatePerencanaanDto = UpdatePerencanaanDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePerencanaanDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerencanaanDto.prototype, "kondisi", void 0);
class BulkUpdatePerencanaanDto {
    pangkalan_id;
    tanggal_awal;
    tanggal_akhir;
    kondisi;
    data;
}
exports.BulkUpdatePerencanaanDto = BulkUpdatePerencanaanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdatePerencanaanDto.prototype, "pangkalan_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkUpdatePerencanaanDto.prototype, "tanggal_awal", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkUpdatePerencanaanDto.prototype, "tanggal_akhir", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdatePerencanaanDto.prototype, "kondisi", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PerencanaanDataItemDto),
    __metadata("design:type", Array)
], BulkUpdatePerencanaanDto.prototype, "data", void 0);
class GetPerencanaanQueryDto {
    pangkalan_id;
    tanggal_awal;
    tanggal_akhir;
    kondisi;
    bulan;
}
exports.GetPerencanaanQueryDto = GetPerencanaanQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPerencanaanQueryDto.prototype, "pangkalan_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetPerencanaanQueryDto.prototype, "tanggal_awal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetPerencanaanQueryDto.prototype, "tanggal_akhir", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPerencanaanQueryDto.prototype, "kondisi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPerencanaanQueryDto.prototype, "bulan", void 0);
//# sourceMappingURL=index.js.map