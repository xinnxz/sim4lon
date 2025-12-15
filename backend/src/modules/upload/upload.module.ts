import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { SupabaseStorageService } from './supabase-storage.service';

@Module({
    controllers: [UploadController],
    providers: [SupabaseStorageService],
    exports: [SupabaseStorageService],
})
export class UploadModule { }
