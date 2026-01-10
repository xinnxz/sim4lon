/**
 * QueryProvider - React Query Provider wrapper
 * 
 * Wraps the application with QueryClientProvider for:
 * - Centralized data caching
 * - Automatic background refetching
 * - Optimistic updates support
 */

'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import type { ReactNode } from 'react'

interface QueryProviderProps {
    children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
