import { PrismaService } from '../../prisma/prisma.service';
import { CreateAgenOrderDto, ReceiveAgenOrderDto } from './dto';
export declare class AgenOrdersService {
    private prisma;
    constructor(prisma: PrismaService);
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
        created_at: Date;
        updated_at: Date;
        note: string | null;
        agen_id: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        order_date: Date;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        received_date: Date | null;
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
        created_at: Date;
        updated_at: Date;
        note: string | null;
        agen_id: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        order_date: Date;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        received_date: Date | null;
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
        created_at: Date;
        updated_at: Date;
        note: string | null;
        agen_id: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        order_date: Date;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        received_date: Date | null;
    }>;
    receive(id: string, pangkalanId: string, dto: ReceiveAgenOrderDto): Promise<unknown>;
    cancel(id: string, pangkalanId: string): Promise<{
        id: string;
        code: string;
        pangkalan_id: string;
        created_at: Date;
        updated_at: Date;
        note: string | null;
        agen_id: string | null;
        lpg_type: import("@prisma/client").$Enums.lpg_type;
        order_date: Date;
        qty_ordered: number;
        qty_received: number;
        status: import("@prisma/client").$Enums.agen_order_status;
        received_date: Date | null;
    }>;
    getStats(pangkalanId: string): Promise<{
        pending: number;
        dikirim: number;
        diterima: number;
        batal: number;
        total: number;
    }>;
}
