
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
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import NotificationModal from '@/components/common/NotificationModal'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { removeToken, authApi } from '@/lib/api'
import { clearCachedProfile } from '@/components/auth/AuthGuard'

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'

// Helper to get proper avatar URL with API prefix
const getAvatarUrl = (url: string | null | undefined) => {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}/api${url}`
}

interface AdminHeaderProps {
  userName?: string
  userRole?: string
  notificationCount?: number
}

export default function AdminHeader({
  userName: initialUserName = 'Admin User',
  userRole: initialUserRole = 'Administrator',
  notificationCount: initialCount = 0
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [userName, setUserName] = useState(initialUserName)
  const [userRole, setUserRole] = useState(initialUserRole)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [notificationCount, setNotificationCount] = useState(initialCount)

  /**
   * Fetch user profile dan notification count dari API saat component mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profile = await authApi.getProfile()
        setUserName(profile.name)
        setUserRole(profile.role === 'ADMIN' ? 'Administrator' : 'Operator')
        setAvatarUrl(getAvatarUrl(profile.avatar_url))

        // Fetch notification count
        const { notificationApi } = await import('@/lib/api')
        const notifData = await notificationApi.getNotifications(20)
        setNotificationCount(notifData.unread_count)
      } catch (err) {
        // Jika gagal fetch, gunakan default values
        console.error('Failed to fetch data:', err)
      }
    }
    fetchData()
  }, [])

  /**
   * Handle logout: hapus token, clear cache, dan redirect ke login
   */
  const handleLogout = () => {
    clearCachedProfile() // Clear profile cache
    removeToken()
    window.location.href = '/login'
  }

  /**
   * Handle notification modal: clear badge saat modal dibuka
   */
  const handleNotificationOpen = () => {
    setShowNotifications(true)
    setNotificationCount(0) // Clear badge saat sudah dilihat
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all duration-300" id="ijli">
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <SafeIcon name="Flame" className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">SIM4LON</h1>
            </div>
          </div>

          {/* Right Section: Notifications & User */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="lg"
              className="relative hover:bg-primary/10 transition-colors"
              onClick={handleNotificationOpen}
              aria-label="Notifikasi"
            >
              <SafeIcon name="Bell" className="h-6 w-6" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-6 w-6 rounded-full p-0 text-xs flex items-center justify-center font-bold"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userRole}</p>
                  </div>
                  <SafeIcon name="ChevronDown" className="h-4 w-4 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profil-admin" className="cursor-pointer">
                    <SafeIcon name="User" className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)} className="cursor-pointer text-destructive">
                  <SafeIcon name="LogOut" className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Notification Modal */}
      <NotificationModal
        open={showNotifications}
        onOpenChange={setShowNotifications}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari sistem?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        icon="LogOut"
        iconColor="text-primary"
        isDangerous={false}
        onConfirm={handleLogout}
      />
    </>
  )
}
