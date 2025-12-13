import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: {
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
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    create(dto: CreateUserDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        code: string;
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        phone: string | null;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        updated_at: Date;
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        phone: string | null;
        avatar_url: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    resetPassword(id: string): Promise<{
        message: string;
        newPassword: string;
    }>;
}
