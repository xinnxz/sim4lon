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
            name: string;
            created_at: Date;
            code: string;
            email: string;
            role: import("@prisma/client").$Enums.user_role;
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
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        code: string;
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        phone: string | null;
        avatar_url: string | null;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            code: string;
            email: string;
            role: import("@prisma/client").$Enums.user_role;
            phone: string | null;
            avatar_url: string | null;
        };
    }>;
}
