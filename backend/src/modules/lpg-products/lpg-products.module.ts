import { Module } from '@nestjs/common';
import { LpgProductsController } from './lpg-products.controller';
import { LpgProductsService } from './lpg-products.service';
import { PrismaModule } from '../../prisma';

@Module({
    imports: [PrismaModule],
    controllers: [LpgProductsController],
    providers: [LpgProductsService],
    exports: [LpgProductsService],
})
export class LpgProductsModule { }
