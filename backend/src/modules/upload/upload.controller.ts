/**
 * Upload Controller - Handle file uploads with Supabase Storage
 * 
 * PENJELASAN:
 * Controller ini menangani upload file (gambar avatar, dll)
 * File disimpan ke Supabase Storage untuk persistent storage
 * 
 * Endpoints:
 * - POST /upload/avatar - Upload avatar (requires auth)
 */

import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards';
import { SupabaseStorageService } from './supabase-storage.service';
import { memoryStorage } from 'multer';

// Generate unique filename with timestamp
function generateFilename(originalname: string): string {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = extname(originalname);
    return `avatar-${timestamp}-${random}${ext}`;
}

// File filter to accept only images
const imageFileFilter = (req: any, file: any, callback: any) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
        callback(new BadRequestException('Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF, WebP)'), false);
    } else {
        callback(null, true);
    }
};

@Controller('upload')
export class UploadController {
    constructor(private readonly supabaseStorage: SupabaseStorageService) { }

    /**
     * Upload avatar image to Supabase Storage (requires authentication)
     * Returns the public URL to access the uploaded image
     */
    @Post('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(), // Store in memory, then upload to Supabase
            fileFilter: imageFileFilter,
            limits: {
                fileSize: 2 * 1024 * 1024, // Max 2MB
            },
        }),
    )
    async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File tidak ditemukan');
        }

        const filename = generateFilename(file.originalname);

        // Upload to Supabase Storage
        const publicUrl = await this.supabaseStorage.uploadFile(
            file.buffer,
            filename,
            file.mimetype,
        );

        console.log('Avatar uploaded to Supabase:', filename);

        return {
            message: 'Avatar berhasil diupload',
            filename: filename,
            url: publicUrl,
        };
    }
}
