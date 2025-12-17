/**
 * PangkalanSidebarLayout - Layout wrapper untuk dashboard pangkalan
 * 
 * STRUKTUR LAYOUT:
 * ┌─────────────────────────────────────┐
 * │           HEADER (fixed)            │
 * ├──────────┬──────────────────────────┤
 * │ SIDEBAR  │       CONTENT            │
 * │          │                          │
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
        <div className="min-h-screen flex flex-col">
            {/* Fixed Header */}
            <PangkalanHeaderSimple />

            {/* Sidebar + Content */}
            <SidebarProvider
                style={{ '--header-height': '64px' } as React.CSSProperties}
            >
                <PangkalanSidebar />
                <SidebarInset className="flex-1">
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
