/**
 * API Route: /api/auth/profile
 * 
 * GET  - Get current user profile
 * PUT  - Update current user profile
 */

import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { requireAuth, jsonResponse, errorResponse, handleCors, type JwtPayload } from '../../../lib/auth-middleware';

const prisma = new PrismaClient();

// Handle OPTIONS request for CORS
export const OPTIONS: APIRoute = async () => {
    return handleCors();
};

// GET /api/auth/profile
export const GET: APIRoute = async ({ request }) => {
    try {
        // Check authentication
        const authResult = requireAuth(request);
        if (authResult instanceof Response) {
            return authResult;
        }

        const { user } = authResult;

        // Get user profile
        const profile = await prisma.users.findUnique({
            where: { id: user.sub },
            select: {
                id: true,
                code: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                avatar_url: true,
                is_active: true,
                pangkalan_id: true,
                created_at: true,
                updated_at: true,
                pangkalans: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        address: true,
                        phone: true,
                    },
                },
            },
        });

        if (!profile) {
            return errorResponse('User tidak ditemukan', 404);
        }

        return jsonResponse(profile);

    } catch (error) {
        console.error('Get profile error:', error);
        return errorResponse('Terjadi kesalahan server', 500);
    }
};

// PUT /api/auth/profile
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
        const { name, phone, avatar_url } = body;

        // Get existing user to check role and pangkalan_id
        const existingUser = await prisma.users.findUnique({
            where: { id: user.sub },
            select: { role: true, pangkalan_id: true },
        });

        // Update user profile
        const updatedUser = await prisma.users.update({
            where: { id: user.sub },
            data: {
                name: name || undefined,
                phone: phone || undefined,
                avatar_url: avatar_url !== undefined ? avatar_url : undefined,
                updated_at: new Date(),
            },
            select: {
                id: true,
                code: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                avatar_url: true,
                is_active: true,
                created_at: true,
                updated_at: true,
                pangkalan_id: true,
            },
        });

        // Auto-sync to pangkalans table if user is PANGKALAN
        if (existingUser?.role === 'PANGKALAN' && existingUser?.pangkalan_id) {
            const pangkalanUpdateData: any = {};
            if (name) pangkalanUpdateData.pic_name = name;
            if (phone) pangkalanUpdateData.phone = phone;

            if (Object.keys(pangkalanUpdateData).length > 0) {
                await prisma.pangkalans.update({
                    where: { id: existingUser.pangkalan_id },
                    data: pangkalanUpdateData,
                });
            }
        }

        return jsonResponse({
            message: 'Profil berhasil diperbarui',
            user: updatedUser,
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return errorResponse('Terjadi kesalahan server', 500);
    }
};
