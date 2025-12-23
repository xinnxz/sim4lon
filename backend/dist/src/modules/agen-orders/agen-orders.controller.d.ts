import { AgenOrdersService } from './agen-orders.service';
import { CreateAgenOrderDto, ReceiveAgenOrderDto } from './dto';
export declare class AgenOrdersController {
    private readonly ordersService;
    constructor(ordersService: AgenOrdersService);
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
        id: string;
        code: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        pangkalan_id: string;
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
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        pangkalan_id: string;
        agen_id: string | null;
    }>;
    completeOrder(id: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancelFromAgen(id: string): Promise<{
        id: string;
        code: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        pangkalan_id: string;
        agen_id: string | null;
    }>;
    findAll(req: any, status?: string): Promise<({
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        pangkalan_id: string;
        agen_id: string | null;
    })[]>;
    getStats(req: any): Promise<{
        pending: number;
        dikirim: number;
        diterima: number;
        batal: number;
        total: number;
    }>;
    findOne(req: any, id: string): Promise<{
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        pangkalan_id: string;
        agen_id: string | null;
    }>;
    create(req: any, dto: CreateAgenOrderDto): Promise<{
        agen: {
            name: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        code: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        pangkalan_id: string;
        agen_id: string | null;
    }>;
    receive(req: any, id: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancel(req: any, id: string): Promise<{
        id: string;
        code: string;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        order_date: Date;
        received_date: Date | null;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        pangkalan_id: string;
        agen_id: string | null;
    }>;
}
