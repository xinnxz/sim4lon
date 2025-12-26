import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('agen')
@UseGuards(JwtAuthGuard)
export class AgenController {
    constructor(private prisma: PrismaService) { }

    /**
     * Get agen for current pangkalan
     * Used for WhatsApp order feature
     */
    @Get('my-agen')
    async getMyAgen(@CurrentUser() user: any) {
        if (!user.pangkalan_id) {
            return null;
        }

        const pangkalan = await this.prisma.pangkalans.findUnique({
            where: { id: user.pangkalan_id },
            include: { agen: true },
        });

        return pangkalan?.agen || null;
    }
}
