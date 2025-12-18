export declare class CreatePangkalanDto {
    name: string;
    address: string;
    region?: string;
    pic_name?: string;
    phone?: string;
    email?: string;
    capacity?: number;
    note?: string;
    login_email?: string;
    login_password?: string;
}
export declare class UpdatePangkalanDto {
    name?: string;
    address?: string;
    region?: string;
    pic_name?: string;
    phone?: string;
    email?: string;
    capacity?: number;
    note?: string;
    is_active?: boolean;
}
