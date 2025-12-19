import { Module } from '@nestjs/common';
import { PenerimaanController } from './penerimaan.controller';
import { PenerimaanService } from './penerimaan.service';
import { PrismaModule } from '../../prisma';

@Module({
    imports: [PrismaModule],
    controllers: [PenerimaanController],
    providers: [PenerimaanService],
    exports: [PenerimaanService],
})
export class PenerimaanModule { }
