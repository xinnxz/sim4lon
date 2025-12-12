import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { user_role } from '@prisma/client';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEnum(user_role)
    role?: user_role;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsOptional()
    @IsEnum(user_role)
    role?: user_role;

    @IsOptional()
    is_active?: boolean;
}
