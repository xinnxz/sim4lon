import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyProfileController {
    private readonly companyProfileService;
    constructor(companyProfileService: CompanyProfileService);
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
        ppn_rate: import("@prisma/client/runtime/library").Decimal;
        critical_stock_limit: number;
        invoice_prefix: string;
        order_code_prefix: string;
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
        ppn_rate: import("@prisma/client/runtime/library").Decimal;
        critical_stock_limit: number;
        invoice_prefix: string;
        order_code_prefix: string;
    }>;
}
