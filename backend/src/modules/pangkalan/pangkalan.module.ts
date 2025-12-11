import { Module } from '@nestjs/common';
import { PangkalanController } from './pangkalan.controller';
import { PangkalanService } from './pangkalan.service';

@Module({
    controllers: [PangkalanController],
    providers: [PangkalanService],
    exports: [PangkalanService],
})
export class PangkalanModule { }
