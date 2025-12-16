import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma';
import { LoginDto, RegisterDto, UpdateProfileDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
        name: string;
        phone: string | null;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
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
        };
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
