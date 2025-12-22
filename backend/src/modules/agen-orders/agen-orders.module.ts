import { Module } from '@nestjs/common';
import { AgenOrdersController } from './agen-orders.controller';
import { AgenOrdersService } from './agen-orders.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AgenOrdersController],
    providers: [AgenOrdersService],
    exports: [AgenOrdersService],
})
export class AgenOrdersModule { }
