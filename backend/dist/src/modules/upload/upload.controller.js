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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const guards_1 = require("../auth/guards");
const supabase_storage_service_1 = require("./supabase-storage.service");
const multer_1 = require("multer");
function generateFilename(originalname) {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = (0, path_1.extname)(originalname);
    return `avatar-${timestamp}-${random}${ext}`;
}
const imageFileFilter = (req, file, callback) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
        callback(new common_1.BadRequestException('Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF, WebP)'), false);
    }
    else {
        callback(null, true);
    }
};
let UploadController = class UploadController {
    supabaseStorage;
    constructor(supabaseStorage) {
        this.supabaseStorage = supabaseStorage;
    }
    async uploadAvatar(file) {
        if (!file) {
            throw new common_1.BadRequestException('File tidak ditemukan');
        }
        const filename = generateFilename(file.originalname);
        const publicUrl = await this.supabaseStorage.uploadFile(file.buffer, filename, file.mimetype);
        console.log('Avatar uploaded to Supabase:', filename);
        return {
            message: 'Avatar berhasil diupload',
            filename: filename,
            url: publicUrl,
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: imageFileFilter,
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadAvatar", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [supabase_storage_service_1.SupabaseStorageService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map