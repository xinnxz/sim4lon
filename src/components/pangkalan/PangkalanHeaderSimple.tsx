/**
 * PangkalanHeaderSimple - Header sederhana untuk Dashboard Pangkalan
 * 
 * Versi simple tanpa SidebarTrigger untuk menghindari context issues.
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
import { authApi, type UserProfile } from '@/lib/api'
import { clearCachedProfile } from '@/components/auth/AuthGuard'

export default function PangkalanHeaderSimple() {
    const [profile, setProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authApi.getProfile()
                setProfile(data)
            } catch (error) {
                console.error('Failed to fetch profile:', error)
            }
        }
        fetchProfile()
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
        <header className="sticky top-0 z-50 w-full h-16 border-b bg-white dark:bg-slate-950 shadow-sm">
            <div className="flex h-full items-center px-4 gap-4">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <img
                        src="/src/assets/logo-pertamina-2.png"
                        alt="Pertamina"
                        className="h-10 object-contain"
                    />
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">SIM4LON</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {profile?.pangkalans?.name || 'Dashboard Pangkalan'}
                        </p>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10 border-2 border-blue-100">
                                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                    {profile ? getInitials(profile.name) : 'P'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{profile?.name}</p>
                                <p className="text-xs text-muted-foreground">{profile?.email}</p>
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
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                            <SafeIcon name="LogOut" className="mr-2 h-4 w-4" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
