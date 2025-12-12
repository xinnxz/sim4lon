import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

/**
 * PrismaService - Database Connection Service
 * 
 * Prisma v7 menggunakan adapter pattern untuk koneksi database.
 * Ini berbeda dengan versi sebelumnya yang langsung extends PrismaClient.
 * 
 * Lifecycle:
 * - onModuleInit: Dipanggil saat module di-initialize, kita connect ke DB
 * - onModuleDestroy: Dipanggil saat app shutdown, kita disconnect
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    private _client: PrismaClient;

    constructor(private configService: ConfigService) {
        // Buat connection pool ke PostgreSQL
        this.pool = new Pool({
            connectionString: this.configService.get<string>('DATABASE_URL'),
        });

        // Buat adapter dari pool
        const adapter = new PrismaPg(this.pool);

        // Buat PrismaClient dengan adapter
        this._client = new PrismaClient({ adapter });
    }

    // Getter untuk akses PrismaClient
    get client(): PrismaClient {
        return this._client;
    }

    // Shortcut untuk akses langsung ke model (backward compatible)
    get users() { return this._client.users; }
    get drivers() { return this._client.drivers; }
    get pangkalans() { return this._client.pangkalans; }
    get orders() { return this._client.orders; }
    get order_items() { return this._client.order_items; }
    get order_payment_details() { return this._client.order_payment_details; }
    get timeline_tracks() { return this._client.timeline_tracks; }
    get invoices() { return this._client.invoices; }
    get payment_records() { return this._client.payment_records; }
    get stock_histories() { return this._client.stock_histories; }
    get activity_logs() { return this._client.activity_logs; }

    async onModuleInit() {
        await this._client.$connect();
        console.log('✅ Database connected');
    }

    async onModuleDestroy() {
        await this._client.$disconnect();
        await this.pool.end();
        console.log('🔌 Database disconnected');
    }
}
