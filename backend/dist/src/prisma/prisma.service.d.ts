import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private pool;
    private _client;
    constructor(configService: ConfigService);
    get client(): PrismaClient;
    get users(): import("@prisma/client").Prisma.usersDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get drivers(): import("@prisma/client").Prisma.driversDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get pangkalans(): import("@prisma/client").Prisma.pangkalansDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get orders(): import("@prisma/client").Prisma.ordersDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get order_items(): import("@prisma/client").Prisma.order_itemsDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get order_payment_details(): import("@prisma/client").Prisma.order_payment_detailsDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get timeline_tracks(): import("@prisma/client").Prisma.timeline_tracksDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get invoices(): import("@prisma/client").Prisma.invoicesDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get payment_records(): import("@prisma/client").Prisma.payment_recordsDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get stock_histories(): import("@prisma/client").Prisma.stock_historiesDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get activity_logs(): import("@prisma/client").Prisma.activity_logsDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
