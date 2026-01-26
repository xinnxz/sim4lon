/**
 * PangkalanHeader - Header untuk Dashboard Pangkalan
 * 
 * PENJELASAN:
 * Header khusus untuk user pangkalan dengan info pangkalan dan user.
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SafeIcon from '@/components/common/SafeIcon'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { authApi, notificationApi, type UserProfile, type NotificationItem } from '@/lib/api'
import { clearCachedProfile } from '@/components/auth/AuthGuard'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

export default function PangkalanHeader() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const fetchRequiredData = async () => {
            try {
                // Fetch profile
                const profileData = await authApi.getProfile()
                setProfile(profileData)

                // Fetch notifications
                const notifData = await notificationApi.getDropdownNotifications()
                setNotifications(notifData.data || [])
                setUnreadCount(notifData.meta?.pendingCount || 0)
            } catch (error) {
                console.error('Failed to fetch header data:', error)
            }
        }
        fetchRequiredData()
    }, [])

    const handleLogout = () => {
        clearCachedProfile()
        authApi.logout()
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2 sm:gap-4">
                {/* Sidebar Toggle - Premium styled */}
                <SidebarTrigger className="-ml-1 sm:-ml-2 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-300" />

                {/* Logo & Title - Responsive */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Logo - clickable to go back to pangkalan dashboard */}
                    <a href="/pangkalan/dashboard" className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
                        <img
                            src="/logo-pertamina-2.png"
                            alt="Pertamina"
                            className="h-7 sm:h-9 object-contain transition-all duration-300"
                        />
                    </a>
                    <div className="hidden xs:block">
                        <h1 className="text-sm sm:text-base font-bold leading-none">SIM4LON</h1>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                            {profile?.pangkalans?.name || 'Pangkalan'}
                        </p>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Notification Bell */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl mx-1 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all duration-200">
                            <SafeIcon name="Bell" className="h-4 w-4 text-slate-600 transition-colors group-hover:text-blue-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 p-0 rounded-2xl shadow-xl border-slate-100 overflow-hidden mr-4" align="end" forceMount>
                        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <span className="font-semibold text-sm text-slate-800">Notifikasi</span>
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-[10px] px-1.5 h-5">
                                    {unreadCount} baru
                                </Badge>
                            )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="py-8 text-center text-slate-500 text-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                                        <SafeIcon name="BellOff" className="h-6 w-6" />
                                    </div>
                                    Belum ada notifikasi
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((notif: any) => (
                                        <div key={notif.id} className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!notif.read_at ? 'bg-blue-50/30' : ''}`}>
                                            <div className="flex gap-3">
                                                <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${notif.type?.includes('order') ? 'bg-blue-100 text-blue-600' :
                                                        notif.type?.includes('stock') ? 'bg-amber-100 text-amber-600' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    <SafeIcon name={notif.icon || 'Bell'} className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium leading-tight text-slate-900 mb-0.5">{notif.title}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                        <SafeIcon name="Clock" className="h-2.5 w-2.5" />
                                                        {notif.created_at || notif.time ? formatDistanceToNow(new Date(notif.created_at || notif.time), { addSuffix: true, locale: id }) : 'Baru saja'}
                                                    </p>
                                                </div>
                                                {!notif.read_at && (
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 w-full h-8" asChild>
                                <a href="/pangkalan/notifikasi">Lihat Semua Notifikasi</a>
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {profile ? getInitials(profile.name) : 'P'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{profile?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {profile?.email}
                                </p>
                                <p className="text-xs leading-none text-blue-600 font-medium mt-1">
                                    {profile?.pangkalans?.name}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href="/pangkalan/profil" className="cursor-pointer">
                                <SafeIcon name="User" className="mr-2 h-4 w-4" />
                                Profil
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                            <SafeIcon name="LogOut" className="mr-2 h-4 w-4" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
