/**
 * Gemini AI Module
 * 
 * Module ini menyediakan integrasi dengan Google Gemini AI
 * untuk fitur Speech-to-Order parsing
 */
import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { PrismaModule } from '../../prisma';

@Module({
    imports: [PrismaModule],
    controllers: [GeminiController],
    providers: [GeminiService],
    exports: [GeminiService],
})
export class GeminiModule { }
