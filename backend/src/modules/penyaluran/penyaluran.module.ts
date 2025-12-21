import { Module } from '@nestjs/common';
import { PenyaluranController } from './penyaluran.controller';
import { PenyaluranService } from './penyaluran.service';
import { PrismaModule } from '../../prisma';
import { ActivityModule } from '../activity/activity.module';

@Module({
    imports: [PrismaModule, ActivityModule],
    controllers: [PenyaluranController],
    providers: [PenyaluranService],
    exports: [PenyaluranService],
})
export class PenyaluranModule { }
