import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDriverDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    vehicle_id?: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdateDriverDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    vehicle_id?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
