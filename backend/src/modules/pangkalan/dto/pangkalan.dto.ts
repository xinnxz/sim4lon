import { IsBoolean, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePangkalanDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    pic_name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsInt()
    capacity?: number;

    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdatePangkalanDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    pic_name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsInt()
    capacity?: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
