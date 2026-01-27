import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyProfileService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private generate6DigitId;
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
        payment_due_days: number;
        min_order_quantity: number;
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
        payment_due_days: number;
        min_order_quantity: number;
    }>;
}
