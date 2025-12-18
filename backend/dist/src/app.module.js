"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const driver_module_1 = require("./modules/driver/driver.module");
const pangkalan_module_1 = require("./modules/pangkalan/pangkalan.module");
const order_module_1 = require("./modules/order/order.module");
const payment_module_1 = require("./modules/payment/payment.module");
const stock_module_1 = require("./modules/stock/stock.module");
const activity_module_1 = require("./modules/activity/activity.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const lpg_products_module_1 = require("./modules/lpg-products/lpg-products.module");
const upload_module_1 = require("./modules/upload/upload.module");
const notification_module_1 = require("./modules/notification/notification.module");
const reports_module_1 = require("./modules/reports/reports.module");
const consumer_module_1 = require("./modules/consumer/consumer.module");
const consumer_order_module_1 = require("./modules/consumer-order/consumer-order.module");
const pangkalan_stock_module_1 = require("./modules/pangkalan-stock/pangkalan-stock.module");
const expense_module_1 = require("./modules/expense/expense.module");
const lpg_price_module_1 = require("./modules/lpg-price/lpg-price.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            driver_module_1.DriverModule,
            pangkalan_module_1.PangkalanModule,
            order_module_1.OrderModule,
            payment_module_1.PaymentModule,
            stock_module_1.StockModule,
            activity_module_1.ActivityModule,
            dashboard_module_1.DashboardModule,
            lpg_products_module_1.LpgProductsModule,
            upload_module_1.UploadModule,
            notification_module_1.NotificationModule,
            reports_module_1.ReportsModule,
            consumer_module_1.ConsumerModule,
            consumer_order_module_1.ConsumerOrderModule,
            pangkalan_stock_module_1.PangkalanStockModule,
            expense_module_1.ExpenseModule,
            lpg_price_module_1.LpgPriceModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map