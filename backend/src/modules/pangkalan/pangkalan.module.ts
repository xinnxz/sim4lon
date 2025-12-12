import { Module } from '@nestjs/common';
import { PangkalanController } from './pangkalan.controller';
import { PangkalanService } from './pangkalan.service';
import { PrismaModule } from '../../prisma';

@Module({
    imports: [PrismaModule],
    controllers: [PangkalanController],
    providers: [PangkalanService],
    exports: [PangkalanService],
})
export class PangkalanModule { }
