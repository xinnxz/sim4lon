export type ConsumerType = 'RUMAH_TANGGA' | 'WARUNG';
export declare class CreateConsumerDto {
    name: string;
    nik?: string;
    kk?: string;
    consumer_type?: ConsumerType;
    phone?: string;
    address?: string;
    note?: string;
}
export declare class UpdateConsumerDto {
    name?: string;
    nik?: string;
    kk?: string;
    consumer_type?: ConsumerType;
    phone?: string;
    address?: string;
    note?: string;
    is_active?: boolean;
}
