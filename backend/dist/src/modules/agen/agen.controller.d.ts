import { PrismaService } from '../../prisma/prisma.service';
export declare class AgenController {
    private prisma;
    constructor(prisma: PrismaService);
    getMyAgen(user: any): Promise<{
        id: string;
        code: string;
        email: string | null;
        name: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        address: string | null;
        pic_name: string | null;
    } | null>;
}
