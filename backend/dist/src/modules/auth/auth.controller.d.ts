import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdateProfileDto, ChangePasswordDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            code: string;
            email: string;
            role: import("@prisma/client").$Enums.user_role;
            name: string;
            created_at: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.user_role;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        code: string;
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        name: string;
        phone: string | null;
        avatar_url: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            code: string;
            email: string;
            role: import("@prisma/client").$Enums.user_role;
            is_active: boolean;
            name: string;
            phone: string | null;
            avatar_url: string | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
