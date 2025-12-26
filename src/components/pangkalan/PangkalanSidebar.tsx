/**
 * PangkalanSidebar - Sidebar Navigation untuk Dashboard Pangkalan
 * 
 * MENU FINAL (Simplified):
 * - Dashboard (catat penjualan ada di sini)
 * - Riwayat Penjualan
 * - Stok LPG
 * - Konsumen
 * - Laporan
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

const menuItems = [
    {
        name: 'Dashboard',
        href: '/pangkalan/dashboard',
        icon: 'LayoutDashboard',
    },
    {
        name: 'Penjualan',
        href: '/pangkalan/penjualan',
        icon: 'ShoppingBag',
    },
    {
        name: 'Stok LPG',
        href: '/pangkalan/stok',
        icon: 'Package',
    },
    {
        name: 'Konsumen',
        href: '/pangkalan/konsumen',
        icon: 'Users',
    },
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
]

export default function PangkalanSidebar() {
    const [activePage, setActivePage] = useState<string>('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setActivePage(window.location.pathname)
        }
    }, [])

    const isActive = (href: string) => {
        if (activePage === href) return true
        // Special case for penjualan - don't match /catat subpage
        if (href === '/pangkalan/penjualan') {
            return activePage === '/pangkalan/penjualan'
        }
        return false
    }

    return (
        <Sidebar className="border-r bg-white dark:bg-slate-950">
            <SidebarContent className="pt-4 sidebar-scrollbar-modern">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1 px-2">
                            {menuItems.map((item) => {
                                const active = isActive(item.href)
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <a
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 h-11 rounded-lg transition-colors ${active
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-950'
                                                }`}
                                        >
                                            <SafeIcon name={item.icon} className="h-5 w-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </a>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <div className="text-xs text-slate-400 text-center">
                    SIM4LON Pangkalan
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
