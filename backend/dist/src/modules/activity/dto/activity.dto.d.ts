import { status_pesanan } from '@prisma/client';
export declare class CreateActivityLogDto {
    user_id?: string;
    order_id?: string;
    type: string;
    title: string;
    description?: string;
    pangkalan_name?: string;
    detail_numeric?: number;
    icon_name?: string;
    order_status?: status_pesanan;
}
