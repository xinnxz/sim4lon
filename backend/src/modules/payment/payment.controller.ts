import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRecordDto, UpdateOrderPaymentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { payment_method } from '@prisma/client';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get('records')
    findAllRecords(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('order_id') orderId?: string,
        @Query('invoice_id') invoiceId?: string,
        @Query('method') method?: payment_method,
    ) {
        return this.paymentService.findAllRecords(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            orderId,
            invoiceId,
            method,
        );
    }

    @Get('records/:id')
    findOneRecord(@Param('id') id: string) {
        return this.paymentService.findOneRecord(id);
    }

    @Post('records')
    createRecord(
        @Body() dto: CreatePaymentRecordDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.paymentService.createRecord(dto, userId);
    }

    @Get('orders/:orderId')
    getOrderPayment(@Param('orderId') orderId: string) {
        return this.paymentService.getOrderPayment(orderId);
    }

    @Put('orders/:orderId')
    updateOrderPayment(
        @Param('orderId') orderId: string,
        @Body() dto: UpdateOrderPaymentDto,
    ) {
        return this.paymentService.updateOrderPayment(orderId, dto);
    }
}
