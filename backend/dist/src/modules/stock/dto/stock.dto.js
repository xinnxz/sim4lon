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
exports.CreateStockMovementDto = void 0;
exports.mapLpgTypeToEnum = mapLpgTypeToEnum;
exports.mapMovementTypeToEnum = mapMovementTypeToEnum;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validLpgTypes = ['3kg', '12kg', '50kg'];
const validMovementTypes = ['MASUK', 'KELUAR'];
class CreateStockMovementDto {
    lpg_type;
    lpg_product_id;
    movement_type;
    qty;
    note;
}
exports.CreateStockMovementDto = CreateStockMovementDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(validLpgTypes, { message: 'lpg_type must be one of: 3kg, 12kg, 50kg' }),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "lpg_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "lpg_product_id", void 0);
__decorate([
    (0, class_validator_1.IsIn)(validMovementTypes, { message: 'movement_type must be MASUK or KELUAR' }),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "movement_type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateStockMovementDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "note", void 0);
function mapLpgTypeToEnum(value) {
    if (value === '3kg')
        return 'kg3';
    if (value === '12kg')
        return 'kg12';
    if (value === '50kg')
        return 'kg50';
    return 'kg3';
}
function mapMovementTypeToEnum(value) {
    return value === 'MASUK' ? 'MASUK' : 'KELUAR';
}
//# sourceMappingURL=stock.dto.js.map