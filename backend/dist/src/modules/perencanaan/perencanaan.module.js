"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerencanaanModule = void 0;
const common_1 = require("@nestjs/common");
const perencanaan_controller_1 = require("./perencanaan.controller");
const perencanaan_service_1 = require("./perencanaan.service");
const prisma_1 = require("../../prisma");
let PerencanaanModule = class PerencanaanModule {
};
exports.PerencanaanModule = PerencanaanModule;
exports.PerencanaanModule = PerencanaanModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        controllers: [perencanaan_controller_1.PerencanaanController],
        providers: [perencanaan_service_1.PerencanaanService],
        exports: [perencanaan_service_1.PerencanaanService],
    })
], PerencanaanModule);
//# sourceMappingURL=perencanaan.module.js.map