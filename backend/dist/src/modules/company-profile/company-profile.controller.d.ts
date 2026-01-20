import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyProfileController {
    private readonly companyProfileService;
    constructor(companyProfileService: CompanyProfileService);
    getProfile(): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        company_name: string;
        address: string;
        phone: string | null;
        email: string | null;
        pic_name: string | null;
        sppbe_number: string | null;
        spbe_supplier_name: string | null;
        region: string | null;
        logo_url: string | null;
        ppn_rate: import("@prisma/client/runtime/library").Decimal;
        critical_stock_limit: number;
        invoice_prefix: string;
        order_code_prefix: string;
    }>;
    updateProfile(dto: UpdateCompanyProfileDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        company_name: string;
        address: string;
        phone: string | null;
        email: string | null;
        pic_name: string | null;
        sppbe_number: string | null;
        spbe_supplier_name: string | null;
        region: string | null;
        logo_url: string | null;
        ppn_rate: import("@prisma/client/runtime/library").Decimal;
        critical_stock_limit: number;
        invoice_prefix: string;
        order_code_prefix: string;
    }>;
}
