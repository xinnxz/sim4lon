import { Module } from '@nestjs/common';
import { PerencanaanController } from './perencanaan.controller';
import { PerencanaanService } from './perencanaan.service';
import { PrismaModule } from '../../prisma';

@Module({
    imports: [PrismaModule],
    controllers: [PerencanaanController],
    providers: [PerencanaanService],
    exports: [PerencanaanService],
})
export class PerencanaanModule { }
