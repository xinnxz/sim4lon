/**
 * ID Generator Service
 * 
 * PENJELASAN:
 * Service ini generate ID dengan format prefix seperti:
 * - PKL-001 untuk Pangkalan
 * - ORD-0001 untuk Order
 * - DRV-001 untuk Driver
 * - USR-001 untuk User
 * 
 * Menggunakan database sequence untuk memastikan ID unik dan terurut.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

// Konfigurasi format ID per entity
interface IdConfig {
    prefix: string;
    padding: number;  // Jumlah digit angka
}

const ID_CONFIGS: Record<string, IdConfig> = {
    pangkalan: { prefix: 'PKL', padding: 3 },   // PKL-001
    driver: { prefix: 'DRV', padding: 3 },      // DRV-001
    order: { prefix: 'ORD', padding: 4 },       // ORD-0001
    user: { prefix: 'USR', padding: 3 },        // USR-001
    invoice: { prefix: 'INV', padding: 4 },     // INV-0001
    lpg_product: { prefix: 'LPG', padding: 3 }, // LPG-001
};

@Injectable()
export class IdGeneratorService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generate next ID untuk entity tertentu
     * 
     * CARA KERJA:
     * 1. Cari record dengan prefix yang sama dan ambil yang terakhir
     * 2. Parse angka dari ID terakhir
     * 3. Increment dan format dengan padding
     * 
     * @param entityType - Tipe entity (pangkalan, driver, order, user, invoice, lpg_product)
     * @returns Promise<string> - ID baru seperti "PKL-001"
     */
    async generateCode(entityType: keyof typeof ID_CONFIGS): Promise<string> {
        const config = ID_CONFIGS[entityType];
        if (!config) {
            throw new Error(`Unknown entity type: ${entityType}`);
        }

        // Cari ID terakhir berdasarkan entity type
        const lastNumber = await this.getLastNumber(entityType, config.prefix);
        const nextNumber = lastNumber + 1;

        // Format: PREFIX-PADDED_NUMBER
        return `${config.prefix}-${String(nextNumber).padStart(config.padding, '0')}`;
    }

    /**
     * Mendapatkan angka terakhir dari ID yang ada di database
     */
    private async getLastNumber(entityType: string, prefix: string): Promise<number> {
        let lastCode: string | null = null;

        switch (entityType) {
            case 'pangkalan':
                const lastPangkalan = await this.prisma.pangkalans.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastPangkalan?.code || null;
                break;

            case 'driver':
                const lastDriver = await this.prisma.drivers.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastDriver?.code || null;
                break;

            case 'order':
                const lastOrder = await this.prisma.orders.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastOrder?.code || null;
                break;

            case 'user':
                const lastUser = await this.prisma.users.findFirst({
                    where: { code: { startsWith: prefix } },
                    orderBy: { code: 'desc' },
                    select: { code: true },
                });
                lastCode = lastUser?.code || null;
                break;

            default:
                return 0;
        }

        if (!lastCode) return 0;

        // Parse angka dari format "PREFIX-XXX"
        const parts = lastCode.split('-');
        if (parts.length < 2) return 0;

        return parseInt(parts[1], 10) || 0;
    }
}

/**
 * Helper function untuk generate code di seed script
 * Tidak perlu service, langsung return berdasarkan index
 */
export function generateSeedCode(prefix: string, index: number, padding: number = 3): string {
    return `${prefix}-${String(index).padStart(padding, '0')}`;
}
