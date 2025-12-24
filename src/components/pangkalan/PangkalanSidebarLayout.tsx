/**
 * PangkalanSidebarLayout - Layout wrapper untuk dashboard pangkalan
 * 
 * BEST PRACTICE STRUCTURE:
 * ┌─────────────────────────────────────┐
 * │      HEADER (full width, sticky)    │  ← Spans entire width
 * ├──────────┬──────────────────────────┤
 * │ SIDEBAR  │       CONTENT            │  ← Sidebar + Content in row
 * │          │                          │
 * └──────────┴──────────────────────────┘
 * 
 * Header is inside SidebarProvider (for hamburger menu access)
 * but wrapped in a flex-col container to place it ABOVE the sidebar+content row.
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
        <SidebarProvider
            style={{ '--header-height': '64px' } as React.CSSProperties}
        >
            {/* Flex column: header on top, sidebar+content row below */}
            <div className="pangkalan-scale flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
                {/* HEADER - Full width at top */}
                <PangkalanHeaderSimple />

                {/* SIDEBAR + CONTENT row */}
                <div className="flex flex-1 w-full">
                    <PangkalanSidebar />
                    <SidebarInset className="flex flex-col flex-1">
                        <main className="flex-1 p-2 lg:p-8">
                            <div className="max-w-7xl mx-auto">
                                {children}
                            </div>
                        </main>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    )
}
