"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerModule = void 0;
const common_1 = require("@nestjs/common");
const consumer_controller_1 = require("./consumer.controller");
const consumer_service_1 = require("./consumer.service");
const prisma_module_1 = require("../../prisma/prisma.module");
let ConsumerModule = class ConsumerModule {
};
exports.ConsumerModule = ConsumerModule;
exports.ConsumerModule = ConsumerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [consumer_controller_1.ConsumerController],
        providers: [consumer_service_1.ConsumerService],
        exports: [consumer_service_1.ConsumerService],
    })
], ConsumerModule);
//# sourceMappingURL=consumer.module.js.map