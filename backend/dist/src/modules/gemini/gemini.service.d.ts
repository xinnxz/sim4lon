import { PrismaService } from '../../prisma';
export type ValidationIssueType = 'quantity_too_high' | 'quantity_too_low' | 'stock_insufficient' | 'pangkalan_not_found' | 'pangkalan_mismatch' | 'product_not_found' | 'pangkalan_inactive';
export interface ValidationIssue {
    type: ValidationIssueType;
    field: string;
    message: string;
    suggestion?: string;
}
export interface ParsedOrderData {
    success: boolean;
    pangkalanId: string | null;
    pangkalanName: string | null;
    items: Array<{
        productId: string;
        productName: string;
        lpgType: string;
        quantity: number;
        price: number;
        stockAvailable?: number;
    }>;
    note: string | null;
    confidence: number;
    rawText: string;
    error?: string;
    validation?: {
        isValid: boolean;
        issues: ValidationIssue[];
        warnings: string[];
    };
}
export declare class GeminiService {
    private prisma;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(prisma: PrismaService);
    parseVoiceCommand(text: string): Promise<ParsedOrderData>;
    private fallbackParse;
    validateParsedOrder(parsedData: ParsedOrderData): Promise<ParsedOrderData>;
}
