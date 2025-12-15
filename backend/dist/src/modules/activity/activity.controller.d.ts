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
            created_at: Date;
            pangkalan_name: string | null;
            type: string;
            title: string;
            description: string | null;
            detail_numeric: import("@prisma/client/runtime/client").Decimal | null;
            icon_name: string | null;
            order_status: import("@prisma/client").$Enums.status_pesanan | null;
            timestamp: Date;
            user_id: string | null;
            order_id: string | null;
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
        created_at: Date;
        pangkalan_name: string | null;
        type: string;
        title: string;
        description: string | null;
        detail_numeric: import("@prisma/client/runtime/client").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
        user_id: string | null;
        order_id: string | null;
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
        created_at: Date;
        pangkalan_name: string | null;
        type: string;
        title: string;
        description: string | null;
        detail_numeric: import("@prisma/client/runtime/client").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
        user_id: string | null;
        order_id: string | null;
    })[]>;
    create(dto: CreateActivityLogDto): Promise<{
        id: string;
        created_at: Date;
        pangkalan_name: string | null;
        type: string;
        title: string;
        description: string | null;
        detail_numeric: import("@prisma/client/runtime/client").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
        user_id: string | null;
        order_id: string | null;
    }>;
    seedActivities(): Promise<{
        message: string;
        count: number;
    }>;
}
