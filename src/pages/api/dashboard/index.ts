/**
 * API Route: GET /api/dashboard
 * 
 * Dashboard endpoint untuk mendapatkan statistik KPI.
 * Phase 1: Simplified version - hanya stats dasar.
 */

import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { requireAuth, jsonResponse, errorResponse, handleCors } from '../../../lib/auth-middleware';

const prisma = new PrismaClient();

// Handle OPTIONS request for CORS
export const OPTIONS: APIRoute = async () => {
    return handleCors();
};

// GET /api/dashboard
export const GET: APIRoute = async ({ request }) => {
    try {
        // Check authentication
        const authResult = requireAuth(request);
        if (authResult instanceof Response) {
            return authResult;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Count today's orders
        const todayOrders = await prisma.orders.count({
            where: {
                order_date: { gte: today },
            },
        });

        // Sum today's sales (exclude cancelled)
        const salesData = await prisma.orders.aggregate({
            where: {
                order_date: { gte: today },
                current_status: { not: 'BATAL' },
            },
            _sum: {
                total_amount: true,
            },
        });
        const todaySales = Number(salesData._sum.total_amount) || 0;

        // Count pending orders
        const pendingOrders = await prisma.orders.count({
            where: {
                current_status: {
                    in: ['DRAFT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES', 'SIAP_KIRIM'],
                },
            },
        });

        // Count completed orders today
        const completedOrders = await prisma.orders.count({
            where: {
                current_status: 'SELESAI',
                order_date: { gte: today },
            },
        });

        // Get stock summary from stock_histories
        const stockHistory = await prisma.stock_histories.groupBy({
            by: ['lpg_type', 'movement_type'],
            where: {
                lpg_type: { not: null }
            },
            _sum: {
                qty: true,
            },
        });

        const totalStock: Record<string, number> = {
            kg3: 0,
            kg12: 0,
            kg50: 0,
        };

        stockHistory.forEach((item) => {
            const lpgType = item.lpg_type as string;
            if (!lpgType) return;
            const qty = item._sum.qty || 0;

            if (item.movement_type === 'MASUK') {
                totalStock[lpgType] = (totalStock[lpgType] || 0) + qty;
            } else {
                totalStock[lpgType] = (totalStock[lpgType] || 0) - qty;
            }
        });

        // Get dynamic products with stock
        const products = await prisma.lpg_products.findMany({
            where: {
                is_active: true,
                deleted_at: null
            },
            orderBy: { size_kg: 'asc' }
        });

        const productStockData = await prisma.stock_histories.groupBy({
            by: ['lpg_product_id', 'movement_type'],
            where: {
                lpg_product_id: { not: null }
            },
            _sum: {
                qty: true
            }
        });

        const dynamicProducts = products.map(product => {
            const productStock = productStockData.filter(s => s.lpg_product_id === product.id);
            const inQty = productStock.find(s => s.movement_type === 'MASUK')?._sum.qty || 0;
            const outQty = productStock.find(s => s.movement_type === 'KELUAR')?._sum.qty || 0;

            return {
                id: product.id,
                name: product.name,
                size_kg: Number(product.size_kg),
                category: product.category,
                color: product.color,
                price: Number(product.selling_price) || 0,
                stock: {
                    in: inQty,
                    out: outQty,
                    current: inQty - outQty
                }
            };
        });

        return jsonResponse({
            todayOrders,
            todaySales,
            pendingOrders,
            completedOrders,
            totalStock,
            dynamicProducts,
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        return errorResponse('Terjadi kesalahan server', 500);
    }
};
