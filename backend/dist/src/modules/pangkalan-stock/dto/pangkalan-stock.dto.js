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
exports.UpdateStockLevelsDto = exports.AdjustStockDto = exports.ReceiveStockDto = exports.MOVEMENT_TYPES = exports.ALL_LPG_TYPES = exports.LPG_TYPES_FRONTEND = exports.LPG_TYPES = void 0;
exports.toBackendFormat = toBackendFormat;
exports.toFrontendFormat = toFrontendFormat;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
exports.LPG_TYPES = ['kg3', 'kg5', 'kg12', 'kg50'];
exports.LPG_TYPES_FRONTEND = ['3kg', '5kg', '12kg', '50kg'];
exports.ALL_LPG_TYPES = [...exports.LPG_TYPES, ...exports.LPG_TYPES_FRONTEND];
exports.MOVEMENT_TYPES = ['MASUK', 'KELUAR', 'OPNAME'];
function toBackendFormat(type) {
    const mapping = {
        '3kg': 'kg3', '5kg': 'kg5', '12kg': 'kg12', '50kg': 'kg50',
        'kg3': 'kg3', 'kg5': 'kg5', 'kg12': 'kg12', 'kg50': 'kg50',
    };
    return mapping[type] || 'kg3';
}
function toFrontendFormat(type) {
    const mapping = {
        'kg3': '3kg', 'kg5': '5kg', 'kg12': '12kg', 'kg50': '50kg',
        '3kg': '3kg', '5kg': '5kg', '12kg': '12kg', '50kg': '50kg',
    };
    return mapping[type] || '3kg';
}
class ReceiveStockDto {
    lpg_type;
    qty;
    note;
    movement_date;
}
exports.ReceiveStockDto = ReceiveStockDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' }),
    (0, class_transformer_1.Transform)(({ value }) => toBackendFormat(value)),
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
    (0, class_validator_1.IsIn)(exports.ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' }),
    (0, class_transformer_1.Transform)(({ value }) => toBackendFormat(value)),
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
    (0, class_validator_1.IsIn)(exports.ALL_LPG_TYPES, { message: 'lpg_type must be one of: 3kg, 5kg, 12kg, 50kg' }),
    (0, class_transformer_1.Transform)(({ value }) => toBackendFormat(value)),
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