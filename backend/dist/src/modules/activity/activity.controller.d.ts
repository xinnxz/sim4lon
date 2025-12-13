import { ActivityService } from './activity.service';
import { CreateActivityLogDto } from './dto';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    findAll(page?: string, limit?: string, type?: string, userId?: string): Promise<{
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
            description: string | null;
            created_at: Date;
            order_id: string | null;
            user_id: string | null;
            type: string;
            title: string;
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
    getRecent(limit?: string): Promise<({
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
        description: string | null;
        created_at: Date;
        order_id: string | null;
        user_id: string | null;
        type: string;
        title: string;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
    })[]>;
    getByType(type: string, limit?: string): Promise<({
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
        description: string | null;
        created_at: Date;
        order_id: string | null;
        user_id: string | null;
        type: string;
        title: string;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
    })[]>;
    create(dto: CreateActivityLogDto): Promise<{
        id: string;
        description: string | null;
        created_at: Date;
        order_id: string | null;
        user_id: string | null;
        type: string;
        title: string;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client-runtime-utils").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
    }>;
}
