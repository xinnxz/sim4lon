/**
 * QueryProvider - React Query Provider with Persistent LocalStorage Cache
 * 
 * Features:
 * - Centralized data caching
 * - LocalStorage persistence (data survives page refresh!)
 * - Automatic background refetching
 * - Optimistic updates support
 */

'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { queryClient } from '@/lib/queryClient'
import type { ReactNode } from 'react'

// Create localStorage persister (only in browser)
const persister = typeof window !== 'undefined'
    ? createSyncStoragePersister({
        storage: window.localStorage,
        key: 'sim4lon-cache',
        // Serialize with compression (smaller storage)
        serialize: (data) => JSON.stringify(data),
        deserialize: (data) => JSON.parse(data),
    })
    : null

interface QueryProviderProps {
    children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    // Use PersistQueryClientProvider if persister is available (browser)
    if (persister) {
        return (
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                    persister,
                    // Cache expires after 24 hours
                    maxAge: 24 * 60 * 60 * 1000,
                    // Don't persist error states
                    dehydrateOptions: {
                        shouldDehydrateQuery: (query) => {
                            return query.state.status === 'success'
                        },
                    },
                }}
            >
                {children}
            </PersistQueryClientProvider>
        )
    }

    // Fallback for SSR
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
