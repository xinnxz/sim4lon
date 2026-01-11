/**
 * PangkalanMobileNav - Mobile Bottom Navigation
 * 
 * Modern iOS/Android-style bottom navigation bar for mobile devices.
 * Shows on sm: and below, hidden on md: and above.
 */

'use client'

import { useState, useEffect } from 'react'
import SafeIcon from '@/components/common/SafeIcon'

const menuItems = [
    {
        name: 'Home',
        href: '/pangkalan/dashboard',
        icon: 'LayoutDashboard',
    },
    {
        name: 'Stok',
        href: '/pangkalan/stok',
        icon: 'Package',
    },
    {
        name: 'Jual',
        href: '/pangkalan/penjualan/catat',
        icon: 'Plus',
        isMain: true, // Primary action button - CENTERED
    },
    {
        name: 'Konsumen',
        href: '/pangkalan/konsumen',
        icon: 'Users',
    },
    {
        name: 'Lainnya',
        href: '#more',
        icon: 'Menu',
        isMore: true,
    },
]

const moreMenuItems = [
    { name: 'Penjualan', href: '/pangkalan/penjualan', icon: 'ShoppingBag' },
    { name: 'Pengeluaran', href: '/pangkalan/pengeluaran', icon: 'Wallet' },
    { name: 'Laporan', href: '/pangkalan/laporan', icon: 'FileText' },
    { name: 'Profil', href: '/pangkalan/profil', icon: 'User' },
]

export default function PangkalanMobileNav() {
    const [activePage, setActivePage] = useState<string>('')
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setActivePage(window.location.pathname)
        }
    }, [])

    const isActive = (href: string) => {
        if (href === '#more') return false
        if (activePage === href) return true
        if (href === '/pangkalan/dashboard' && activePage.startsWith('/pangkalan/penjualan/catat')) return false
        return false
    }

    return (
        <>
            {/* More Menu Overlay */}
            {showMore && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setShowMore(false)}
                />
            )}

            {/* More Menu Sheet */}
            {showMore && (
                <div className="fixed bottom-[72px] left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl z-50 p-4 md:hidden animate-slideInBottom">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Menu Lainnya</h3>
                        <button
                            onClick={() => setShowMore(false)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <SafeIcon name="X" className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {moreMenuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activePage === item.href
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <SafeIcon name={item.icon} className="h-6 w-6" />
                                <span className="text-xs font-medium">{item.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40 md:hidden safe-area-bottom">
                <div className="flex items-center justify-around h-full px-2">
                    {menuItems.map((item) => {
                        const active = isActive(item.href)

                        // Main action button (Jual/Plus)
                        if (item.isMain) {
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40 active:scale-95 transition-transform"
                                >
                                    <SafeIcon name={item.icon} className="h-7 w-7" />
                                </a>
                            )
                        }

                        // More button
                        if (item.isMore) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setShowMore(!showMore)}
                                    className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors ${showMore ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'
                                        }`}
                                >
                                    <SafeIcon name={showMore ? 'X' : item.icon} className="h-6 w-6" />
                                    <span className="text-[10px] font-medium">{showMore ? 'Tutup' : item.name}</span>
                                </button>
                            )
                        }

                        // Regular nav item
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors ${active
                                    ? 'text-blue-600'
                                    : 'text-slate-500 dark:text-slate-400 active:text-blue-600'
                                    }`}
                            >
                                <SafeIcon name={item.icon} className={`h-6 w-6 ${active ? 'scale-110' : ''} transition-transform`} />
                                <span className="text-[10px] font-medium">{item.name}</span>
                                {active && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600" />}
                            </a>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
