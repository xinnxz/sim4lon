/**
 * Gemini AI Controller
 * 
 * Endpoints untuk AI-powered voice order parsing dengan validasi komprehensif
 */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { GeminiService } from './gemini.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

class ParseVoiceCommandDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}

@Controller('gemini')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GeminiController {
    constructor(private readonly geminiService: GeminiService) { }

    /**
     * Parse voice command text to order data with comprehensive validation
     * POST /api/gemini/parse-order
     * 
     * Validation includes:
     * - Quantity limits (max 500 per item)
     * - Stock availability check
     * - Pangkalan existence and active status
     * - Product existence and active status
     */
    @Post('parse-order')
    @Roles('ADMIN', 'OPERATOR')
    async parseVoiceCommand(@Body() dto: ParseVoiceCommandDto) {
        // Step 1: Parse voice command with AI
        const parsed = await this.geminiService.parseVoiceCommand(dto.text);

        // Step 2: Validate parsed data comprehensively
        const validated = await this.geminiService.validateParsedOrder(parsed);

        return validated;
    }
}
