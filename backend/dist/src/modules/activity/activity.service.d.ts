import { PrismaService } from '../../prisma';
import { CreateActivityLogDto } from './dto';
export declare class ActivityService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, type?: string, userId?: string): Promise<{
        data: ({
            users: {
                id: string;
                name: string;
            } | null;
            orders: {
                id: string;
                pangkalans: {
                    name: string;
                };
            } | null;
        } & {
            id: string;
            created_at: Date;
            order_id: string | null;
            user_id: string | null;
            type: string;
            title: string;
            description: string | null;
            pangkalan_name: string | null;
            detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
            icon_name: string | null;
            order_status: import("@prisma/client").$Enums.status_pesanan | null;
            timestamp: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: CreateActivityLogDto): Promise<{
        id: string;
        created_at: Date;
        order_id: string | null;
        user_id: string | null;
        type: string;
        title: string;
        description: string | null;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
    }>;
    getRecent(limit?: number): Promise<({
        users: {
            id: string;
            name: string;
        } | null;
        orders: {
            id: string;
            pangkalans: {
                name: string;
            };
        } | null;
    } & {
        id: string;
        created_at: Date;
        order_id: string | null;
        user_id: string | null;
        type: string;
        title: string;
        description: string | null;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
    })[]>;
    getByType(type: string, limit?: number): Promise<({
        users: {
            id: string;
            name: string;
        } | null;
        orders: {
            id: string;
            pangkalans: {
                name: string;
            };
        } | null;
    } & {
        id: string;
        created_at: Date;
        order_id: string | null;
        user_id: string | null;
        type: string;
        title: string;
        description: string | null;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
    })[]>;
    logActivity(type: string, title: string, options?: {
        userId?: string;
        orderId?: string;
        description?: string;
        pangkalanName?: string;
        detailNumeric?: number;
        iconName?: string;
        orderStatus?: any;
    }): Promise<{
        id: string;
        created_at: Date;
        order_id: string | null;
        user_id: string | null;
        type: string;
        title: string;
        description: string | null;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
    }>;
}
