/**
 * React Query Client Configuration
 * 
 * Provides centralized caching and data fetching management:
 * - Automatic caching of API responses
 * - Background refetching for fresh data
 * - Retry logic for failed requests
 * - Stale-while-revalidate pattern
 */

import { QueryClient } from '@tanstack/react-query'

// Create a client with optimized defaults
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Keep unused data in cache for 30 minutes
            gcTime: 30 * 60 * 1000,

            // Retry failed requests up to 2 times
            retry: 2,

            // Don't refetch on window focus in production
            refetchOnWindowFocus: false,

            // Refetch on reconnect
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
})

// Query keys for type-safe caching
export const queryKeys = {
    // Auth
    profile: ['profile'] as const,

    // Dashboard
    dashboardStats: ['dashboard', 'stats'] as const,
    dashboardAlerts: ['dashboard', 'alerts'] as const,

    // Orders
    orders: (page: number, status?: string) => ['orders', { page, status }] as const,
    orderDetail: (id: string) => ['orders', id] as const,

    // Stock
    stockLevels: ['stock', 'levels'] as const,
    stockHistory: (type?: string) => ['stock', 'history', { type }] as const,

    // Consumers
    consumers: (page: number, search?: string) => ['consumers', { page, search }] as const,
    consumerDetail: (id: string) => ['consumers', id] as const,
    consumerStats: ['consumers', 'stats'] as const,

    // Consumer Orders (Pangkalan)
    consumerOrders: (page: number) => ['consumer-orders', { page }] as const,
    consumerOrderStats: ['consumer-orders', 'stats'] as const,

    // Pangkalans (Admin)
    pangkalans: (page: number, search?: string) => ['pangkalans', { page, search }] as const,
    pangkalanDetail: (id: string) => ['pangkalans', id] as const,

    // Reports
    reportsOverview: (period?: string) => ['reports', 'overview', { period }] as const,
    reportsRevenue: (period?: string) => ['reports', 'revenue', { period }] as const,
}
