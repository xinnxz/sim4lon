/**
 * useOptimizedQuery - Custom hooks untuk data fetching dengan caching
 * 
 * Menggabungkan React Query dengan API functions untuk:
 * - Automatic caching
 * - Background refetching
 * - Loading & error states
 * - Type-safe responses
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import {
    authApi,
    dashboardApi,
    stockApi,
    consumersApi,
    consumerOrdersApi,
    pangkalansApi,
    ordersApi,
    type DashboardStats,
    type StockLevel,
    type Consumer,
    type ConsumerOrder,
    type Pangkalan,
    type Order
} from '@/lib/api'

// ============================================================
// PROFILE HOOKS
// ============================================================

export function useProfile() {
    return useQuery({
        queryKey: queryKeys.profile,
        queryFn: () => authApi.getProfile(),
        staleTime: 10 * 60 * 1000, // Profile is stable, 10 min stale time
    })
}

// ============================================================
// DASHBOARD HOOKS
// ============================================================

export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboardStats,
        queryFn: () => dashboardApi.getStats(),
        staleTime: 2 * 60 * 1000, // 2 minutes - dashboard should be fairly fresh
    })
}

export function useDashboardAlerts() {
    return useQuery({
        queryKey: queryKeys.dashboardAlerts,
        queryFn: () => dashboardApi.getAlerts(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ============================================================
// STOCK HOOKS
// ============================================================

export function useStockLevels() {
    return useQuery({
        queryKey: queryKeys.stockLevels,
        queryFn: () => stockApi.getLevels(),
        staleTime: 5 * 60 * 1000,
    })
}

export function useStockHistory(type?: string) {
    return useQuery({
        queryKey: queryKeys.stockHistory(type),
        queryFn: () => stockApi.getHistory(1, 20),
        staleTime: 5 * 60 * 1000,
    })
}

// ============================================================
// CONSUMER HOOKS (Pangkalan)
// ============================================================

export function useConsumers(page: number = 1, search?: string) {
    return useQuery({
        queryKey: queryKeys.consumers(page, search),
        queryFn: () => consumersApi.getAll(page, 10, search),
        staleTime: 5 * 60 * 1000,
    })
}

export function useConsumerStats() {
    return useQuery({
        queryKey: queryKeys.consumerStats,
        queryFn: () => consumersApi.getStats(),
        staleTime: 5 * 60 * 1000,
    })
}

export function useConsumerOrders(page: number = 1) {
    return useQuery({
        queryKey: queryKeys.consumerOrders(page),
        queryFn: () => consumerOrdersApi.getAll({ page, limit: 10 }),
        staleTime: 2 * 60 * 1000, // Orders change frequently
    })
}

export function useConsumerOrderStats() {
    return useQuery({
        queryKey: queryKeys.consumerOrderStats,
        queryFn: () => consumerOrdersApi.getStats(),
        staleTime: 2 * 60 * 1000,
    })
}

// ============================================================
// PANGKALAN HOOKS (Admin)
// ============================================================

export function usePangkalans(page: number = 1, search?: string) {
    return useQuery({
        queryKey: queryKeys.pangkalans(page, search),
        queryFn: () => pangkalansApi.getAll(page, 10, search),
        staleTime: 5 * 60 * 1000,
    })
}

export function usePangkalanDetail(id: string) {
    return useQuery({
        queryKey: queryKeys.pangkalanDetail(id),
        queryFn: () => pangkalansApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })
}

// ============================================================
// ORDER HOOKS
// ============================================================

export function useOrders(page: number = 1, status?: string) {
    return useQuery({
        queryKey: queryKeys.orders(page, status),
        queryFn: () => ordersApi.getAll(page, 10, status),
        staleTime: 2 * 60 * 1000,
    })
}

export function useOrderDetail(id: string) {
    return useQuery({
        queryKey: queryKeys.orderDetail(id),
        queryFn: () => ordersApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })
}

// ============================================================
// MUTATION HOOKS (for create/update/delete)
// ============================================================

export function useCreateConsumerOrder() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: consumerOrdersApi.create,
        onSuccess: () => {
            // Invalidate related queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['consumer-orders'] })
            queryClient.invalidateQueries({ queryKey: queryKeys.consumerStats })
            queryClient.invalidateQueries({ queryKey: queryKeys.stockLevels })
        },
    })
}

export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.profile })
        },
    })
}
