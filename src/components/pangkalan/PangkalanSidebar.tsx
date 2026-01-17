/**
 * PangkalanSidebar - Sidebar Navigation untuk Dashboard Pangkalan
 * 
 * BEST PRACTICES:
 * - Grouped menu items for better organization
 * - Smart active state detection with startsWith
 * - Sub-menu support for related pages
 * - Quick action shortcuts
 * 
 * THEME: BIRU
 */

'use client'

import { useState, useEffect } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarFooter,
} from '@/components/ui/sidebar'
import SafeIcon from '@/components/common/SafeIcon'

// Menu configuration with groups
const menuConfig = {
    main: [
        {
            name: 'Dashboard',
            href: '/pangkalan/dashboard',
            icon: 'LayoutDashboard',
            exactMatch: true, // Only match exact path
        },
    ],
    transaksi: [
        {
            name: 'Catat Penjualan',
            href: '/pangkalan/catat-penjualan',
            icon: 'ShoppingCart',
            exactMatch: true,
        },
        {
            name: 'Riwayat Penjualan',
            href: '/pangkalan/penjualan',
            icon: 'History',
            exactMatch: true,
        },
    ],
    inventaris: [
        {
            name: 'Stok LPG',
            href: '/pangkalan/stok',
            icon: 'Package',
            // Will match /pangkalan/stok and /pangkalan/stok/riwayat
        },
        {
            name: 'Konsumen',
            href: '/pangkalan/konsumen',
            icon: 'Users',
        },
    ],
    keuangan: [
        {
            name: 'Pengeluaran',
            href: '/pangkalan/pengeluaran',
            icon: 'Wallet',
        },
        {
            name: 'Laporan',
            href: '/pangkalan/laporan',
            icon: 'FileText',
        },
    ],
}

// Group labels
const groupLabels: Record<string, string> = {
    main: 'Utama',
    transaksi: 'Transaksi',
    inventaris: 'Inventaris',
    keuangan: 'Keuangan',
}

export default function PangkalanSidebar() {
    const [activePage, setActivePage] = useState<string>('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setActivePage(window.location.pathname)
        }
    }, [])

    // Smart active detection
    const isActive = (item: { href: string; exactMatch?: boolean }) => {
        if (item.exactMatch) {
            return activePage === item.href
        }
        // For non-exact match, use startsWith to handle sub-pages
        return activePage.startsWith(item.href)
    }

    const renderMenuItems = (items: { name: string; href: string; icon: string; exactMatch?: boolean }[]) => (
        <SidebarMenu className="space-y-1">
            {items.map((item) => {
                const active = isActive(item)
                return (
                    <SidebarMenuItem key={item.name}>
                        <a
                            href={item.href}
                            className={`flex items-center gap-3 px-3 h-11 rounded-lg transition-all ${active
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-950'
                                }`}
                        >
                            <SafeIcon name={item.icon} className={`h-5 w-5 ${active ? 'text-white' : ''}`} />
                            <span className="font-medium">{item.name}</span>
                        </a>
                    </SidebarMenuItem>
                )
            })}
        </SidebarMenu>
    )

    return (
        <Sidebar className="border-r bg-white dark:bg-slate-950">
            <SidebarContent className="pt-4 sidebar-scrollbar-modern">
                {Object.entries(menuConfig).map(([groupKey, items]) => (
                    <SidebarGroup key={groupKey}>
                        <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">
                            {groupLabels[groupKey]}
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-2">
                            {renderMenuItems(items)}
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <div className="text-xs text-slate-400 text-center">
                    SIM4LON Pangkalan
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
