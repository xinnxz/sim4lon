import { ActivityService } from './activity.service';
import { CreateActivityLogDto } from './dto';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    findAll(page?: string, limit?: string, type?: string, userId?: string): Promise<{
        data: ({
            orders: {
                id: string;
                pangkalans: {
                    name: string;
                };
            } | null;
            users: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            user_id: string | null;
            order_id: string | null;
            type: string;
            title: string;
            description: string | null;
            pangkalan_name: string | null;
            detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
            icon_name: string | null;
            order_status: import("@prisma/client").$Enums.status_pesanan | null;
            timestamp: Date;
            created_at: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getRecent(limit?: string): Promise<({
        orders: {
            id: string;
            pangkalans: {
                name: string;
            };
        } | null;
        users: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        user_id: string | null;
        order_id: string | null;
        type: string;
        title: string;
        description: string | null;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
        created_at: Date;
    })[]>;
    getByType(type: string, limit?: string): Promise<({
        orders: {
            id: string;
            pangkalans: {
                name: string;
            };
        } | null;
        users: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        user_id: string | null;
        order_id: string | null;
        type: string;
        title: string;
        description: string | null;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
        created_at: Date;
    })[]>;
    create(dto: CreateActivityLogDto): Promise<{
        id: string;
        user_id: string | null;
        order_id: string | null;
        type: string;
        title: string;
        description: string | null;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        timestamp: Date;
        created_at: Date;
    }>;
    seedActivities(): Promise<{
        message: string;
        count: number;
    }>;
}
