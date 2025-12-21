import { Module } from '@nestjs/common';
import { PenerimaanController } from './penerimaan.controller';
import { PenerimaanService } from './penerimaan.service';
import { PrismaModule } from '../../prisma';
import { ActivityModule } from '../activity/activity.module';

@Module({
    imports: [PrismaModule, ActivityModule],
    controllers: [PenerimaanController],
    providers: [PenerimaanService],
    exports: [PenerimaanService],
})
export class PenerimaanModule { }
