import { SupabaseStorageService } from './supabase-storage.service';
export declare class UploadController {
    private readonly supabaseStorage;
    constructor(supabaseStorage: SupabaseStorageService);
    uploadAvatar(file: Express.Multer.File): Promise<{
        message: string;
        filename: string;
        url: string;
    }>;
}
