/**
 * API Route: PUT /api/auth/change-password
 * 
 * Endpoint untuk mengubah password user.
 */

import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { requireAuth, jsonResponse, errorResponse, handleCors } from '../../../lib/auth-middleware';

const prisma = new PrismaClient();

// Handle OPTIONS request for CORS
export const OPTIONS: APIRoute = async () => {
    return handleCors();
};

export const PUT: APIRoute = async ({ request }) => {
    try {
        // Check authentication
        const authResult = requireAuth(request);
        if (authResult instanceof Response) {
            return authResult;
        }

        const { user } = authResult;

        // Parse request body
        const body = await request.json();
        const { oldPassword, newPassword } = body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return errorResponse('Password lama dan baru diperlukan', 400);
        }

        if (newPassword.length < 6) {
            return errorResponse('Password baru minimal 6 karakter', 400);
        }

        // Get user with password
        const dbUser = await prisma.users.findUnique({
            where: { id: user.sub },
            select: { id: true, password: true },
        });

        if (!dbUser) {
            return errorResponse('User tidak ditemukan', 404);
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, dbUser.password);
        if (!isPasswordValid) {
            return errorResponse('Kata sandi lama tidak sesuai', 401);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.users.update({
            where: { id: user.sub },
            data: {
                password: hashedPassword,
                updated_at: new Date(),
            },
        });

        return jsonResponse({
            message: 'Kata sandi berhasil diubah',
        });

    } catch (error) {
        console.error('Change password error:', error);
        return errorResponse('Terjadi kesalahan server', 500);
    }
};
