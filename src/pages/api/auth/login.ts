/**
 * API Route: POST /api/auth/login
 * 
 * Login endpoint untuk autentikasi user.
 * Mengembalikan JWT token jika berhasil.
 */

import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jsonResponse, errorResponse, handleCors } from '../../../lib/auth-middleware';

// Prisma client
const prisma = new PrismaClient();

// JWT Secret
const JWT_SECRET = import.meta.env.JWT_SECRET || 'sim4lon-jwt-secret-key-2024';

// Handle OPTIONS request for CORS
export const OPTIONS: APIRoute = async () => {
    return handleCors();
};

export const POST: APIRoute = async ({ request }) => {
    try {
        // Parse request body
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return errorResponse('Email dan password diperlukan', 400);
        }

        // Find user by email with pangkalan info
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                pangkalans: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        is_active: true,
                    },
                },
            },
        });

        if (!user) {
            return errorResponse('Email atau password salah', 401);
        }

        // Check if user is active
        if (!user.is_active) {
            return errorResponse('Akun tidak aktif', 401);
        }

        // Check if pangkalan is active (for PANGKALAN role users)
        if (user.role === 'PANGKALAN' && user.pangkalans && !user.pangkalans.is_active) {
            return errorResponse('Pangkalan Anda sudah dinonaktifkan. Hubungi agen untuk informasi lebih lanjut.', 401);
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return errorResponse('Email atau password salah', 401);
        }

        // Generate unique session ID for single-session login
        const sessionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

        // Save session_id to database (invalidates old sessions)
        await prisma.users.update({
            where: { id: user.id },
            data: { session_id: sessionId },
        });

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            pangkalan_id: user.pangkalan_id,
            session_id: sessionId,
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        // Log activity (optional - skip jika tabel tidak ada)
        try {
            await prisma.activities.create({
                data: {
                    type: 'user_login',
                    title: 'User Login',
                    description: `${user.name} berhasil login`,
                    user_id: user.id,
                },
            });
        } catch (e) {
            // Ignore jika activities table tidak ada
        }

        return jsonResponse({
            message: 'Login berhasil',
            access_token: accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                pangkalan_id: user.pangkalan_id,
                pangkalan: user.pangkalans,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('Terjadi kesalahan server', 500);
    }
};
