import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: {
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
    create(dto: CreateUserDto): Promise<{
        id: string;
        code: string;
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.user_role;
        is_active: boolean;
        created_at: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
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
