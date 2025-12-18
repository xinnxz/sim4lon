import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: {
            name: string;
            id: string;
            code: string;
            email: string;
            phone: string | null;
            avatar_url: string | null;
            role: import("@prisma/client").$Enums.user_role;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        code: string;
        email: string;
        phone: string | null;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    create(dto: CreateUserDto): Promise<{
        name: string;
        id: string;
        code: string;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        created_at: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        updated_at: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    resetPassword(id: string): Promise<{
        message: string;
        newPassword: string;
    }>;
}
