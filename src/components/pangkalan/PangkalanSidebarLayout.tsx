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
    // Force blue accent color for pangkalan pages AND ensure theme consistency
    useEffect(() => {
        const root = document.documentElement;

        // Store original accent to restore later
        const originalAccent = root.getAttribute('data-accent');

        // Force blue accent for pangkalan
        root.setAttribute('data-accent', 'blue');

        // THEME PERSISTENCE: Ensure theme is consistent on navigation
        // This fixes the bug where DevTools or navigation causes theme to flip
        const savedTheme = localStorage.getItem('theme');

        // Remove both classes first to avoid conflicts
        root.classList.remove('dark', 'light');

        if (savedTheme === 'dark') {
            root.classList.add('dark');
        } else if (savedTheme === 'light') {
            root.classList.add('light');
        } else {
            // System preference fallback
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.add('light');
            }
        }

        // Cleanup: restore original accent when leaving pangkalan pages
        return () => {
            if (originalAccent) {
                root.setAttribute('data-accent', originalAccent);
            } else {
                root.removeAttribute('data-accent');
            }
        };
    }, []);

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
