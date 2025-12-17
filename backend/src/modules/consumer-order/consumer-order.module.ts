import { Module } from '@nestjs/common';
import { ConsumerOrderController } from './consumer-order.controller';
import { ConsumerOrderService } from './consumer-order.service';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * ConsumerOrderModule
 * 
 * Module untuk mengelola penjualan LPG dari pangkalan ke konsumen.
 * Ini adalah fitur utama untuk Dashboard Pangkalan.
 */
@Module({
    imports: [PrismaModule],
    controllers: [ConsumerOrderController],
    providers: [ConsumerOrderService],
    exports: [ConsumerOrderService],
})
export class ConsumerOrderModule { }
