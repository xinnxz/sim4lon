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
const multer_1 = require("multer");
const path_1 = require("path");
const guards_1 = require("../auth/guards");
const fs_1 = require("fs");
const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads', 'avatars');
if (!(0, fs_1.existsSync)(uploadsDir)) {
    (0, fs_1.mkdirSync)(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
}
function generateFilename(originalname) {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = (0, path_1.extname)(originalname);
    return `avatar-${timestamp}-${random}${ext}`;
}
const avatarStorage = (0, multer_1.diskStorage)({
    destination: uploadsDir,
    filename: (req, file, callback) => {
        const uniqueName = generateFilename(file.originalname);
        callback(null, uniqueName);
    },
});
const imageFileFilter = (req, file, callback) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
        callback(new common_1.BadRequestException('Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF, WebP)'), false);
    }
    else {
        callback(null, true);
    }
};
let UploadController = class UploadController {
    uploadAvatar(file) {
        if (!file) {
            throw new common_1.BadRequestException('File tidak ditemukan');
        }
        console.log('Avatar uploaded:', file.filename, 'to', uploadsDir);
        return {
            message: 'Avatar berhasil diupload',
            filename: file.filename,
            url: `/upload/avatars/${file.filename}`,
        };
    }
    serveAvatar(filename, res) {
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
        const filePath = (0, path_1.join)(uploadsDir, sanitizedFilename);
        console.log('Serving avatar from:', filePath, 'exists:', (0, fs_1.existsSync)(filePath));
        if (!(0, fs_1.existsSync)(filePath)) {
            return res.status(404).json({
                message: 'File tidak ditemukan',
                path: filePath,
                uploadsDir: uploadsDir
            });
        }
        return res.sendFile(filePath);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: avatarStorage,
        fileFilter: imageFileFilter,
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)('avatars/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "serveAvatar", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map