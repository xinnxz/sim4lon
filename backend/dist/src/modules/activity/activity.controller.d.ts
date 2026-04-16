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
                pangkalans: {
                    name: string;
                };
                id: string;
            } | null;
        } & {
            id: string;
            created_at: Date;
            description: string | null;
            timestamp: Date;
            order_id: string | null;
            type: string;
            title: string;
            pangkalan_name: string | null;
            detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
            icon_name: string | null;
            order_status: import("@prisma/client").$Enums.status_pesanan | null;
            user_id: string | null;
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
            pangkalans: {
                name: string;
            };
            id: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        description: string | null;
        timestamp: Date;
        order_id: string | null;
        type: string;
        title: string;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        user_id: string | null;
    })[]>;
    getByType(type: string, limit?: string): Promise<({
        users: {
            id: string;
            name: string;
        } | null;
        orders: {
            pangkalans: {
                name: string;
            };
            id: string;
        } | null;
    } & {
        id: string;
        created_at: Date;
        description: string | null;
        timestamp: Date;
        order_id: string | null;
        type: string;
        title: string;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        user_id: string | null;
    })[]>;
    create(dto: CreateActivityLogDto): Promise<{
        id: string;
        created_at: Date;
        description: string | null;
        timestamp: Date;
        order_id: string | null;
        type: string;
        title: string;
        pangkalan_name: string | null;
        detail_numeric: import("@prisma/client/runtime/library").Decimal | null;
        icon_name: string | null;
        order_status: import("@prisma/client").$Enums.status_pesanan | null;
        user_id: string | null;
    }>;
    seedActivities(): Promise<{
        message: string;
        count: number;
    }>;
}
