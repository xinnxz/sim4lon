import { user_role } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: user_role;
}
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    avatar_url?: string;
    role?: user_role;
    is_active?: boolean;
}
