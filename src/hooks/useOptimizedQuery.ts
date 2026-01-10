/**
 * useOptimizedQuery - Custom hooks untuk data fetching dengan caching
 * 
 * Menggabungkan React Query dengan API functions untuk:
 * - Automatic caching
 * - Background refetching
 * - Loading & error states
 * - Type-safe responses
 * 
 * NOTE: These hooks are optional utilities. Components can still
 * use direct API calls if preferred.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import {
    authApi,
    consumersApi,
    consumerOrdersApi,
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
        queryFn: () => consumerOrdersApi.getAll(page, 10),
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
