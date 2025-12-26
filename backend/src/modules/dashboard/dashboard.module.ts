/**
 * Dashboard Module
 * 
 * PENJELASAN:
 * Module ini menyediakan endpoint untuk statistik dan data chart dashboard.
 * Semua data diambil dari database real, bukan dummy.
 */

import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
