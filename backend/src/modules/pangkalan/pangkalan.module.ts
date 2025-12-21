import { Module } from '@nestjs/common';
import { PangkalanController } from './pangkalan.controller';
import { PangkalanService } from './pangkalan.service';
import { PrismaModule } from '../../prisma';
import { ActivityModule } from '../activity/activity.module';

@Module({
    imports: [PrismaModule, ActivityModule],
    controllers: [PangkalanController],
    providers: [PangkalanService],
    exports: [PangkalanService],
})
export class PangkalanModule { }
