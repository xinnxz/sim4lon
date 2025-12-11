import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole, PaymentMethod } from '@prisma/client';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get(':orderId')
    async getPaymentDetail(@Param('orderId') orderId: string) {
        const data = await this.paymentService.getPaymentDetail(orderId);
        return { success: true, data };
    }

    @Post(':orderId')
    async recordPayment(
        @Param('orderId') orderId: string,
        @Body() body: {
            paymentMethod: PaymentMethod;
            amountPaid: number;
            paymentDate?: string;
            isDp?: boolean;
            note?: string;
        },
    ) {
        const data = await this.paymentService.recordPayment(orderId, body);
        return { success: true, data };
    }

    @Post(':orderId/upload-proof')
    async uploadProof(@Param('orderId') orderId: string, @Body() body: { proofUrl: string }) {
        // Note: In production, implement file upload to R2/S3
        const data = await this.paymentService.uploadProof(orderId, body.proofUrl);
        return { success: true, data };
    }
}
