import { GeminiService } from './gemini.service';
declare class ParseVoiceCommandDto {
    text: string;
}
export declare class GeminiController {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    parseVoiceCommand(dto: ParseVoiceCommandDto): Promise<import("./gemini.service").ParsedOrderData>;
}
export {};
