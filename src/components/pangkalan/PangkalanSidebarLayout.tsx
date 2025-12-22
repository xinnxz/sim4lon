/**
 * PangkalanSidebarLayout - Layout wrapper untuk dashboard pangkalan
 * 
 * STRUKTUR LAYOUT:
 * ┌─────────────────────────────────────┐
 * │           HEADER (fixed)            │
 * ├──────────┬──────────────────────────┤
 * │ SIDEBAR  │       CONTENT            │
 * │          │     (with padding)       │
 * │          │                          │
 * └──────────┴──────────────────────────┘
 */

'use client'

import { useEffect } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import PangkalanSidebar from '@/components/pangkalan/PangkalanSidebar'
import PangkalanHeaderSimple from '@/components/pangkalan/PangkalanHeaderSimple'

interface PangkalanSidebarLayoutProps {
    children: React.ReactNode
}

export default function PangkalanSidebarLayout({ children }: PangkalanSidebarLayoutProps) {
    // Force blue accent color for pangkalan pages
    useEffect(() => {
        // Store original accent to restore later
        const originalAccent = document.documentElement.getAttribute('data-accent')

        // Force blue accent for pangkalan
        document.documentElement.setAttribute('data-accent', 'blue')

        // Cleanup: restore original accent when leaving pangkalan pages
        return () => {
            if (originalAccent) {
                document.documentElement.setAttribute('data-accent', originalAccent)
            } else {
                document.documentElement.removeAttribute('data-accent')
            }
        }
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
            {/* Fixed Header */}
            <PangkalanHeaderSimple />

            {/* Sidebar + Content */}
            <SidebarProvider
                style={{ '--header-height': '64px' } as React.CSSProperties}
            >
                <PangkalanSidebar />
                <SidebarInset className="flex-1">
                    {/* Content wrapper with proper padding */}
                    <main className="p-2 lg:p-8">
                        <div className="max-w-7x1 mx-auto">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

