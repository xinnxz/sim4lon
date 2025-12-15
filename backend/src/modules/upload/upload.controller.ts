/**
 * Upload Controller - Handle file uploads
 * 
 * PENJELASAN:
 * Controller ini menangani upload file (gambar avatar, dll)
 * menggunakan Multer untuk multipart/form-data
 * 
 * - POST /upload/avatar - Upload avatar (requires auth)
 * - GET /upload/avatars/:filename - Serve avatar (public)
 */

import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
    Get,
    Param,
    Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/guards';
import { existsSync, mkdirSync } from 'fs';

// Use process.cwd() which always points to backend root folder
const uploadsDir = join(process.cwd(), 'uploads', 'avatars');

// Ensure uploads directory exists
if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
}

// Generate unique filename with timestamp
function generateFilename(originalname: string): string {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = extname(originalname);
    return `avatar-${timestamp}-${random}${ext}`;
}

// Configure storage for avatar uploads  
const avatarStorage = diskStorage({
    destination: uploadsDir,
    filename: (req, file, callback) => {
        const uniqueName = generateFilename(file.originalname);
        callback(null, uniqueName);
    },
});

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
    /**
     * Upload avatar image (requires authentication)
     * Returns the URL to access the uploaded image
     */
    @Post('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: avatarStorage,
            fileFilter: imageFileFilter,
            limits: {
                fileSize: 2 * 1024 * 1024, // Max 2MB
            },
        }),
    )
    uploadAvatar(@UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('File tidak ditemukan');
        }

        console.log('Avatar uploaded:', file.filename, 'to', uploadsDir);

        // Return the URL that can be used to access the file
        return {
            message: 'Avatar berhasil diupload',
            filename: file.filename,
            url: `/upload/avatars/${file.filename}`,
        };
    }

    /**
     * Serve uploaded avatar files (PUBLIC - no auth required)
     */
    @Get('avatars/:filename')
    serveAvatar(@Param('filename') filename: string, @Res() res: any) {
        // Sanitize filename to prevent directory traversal
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
        const filePath = join(uploadsDir, sanitizedFilename);

        if (!existsSync(filePath)) {
            return res.status(404).json({
                message: 'File tidak ditemukan',
                path: filePath,
                uploadsDir: uploadsDir
            });
        }

        return res.sendFile(filePath);
    }
}
