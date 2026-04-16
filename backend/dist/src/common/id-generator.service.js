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
exports.IdGeneratorService = void 0;
exports.generateSeedCode = generateSeedCode;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
const ID_CONFIGS = {
    pangkalan: { prefix: 'PKL', padding: 3 },
    driver: { prefix: 'DRV', padding: 3 },
    order: { prefix: 'ORD', padding: 4 },
    user: { prefix: 'USR', padding: 3 },
    invoice: { prefix: 'INV', padding: 4 },
    lpg_product: { prefix: 'LPG', padding: 3 },
};
let IdGeneratorService = class IdGeneratorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateCode(entityType) {
        const config = ID_CONFIGS[entityType];
        if (!config) {
            throw new Error(`Unknown entity type: ${entityType}`);
        }
        const lastNumber = await this.getLastNumber(entityType, config.prefix);
        const nextNumber = lastNumber + 1;
        return `${config.prefix}-${String(nextNumber).padStart(config.padding, '0')}`;
    }
    async getLastNumber(entityType, prefix) {
        let lastCode = null;
        switch (entityType) {
            case 'pangkalan':
                const lastPangkalan = await this.prisma.pangkalans.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastPangkalan?.code || null;
                break;
            case 'driver':
                const lastDriver = await this.prisma.drivers.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastDriver?.code || null;
                break;
            case 'order':
                const lastOrder = await this.prisma.orders.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastOrder?.code || null;
                break;
            case 'user':
                const lastUser = await this.prisma.users.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastUser?.code || null;
                break;
            default:
                return 0;
        }
        if (!lastCode)
            return 0;
        const parts = lastCode.split('-');
        if (parts.length < 2)
            return 0;
        return parseInt(parts[1], 10) || 0;
    }
};
exports.IdGeneratorService = IdGeneratorService;
exports.IdGeneratorService = IdGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], IdGeneratorService);
function generateSeedCode(prefix, index, padding = 3) {
    return `${prefix}-${String(index).padStart(padding, '0')}`;
}
//# sourceMappingURL=id-generator.service.js.map