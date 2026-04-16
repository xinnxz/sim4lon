import { Module } from '@nestjs/common';
import { AgenController } from './agen.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AgenController],
})
export class AgenModule { }
