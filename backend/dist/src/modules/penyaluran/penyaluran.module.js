"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenyaluranModule = void 0;
const common_1 = require("@nestjs/common");
const penyaluran_controller_1 = require("./penyaluran.controller");
const penyaluran_service_1 = require("./penyaluran.service");
const prisma_1 = require("../../prisma");
let PenyaluranModule = class PenyaluranModule {
};
exports.PenyaluranModule = PenyaluranModule;
exports.PenyaluranModule = PenyaluranModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        controllers: [penyaluran_controller_1.PenyaluranController],
        providers: [penyaluran_service_1.PenyaluranService],
        exports: [penyaluran_service_1.PenyaluranService],
    })
], PenyaluranModule);
//# sourceMappingURL=penyaluran.module.js.map