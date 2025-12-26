import { user_role } from '@prisma/client';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: user_role[]) => import("@nestjs/common").CustomDecorator<string>;
