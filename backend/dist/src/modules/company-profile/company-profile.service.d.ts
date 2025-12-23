import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyProfileService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private generate6DigitId;
    getProfile(): Promise<{
        id: string;
        company_name: string;
        address: string;
        phone: string | null;
        email: string | null;
        pic_name: string | null;
        sppbe_number: string | null;
        region: string | null;
        logo_url: string | null;
        ppn_rate: import("@prisma/client/runtime/library").Decimal;
        critical_stock_limit: number;
        invoice_prefix: string;
        order_code_prefix: string;
        created_at: Date;
        updated_at: Date;
    }>;
    updateProfile(dto: UpdateCompanyProfileDto): Promise<{
        id: string;
        company_name: string;
        address: string;
        phone: string | null;
        email: string | null;
        pic_name: string | null;
        sppbe_number: string | null;
        region: string | null;
        logo_url: string | null;
        ppn_rate: import("@prisma/client/runtime/library").Decimal;
        critical_stock_limit: number;
        invoice_prefix: string;
        order_code_prefix: string;
        created_at: Date;
        updated_at: Date;
    }>;
}
