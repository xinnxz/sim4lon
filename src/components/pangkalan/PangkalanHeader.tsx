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
import { authApi, type UserProfile } from '@/lib/api'
import { clearCachedProfile } from '@/components/auth/AuthGuard'

export default function PangkalanHeader() {
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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 gap-4">
                {/* Sidebar Toggle */}
                <SidebarTrigger className="-ml-2" />

                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                        <SafeIcon name="Flame" className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold leading-none">SIM4LON</h1>
                        <p className="text-xs text-muted-foreground">
                            {profile?.pangkalans?.name || 'Pangkalan'}
                        </p>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

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
