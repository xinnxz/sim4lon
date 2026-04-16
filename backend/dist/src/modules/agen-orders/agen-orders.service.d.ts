import { PrismaService } from '../../prisma/prisma.service';
import { CreateAgenOrderDto, ReceiveAgenOrderDto } from './dto';
import { ActivityService } from '../activity/activity.service';
export declare class AgenOrdersService {
    private prisma;
    private activityService;
    constructor(prisma: PrismaService, activityService: ActivityService);
    private generateCode;
    create(pangkalanId: string, dto: CreateAgenOrderDto): Promise<{
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.agen_order_status;
        qty_ordered: number;
        qty_received: number;
        order_date: Date;
        received_date: Date | null;
        agen_id: string | null;
    }>;
    findAll(pangkalanId: string, status?: string): Promise<({
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.agen_order_status;
        qty_ordered: number;
        qty_received: number;
        order_date: Date;
        received_date: Date | null;
        agen_id: string | null;
    })[]>;
    findOne(id: string, pangkalanId: string): Promise<{
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.agen_order_status;
        qty_ordered: number;
        qty_received: number;
        order_date: Date;
        received_date: Date | null;
        agen_id: string | null;
    }>;
    receive(id: string, pangkalanId: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancel(id: string, pangkalanId: string): Promise<{
        id: string;
        code: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.agen_order_status;
        qty_ordered: number;
        qty_received: number;
        order_date: Date;
        received_date: Date | null;
        agen_id: string | null;
    }>;
    getStats(pangkalanId: string): Promise<{
        pending: number;
        dikirim: number;
        diterima: number;
        batal: number;
        total: number;
    }>;
    findAllForAgen(status?: string): Promise<({
        agen: {
            name: string;
        } | null;
        pangkalans: {
            code: string;
            name: string;
            phone: string | null;
        };
    } & {
        id: string;
        code: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.agen_order_status;
        qty_ordered: number;
        qty_received: number;
        order_date: Date;
        received_date: Date | null;
        agen_id: string | null;
    })[]>;
    getStatsForAgen(): Promise<{
        pending: number;
        dikirim: number;
        diterima: number;
        batal: number;
        total: number;
    }>;
    confirmOrder(id: string): Promise<{
        id: string;
        code: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.agen_order_status;
        qty_ordered: number;
        qty_received: number;
        order_date: Date;
        received_date: Date | null;
        agen_id: string | null;
    }>;
    completeOrder(id: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancelFromAgen(id: string): Promise<{
        id: string;
        code: string;
        pangkalan_id: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.agen_order_status;
        qty_ordered: number;
        qty_received: number;
        order_date: Date;
        received_date: Date | null;
        agen_id: string | null;
    }>;
}
