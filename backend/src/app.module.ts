import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DriverModule } from './modules/driver/driver.module';
import { PangkalanModule } from './modules/pangkalan/pangkalan.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { StockModule } from './modules/stock/stock.module';
import { ActivityModule } from './modules/activity/activity.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LpgProductsModule } from './modules/lpg-products/lpg-products.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ConsumerModule } from './modules/consumer/consumer.module';
import { ConsumerOrderModule } from './modules/consumer-order/consumer-order.module';
import { PangkalanStockModule } from './modules/pangkalan-stock/pangkalan-stock.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { LpgPriceModule } from './modules/lpg-price/lpg-price.module';
import { AgenModule } from './modules/agen/agen.module';
// Pertamina Integration Modules
import { PerencanaanModule } from './modules/perencanaan/perencanaan.module';
import { PenyaluranModule } from './modules/penyaluran/penyaluran.module';
import { PenerimaanModule } from './modules/penerimaan/penerimaan.module';
import { CompanyProfileModule } from './modules/company-profile/company-profile.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        DriverModule,
        PangkalanModule,
        OrderModule,
        PaymentModule,
        StockModule,
        ActivityModule,
        DashboardModule,
        LpgProductsModule,
        UploadModule,
        NotificationModule,
        ReportsModule,
        // Pangkalan consumer management (SAAS multi-tenant)
        ConsumerModule,
        ConsumerOrderModule,
        PangkalanStockModule,
        ExpenseModule,
        LpgPriceModule,
        AgenModule,
        // Pertamina Integration
        PerencanaanModule,
        PenyaluranModule,
        PenerimaanModule,
        // Settings
        CompanyProfileModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

