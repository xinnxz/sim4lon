import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string, excludeRoles?: string[]): Promise<{
        data: {
            id: string;
            code: string;
            created_at: Date;
            updated_at: Date;
            name: string;
            phone: string | null;
            email: string;
            avatar_url: string | null;
            role: import("@prisma/client").$Enums.user_role;
            is_active: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            totalAdmin: number;
            totalOperator: number;
            totalPangkalan: number;
            totalAll: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        code: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        phone: string | null;
        email: string;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        code: string;
        created_at: Date;
        name: string;
        phone: string | null;
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        updated_at: Date;
        name: string;
        phone: string | null;
        email: string;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    resetPassword(id: string): Promise<{
        message: string;
        newPassword: string;
    }>;
}
