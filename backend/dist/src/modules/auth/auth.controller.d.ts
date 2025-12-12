import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
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
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        name: string;
        phone: string | null;
        avatar_url: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
}
