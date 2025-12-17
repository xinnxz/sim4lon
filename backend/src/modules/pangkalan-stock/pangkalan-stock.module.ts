import { Module } from '@nestjs/common';
import { PangkalanStockController } from './pangkalan-stock.controller';
import { PangkalanStockService } from './pangkalan-stock.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PangkalanStockController],
    providers: [PangkalanStockService],
    exports: [PangkalanStockService], // Export for use in ConsumerOrderModule
})
export class PangkalanStockModule { }
