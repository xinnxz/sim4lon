import { Module } from '@nestjs/common';
import { CompanyProfileController } from './company-profile.controller';
import { CompanyProfileService } from './company-profile.service';

@Module({
    controllers: [CompanyProfileController],
    providers: [CompanyProfileService],
    exports: [CompanyProfileService],
})
export class CompanyProfileModule { }
