import { Module } from '@nestjs/common';
import { LpgPriceController } from './lpg-price.controller';
import { LpgPriceService } from './lpg-price.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [LpgPriceController],
    providers: [LpgPriceService],
    exports: [LpgPriceService],
})
export class LpgPriceModule { }
