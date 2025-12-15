/**
 * Supabase Storage Service
 * 
 * PENJELASAN:
 * Service ini menangani upload file ke Supabase Storage
 * untuk penyimpanan file yang persistent (tidak hilang saat redeploy)
 * 
 * Bucket yang digunakan:
 * - avatars: untuk foto profil user
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
    private supabase: SupabaseClient;
    private bucketName = 'avatars';

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            console.warn('⚠️ Supabase credentials not configured. File uploads will fail.');
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase Storage connected');
    }

    /**
     * Upload file ke Supabase Storage
     * @param file - File buffer dari multer
     * @param filename - Nama file unik
     * @param mimetype - MIME type file
     * @returns URL public file
     */
    async uploadFile(
        fileBuffer: Buffer,
        filename: string,
        mimetype: string,
    ): Promise<string> {
        if (!this.supabase) {
            throw new BadRequestException('Supabase not configured');
        }

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(filename, fileBuffer, {
                contentType: mimetype,
                upsert: true, // Overwrite if exists
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new BadRequestException(`Upload gagal: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filename);

        return urlData.publicUrl;
    }

    /**
     * Hapus file dari Supabase Storage
     * @param filename - Nama file yang akan dihapus
     */
    async deleteFile(filename: string): Promise<void> {
        if (!this.supabase) {
            return;
        }

        const { error } = await this.supabase.storage
            .from(this.bucketName)
            .remove([filename]);

        if (error) {
            console.error('Supabase delete error:', error);
        }
    }

    /**
     * Extract filename from Supabase URL
     */
    extractFilenameFromUrl(url: string): string | null {
        if (!url) return null;
        
        // URL format: https://xxx.supabase.co/storage/v1/object/public/avatars/filename.jpg
        const parts = url.split('/');
        return parts[parts.length - 1];
    }
}
