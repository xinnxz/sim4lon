/**
 * TenantGuard — Multi-Tenancy Data Isolation Guard
 * 
 * Middleware yang auto-extract `pangkalan_id` dari JWT user
 * dan inject ke request sebagai `tenantId`.
 * 
 * Semua endpoint pangkalan WAJIB melewati guard ini
 * untuk memastikan data isolation per pangkalan.
 * 
 * Usage di controller:
 * @UseGuards(JwtAuthGuard, TenantGuard)
 * @Get()
 * getStocks(@TenantId() tenantId: string) {
 *   return this.service.getStocks(tenantId)
 * }
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User tidak terautentikasi');
        }

        // ADMIN role — skip tenant check, can access all data
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            // Admin tidak perlu tenantId, bisa akses semua
            request.tenantId = null;
            return true;
        }

        // PANGKALAN role — WAJIB punya pangkalan_id
        if (!user.pangkalan_id) {
            throw new ForbiddenException('User belum terhubung ke pangkalan manapun');
        }

        // Inject tenantId ke request untuk dipakai di controller/service
        request.tenantId = user.pangkalan_id;
        return true;
    }
}
