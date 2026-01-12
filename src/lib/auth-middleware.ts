/**
 * Auth Middleware untuk Vercel API Routes
 * 
 * Fungsi helper untuk memverifikasi JWT token dan mendapatkan user info.
 */

import jwt from 'jsonwebtoken';
import type { APIContext } from 'astro';

// JWT Secret - harus sama dengan yang di backend
const JWT_SECRET = import.meta.env.JWT_SECRET || 'sim4lon-jwt-secret-key-2024';

export interface JwtPayload {
    sub: string;          // user id
    email: string;
    role: 'ADMIN' | 'OPERATOR' | 'PANGKALAN';
    pangkalan_id?: string | null;
    session_id?: string;
    iat?: number;
    exp?: number;
}

/**
 * Verifikasi JWT token dari Authorization header
 * @returns JwtPayload jika valid, null jika tidak valid
 */
export function verifyAuth(request: Request): JwtPayload | null {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7); // Remove "Bearer "
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

/**
 * Helper untuk require auth pada API route
 * Mengembalikan Response error jika tidak authenticated
 */
export function requireAuth(request: Request): { user: JwtPayload } | Response {
    const user = verifyAuth(request);

    if (!user) {
        return new Response(JSON.stringify({
            message: 'Unauthorized',
            statusCode: 401
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return { user };
}

/**
 * Helper untuk membuat JSON response
 */
export function jsonResponse(data: any, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}

/**
 * Helper untuk error response
 */
export function errorResponse(message: string, status: number = 400): Response {
    return new Response(JSON.stringify({
        message,
        statusCode: status
    }), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * Handle CORS preflight
 */
export function handleCors(): Response {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        }
    });
}
