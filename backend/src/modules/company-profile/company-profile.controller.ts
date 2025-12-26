import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Controller('company-profile')
export class CompanyProfileController {
    constructor(private readonly companyProfileService: CompanyProfileService) { }

    @Get()
    async getProfile() {
        return this.companyProfileService.getProfile();
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Body() dto: UpdateCompanyProfileDto) {
        return this.companyProfileService.updateProfile(dto);
    }
}
