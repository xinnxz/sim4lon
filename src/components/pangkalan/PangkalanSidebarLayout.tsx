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

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import PangkalanSidebar from '@/components/pangkalan/PangkalanSidebar'
import PangkalanHeaderSimple from '@/components/pangkalan/PangkalanHeaderSimple'

interface PangkalanSidebarLayoutProps {
    children: React.ReactNode
}

export default function PangkalanSidebarLayout({ children }: PangkalanSidebarLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
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
