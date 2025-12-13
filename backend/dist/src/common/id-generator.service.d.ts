import { PrismaService } from '../prisma';
interface IdConfig {
    prefix: string;
    padding: number;
}
declare const ID_CONFIGS: Record<string, IdConfig>;
export declare class IdGeneratorService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCode(entityType: keyof typeof ID_CONFIGS): Promise<string>;
    private getLastNumber;
}
export declare function generateSeedCode(prefix: string, index: number, padding?: number): string;
export {};
