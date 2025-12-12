import { user_role } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: user_role;
}
