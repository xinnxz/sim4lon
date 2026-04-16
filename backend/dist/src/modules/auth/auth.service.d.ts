import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma';
import { LoginDto, RegisterDto, RegisterPangkalanDto, UpdateProfileDto } from './dto';
import { ActivityService } from '../activity/activity.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private activityService;
    constructor(prisma: PrismaService, jwtService: JwtService, activityService: ActivityService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            code: string;
            created_at: Date;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.user_role;
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
        pangkalans: {
            id: string;
            code: string;
            name: string;
            address: string;
            phone: string | null;
            pic_name: string | null;
            region: string | null;
        } | null;
        id: string;
        code: string;
        pangkalan_id: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        phone: string | null;
        email: string;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            code: string;
            pangkalan_id: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            phone: string | null;
            email: string;
            avatar_url: string | null;
            role: import("@prisma/client").$Enums.user_role;
            is_active: boolean;
        };
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
