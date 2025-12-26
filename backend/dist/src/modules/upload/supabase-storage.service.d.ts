import { ConfigService } from '@nestjs/config';
export declare class SupabaseStorageService {
    private configService;
    private supabase;
    private bucketName;
    constructor(configService: ConfigService);
    uploadFile(fileBuffer: Buffer, filename: string, mimetype: string): Promise<string>;
    deleteFile(filename: string): Promise<void>;
    extractFilenameFromUrl(url: string): string | null;
}
