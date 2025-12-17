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
exports.UpdateStockLevelsDto = exports.AdjustStockDto = exports.ReceiveStockDto = exports.MOVEMENT_TYPES = exports.LPG_TYPES = void 0;
const class_validator_1 = require("class-validator");
exports.LPG_TYPES = ['kg3', 'kg5', 'kg12', 'kg50'];
exports.MOVEMENT_TYPES = ['MASUK', 'KELUAR', 'OPNAME'];
class ReceiveStockDto {
    lpg_type;
    qty;
    note;
    movement_date;
}
exports.ReceiveStockDto = ReceiveStockDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.LPG_TYPES),
    __metadata("design:type", String)
], ReceiveStockDto.prototype, "lpg_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReceiveStockDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiveStockDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReceiveStockDto.prototype, "movement_date", void 0);
class AdjustStockDto {
    lpg_type;
    actual_qty;
    note;
}
exports.AdjustStockDto = AdjustStockDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.LPG_TYPES),
    __metadata("design:type", String)
], AdjustStockDto.prototype, "lpg_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AdjustStockDto.prototype, "actual_qty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustStockDto.prototype, "note", void 0);
class UpdateStockLevelsDto {
    lpg_type;
    warning_level;
    critical_level;
}
exports.UpdateStockLevelsDto = UpdateStockLevelsDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.LPG_TYPES),
    __metadata("design:type", String)
], UpdateStockLevelsDto.prototype, "lpg_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateStockLevelsDto.prototype, "warning_level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateStockLevelsDto.prototype, "critical_level", void 0);
//# sourceMappingURL=pangkalan-stock.dto.js.map