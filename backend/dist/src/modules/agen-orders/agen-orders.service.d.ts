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
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        qty_received: number;
        id: string;
        code: string;
        pangkalan_id: string;
        agen_id: string | null;
        qty_ordered: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        created_at: Date;
        updated_at: Date;
    }>;
    findAll(pangkalanId: string, status?: string): Promise<({
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        qty_received: number;
        id: string;
        code: string;
        pangkalan_id: string;
        agen_id: string | null;
        qty_ordered: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        created_at: Date;
        updated_at: Date;
    })[]>;
    findOne(id: string, pangkalanId: string): Promise<{
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        qty_received: number;
        id: string;
        code: string;
        pangkalan_id: string;
        agen_id: string | null;
        qty_ordered: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        created_at: Date;
        updated_at: Date;
    }>;
    receive(id: string, pangkalanId: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancel(id: string, pangkalanId: string): Promise<{
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        qty_received: number;
        id: string;
        code: string;
        pangkalan_id: string;
        agen_id: string | null;
        qty_ordered: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        created_at: Date;
        updated_at: Date;
    }>;
    getStats(pangkalanId: string): Promise<{
        pending: number;
        dikirim: number;
        diterima: number;
        batal: number;
        total: number;
    }>;
    findAllForAgen(status?: string): Promise<({
        pangkalans: {
            code: string;
            name: string;
            phone: string | null;
        };
        agen: {
            name: string;
        } | null;
    } & {
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        qty_received: number;
        id: string;
        code: string;
        pangkalan_id: string;
        agen_id: string | null;
        qty_ordered: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        created_at: Date;
        updated_at: Date;
    })[]>;
    getStatsForAgen(): Promise<{
        pending: number;
        dikirim: number;
        diterima: number;
        batal: number;
        total: number;
    }>;
    confirmOrder(id: string): Promise<{
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        qty_received: number;
        id: string;
        code: string;
        pangkalan_id: string;
        agen_id: string | null;
        qty_ordered: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        created_at: Date;
        updated_at: Date;
    }>;
    completeOrder(id: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancelFromAgen(id: string): Promise<{
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        note: string | null;
        qty_received: number;
        id: string;
        code: string;
        pangkalan_id: string;
        agen_id: string | null;
        qty_ordered: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        created_at: Date;
        updated_at: Date;
    }>;
}
