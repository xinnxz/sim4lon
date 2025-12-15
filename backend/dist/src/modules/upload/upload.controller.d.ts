export declare class UploadController {
    uploadAvatar(file: any): {
        message: string;
        filename: any;
        url: string;
    };
    serveAvatar(filename: string, res: any): any;
}
