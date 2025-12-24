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
    findAll(req: any, status?: string): Promise<({
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
    create(req: any, dto: CreateAgenOrderDto): Promise<{
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
    receive(req: any, id: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancel(req: any, id: string): Promise<{
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
