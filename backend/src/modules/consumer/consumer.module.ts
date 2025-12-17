import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * ConsumerModule
 * 
 * Module untuk mengelola data konsumen/pelanggan pangkalan.
 * Konsumen adalah pelanggan akhir seperti warung, ibu-ibu, dll.
 */
@Module({
    imports: [PrismaModule],
    controllers: [ConsumerController],
    providers: [ConsumerService],
    exports: [ConsumerService],
})
export class ConsumerModule { }
