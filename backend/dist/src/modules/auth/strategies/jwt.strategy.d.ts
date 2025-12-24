import { Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    pangkalan_id?: string;
    session_id?: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        pangkalans: {
            is_active: boolean;
        } | null;
    } & {
        id: string;
        code: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        avatar_url: string | null;
        role: import("@prisma/client").$Enums.user_role;
        pangkalan_id: string | null;
        session_id: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
}
export {};
