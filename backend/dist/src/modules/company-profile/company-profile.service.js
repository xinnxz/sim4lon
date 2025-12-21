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
var CompanyProfileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CompanyProfileService = CompanyProfileService_1 = class CompanyProfileService {
    prisma;
    logger = new common_1.Logger(CompanyProfileService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile() {
        let profile = await this.prisma.company_profile.findFirst();
        if (!profile) {
            this.logger.log('No company profile found, creating default...');
            profile = await this.prisma.company_profile.create({
                data: {
                    company_name: 'PT. MITRA SURYA NATASYA',
                    address: 'CHOBA RT.002 RW.006 DESA MAYAK',
                    phone: '',
                    email: 'mitrasuryaanatasya@gmail.com',
                    pic_name: '',
                    sppbe_number: '997904',
                    region: 'JAWA BARAT, KABUPATEN CIANJUR',
                    logo_url: null,
                },
            });
        }
        return profile;
    }
    async updateProfile(dto) {
        const existing = await this.prisma.company_profile.findFirst();
        if (existing) {
            return this.prisma.company_profile.update({
                where: { id: existing.id },
                data: {
                    ...dto,
                    updated_at: new Date(),
                },
            });
        }
        else {
            return this.prisma.company_profile.create({
                data: dto,
            });
        }
    }
};
exports.CompanyProfileService = CompanyProfileService;
exports.CompanyProfileService = CompanyProfileService = CompanyProfileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyProfileService);
//# sourceMappingURL=company-profile.service.js.map