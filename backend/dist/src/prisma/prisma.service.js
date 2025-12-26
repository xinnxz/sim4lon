"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const config_1 = require("@nestjs/config");
let PrismaService = class PrismaService {
    configService;
    pool;
    _client;
    constructor(configService) {
        this.configService = configService;
        this.pool = new pg_1.Pool({
            connectionString: this.configService.get('DATABASE_URL'),
        });
        const adapter = new adapter_pg_1.PrismaPg(this.pool);
        this._client = new client_1.PrismaClient({ adapter });
    }
    get client() {
        return this._client;
    }
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
    get lpg_products() { return this._client.lpg_products; }
    get consumers() { return this._client.consumers; }
    get consumer_orders() { return this._client.consumer_orders; }
    get expenses() { return this._client.expenses; }
    get pangkalan_stocks() { return this._client.pangkalan_stocks; }
    get pangkalan_stock_movements() { return this._client.pangkalan_stock_movements; }
    get lpg_prices() { return this._client.lpg_prices; }
    get perencanaan_harian() { return this._client.perencanaan_harian; }
    get penyaluran_harian() { return this._client.penyaluran_harian; }
    get penerimaan_stok() { return this._client.penerimaan_stok; }
    get company_profile() { return this._client.company_profile; }
    get agen() { return this._client.agen; }
    get agen_orders() { return this._client.agen_orders; }
    $transaction(fn) {
        return this._client.$transaction(fn);
    }
    async onModuleInit() {
        await this._client.$connect();
        console.log('✅ Database connected');
    }
    async onModuleDestroy() {
        await this._client.$disconnect();
        await this.pool.end();
        console.log('🔌 Database disconnected');
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map