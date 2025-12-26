import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Injectable()
export class CompanyProfileService {
    private readonly logger = new Logger(CompanyProfileService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Generate unique 6-digit ID
     */
    private generate6DigitId(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Get company profile (singleton - first record or create default)
     */
    async getProfile() {
        // Try to get existing profile
        let profile = await this.prisma.company_profile.findFirst();

        // If no profile exists, create default with 6-digit ID
        if (!profile) {
            this.logger.log('No company profile found, creating default...');
            profile = await this.prisma.company_profile.create({
                data: {
                    id: this.generate6DigitId(),
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

    /**
     * Update company profile (upsert - create if not exists, update if exists)
     */
    async updateProfile(dto: UpdateCompanyProfileDto) {
        // Get existing profile
        const existing = await this.prisma.company_profile.findFirst();

        if (existing) {
            // Update existing
            return this.prisma.company_profile.update({
                where: { id: existing.id },
                data: {
                    ...dto,
                    updated_at: new Date(),
                },
            });
        } else {
            // Create new with generated 6-digit ID
            return this.prisma.company_profile.create({
                data: {
                    id: this.generate6DigitId(),
                    ...dto,
                },
            });
        }
    }
}
