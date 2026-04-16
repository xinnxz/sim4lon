/**
 * @TenantId() — Parameter Decorator
 * 
 * Extract tenantId (pangkalan_id) dari request object
 * yang sudah di-inject oleh TenantGuard.
 * 
 * Usage:
 * @Get()
 * getStocks(@TenantId() tenantId: string) { ... }
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string | null => {
        const request = ctx.switchToHttp().getRequest();
        return request.tenantId || null;
    },
);
