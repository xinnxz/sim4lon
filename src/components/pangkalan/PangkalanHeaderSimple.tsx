/**
 * PangkalanHeaderSimple - Header untuk Dashboard Pangkalan dengan hamburger menu
 * 
 * PENTING: Header ini HARUS di-render di dalam SidebarProvider agar
 * hamburger menu button bisa mengakses context sidebar.
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
import { useSidebar } from '@/components/ui/sidebar'

/**
 * Premium Mobile Menu Button with animated hamburger icon
 * Shows only on mobile (md:hidden)
 * Transforms to X when sidebar is open
 */
function MobileMenuButton() {
    try {
        const { toggleSidebar, openMobile } = useSidebar()

        return (
            <button
                onClick={toggleSidebar}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl 
                           bg-gradient-to-br from-blue-500/10 to-blue-500/5 
                           hover:from-blue-500/20 hover:to-blue-500/10 
                           active:scale-95 transition-all duration-300 
                           border border-blue-500/20 shadow-sm"
                aria-label="Toggle menu"
            >
                <div className="w-5 h-4 flex flex-col justify-between">
                    {/* Top line */}
                    <span
                        className={`block h-0.5 bg-blue-600 rounded-full transform transition-all duration-300 origin-left
                                   ${openMobile ? 'rotate-45 translate-x-0.5 w-[22px]' : 'w-5'}`}
                    />
                    {/* Middle line */}
                    <span
                        className={`block h-0.5 bg-blue-600 rounded-full transition-all duration-300
                                   ${openMobile ? 'opacity-0 translate-x-3' : 'w-4 opacity-100'}`}
                    />
                    {/* Bottom line */}
                    <span
                        className={`block h-0.5 bg-blue-600 rounded-full transform transition-all duration-300 origin-left
                                   ${openMobile ? '-rotate-45 translate-x-0.5 w-[22px]' : 'w-5'}`}
                    />
                </div>
            </button>
        )
    } catch {
        // useSidebar will throw if not within SidebarProvider - silently return null
        return null
    }
}

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
        <header className="sticky top-0 z-50 w-full h-14 sm:h-16 border-b bg-white dark:bg-slate-950 shadow-sm backdrop-blur-lg">
            <div className="flex h-full items-center px-3 sm:px-4 gap-2 sm:gap-4">
                {/* Mobile Hamburger Menu - Premium animated button */}
                <MobileMenuButton />

                {/* Logo & Title - Always visible */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <img
                        src="/logo-pertamina-2.png"
                        alt="Pertamina"
                        className="h-8 sm:h-10 object-contain transition-all duration-300"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">SIM4LON</h1>
                        <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium truncate max-w-[120px] sm:max-w-[200px]">
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
