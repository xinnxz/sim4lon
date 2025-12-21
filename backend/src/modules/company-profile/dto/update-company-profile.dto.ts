import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class UpdateCompanyProfileDto {
    @IsString()
    @MaxLength(255)
    company_name: string;

    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    pic_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    sppbe_number?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    region?: string;

    @IsOptional()
    @IsString()
    logo_url?: string;
}
