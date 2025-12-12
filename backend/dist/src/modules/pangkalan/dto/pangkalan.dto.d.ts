export declare class CreatePangkalanDto {
    name: string;
    address: string;
    region?: string;
    pic_name?: string;
    phone?: string;
    capacity?: number;
    note?: string;
}
export declare class UpdatePangkalanDto {
    name?: string;
    address?: string;
    region?: string;
    pic_name?: string;
    phone?: string;
    capacity?: number;
    note?: string;
    is_active?: boolean;
}
