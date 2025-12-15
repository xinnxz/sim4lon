"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseStorageService = class SupabaseStorageService {
    configService;
    supabase;
    bucketName = 'avatars';
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_SERVICE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            console.warn('⚠️ Supabase credentials not configured. File uploads will fail.');
            return;
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        console.log('✅ Supabase Storage connected');
    }
    async uploadFile(fileBuffer, filename, mimetype) {
        if (!this.supabase) {
            throw new common_1.BadRequestException('Supabase not configured');
        }
        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(filename, fileBuffer, {
            contentType: mimetype,
            upsert: true,
        });
        if (error) {
            console.error('Supabase upload error:', error);
            throw new common_1.BadRequestException(`Upload gagal: ${error.message}`);
        }
        const { data: urlData } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filename);
        return urlData.publicUrl;
    }
    async deleteFile(filename) {
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
    extractFilenameFromUrl(url) {
        if (!url)
            return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
    }
};
exports.SupabaseStorageService = SupabaseStorageService;
exports.SupabaseStorageService = SupabaseStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseStorageService);
//# sourceMappingURL=supabase-storage.service.js.map