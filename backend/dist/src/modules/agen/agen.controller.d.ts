import { PrismaService } from '../../prisma/prisma.service';
export declare class AgenController {
    private prisma;
    constructor(prisma: PrismaService);
    getMyAgen(user: any): Promise<{
        id: string;
        code: string;
        note: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        address: string | null;
        phone: string | null;
        email: string | null;
        pic_name: string | null;
        is_active: boolean;
        deleted_at: Date | null;
    } | null>;
}
