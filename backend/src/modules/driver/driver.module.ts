import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
    controllers: [DriverController],
    providers: [DriverService],
    exports: [DriverService],
})
export class DriverModule { }
