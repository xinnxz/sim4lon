import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RegisterPangkalanDto, UpdateProfileDto, ChangePasswordDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            code: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.user_role;
            created_at: Date;
        };
    }>;
    registerPangkalan(dto: RegisterPangkalanDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            pangkalan_id: any;
            pangkalan: {
                id: any;
                code: any;
                name: any;
            };
        };
        trial_expires_at: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.user_role;
            pangkalan_id: string | null;
            pangkalan: {
                id: string;
                code: string;
                name: string;
                is_active: boolean;
            } | null;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        code: string;
        email: string;
        name: string;
        phone: string | null;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        pangkalans: {
            id: string;
            code: string;
            name: string;
            phone: string | null;
            address: string;
            region: string | null;
            pic_name: string | null;
        } | null;
        pangkalan_id: string | null;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            code: string;
            email: string;
            name: string;
            phone: string | null;
            avatar_url: string | null;
            role: import("@prisma/client").$Enums.user_role;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            pangkalan_id: string | null;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
