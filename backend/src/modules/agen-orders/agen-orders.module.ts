import { Module } from '@nestjs/common';
import { AgenOrdersController } from './agen-orders.controller';
import { AgenOrdersService } from './agen-orders.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
    imports: [PrismaModule, ActivityModule],
    controllers: [AgenOrdersController],
    providers: [AgenOrdersService],
    exports: [AgenOrdersService],
})
export class AgenOrdersModule { }
