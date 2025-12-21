import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyProfileService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getProfile(): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        address: string;
        region: string | null;
        pic_name: string | null;
        company_name: string;
        sppbe_number: string | null;
        logo_url: string | null;
    }>;
    updateProfile(dto: UpdateCompanyProfileDto): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        address: string;
        region: string | null;
        pic_name: string | null;
        company_name: string;
        sppbe_number: string | null;
        logo_url: string | null;
    }>;
}
