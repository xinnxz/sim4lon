/**
 * Prisma Client untuk Vercel Serverless
 * 
 * Di environment serverless, setiap request bisa membuat koneksi baru.
 * File ini memastikan kita reuse Prisma Client yang sama.
 */

import { PrismaClient } from '@prisma/client';

// Untuk development, kita buat global untuk hot-reload
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Prisma Client - reuse instance untuk serverless
export const prisma = global.prisma || new PrismaClient();

// Di development, simpan di global agar tidak membuat koneksi baru setiap hot-reload
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
