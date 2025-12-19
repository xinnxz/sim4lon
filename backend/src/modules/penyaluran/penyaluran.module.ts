import { Module } from '@nestjs/common';
import { PenyaluranController } from './penyaluran.controller';
import { PenyaluranService } from './penyaluran.service';
import { PrismaModule } from '../../prisma';

@Module({
    imports: [PrismaModule],
    controllers: [PenyaluranController],
    providers: [PenyaluranService],
    exports: [PenyaluranService],
})
export class PenyaluranModule { }
