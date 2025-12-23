
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

// localStorage keys for caching
const PROFILE_CACHE_KEY = 'sim4lon_profile_cache'
const NOTIF_READ_KEY = 'sim4lon_last_notif_read'

export default function AdminHeader({
  userName: initialUserName = '',
  userRole: initialUserRole = '',
  notificationCount: initialCount = 0
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState(() => {
    // Try to get cached profile first to prevent flicker
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY)
        if (cached) {
          const profile = JSON.parse(cached)
          return profile.name || initialUserName
        }
      } catch { /* ignore */ }
    }
    return initialUserName
  })
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY)
        if (cached) {
          const profile = JSON.parse(cached)
          return profile.role === 'ADMIN' ? 'Administrator' : 'Operator'
        }
      } catch { /* ignore */ }
    }
    return initialUserRole
  })
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY)
        if (cached) {
          const profile = JSON.parse(cached)
          return getAvatarUrl(profile.avatar_url)
        }
      } catch { /* ignore */ }
    }
    return undefined
  })
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

        // Cache profile to localStorage for faster subsequent loads
        if (typeof window !== 'undefined') {
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile))
        }

        // Fetch notification count
        const { notificationApi } = await import('@/lib/api')
        const notifData = await notificationApi.getNotifications(20)

        // Check if user has marked notifications as read before
        const lastReadTime = localStorage.getItem(NOTIF_READ_KEY)
        if (lastReadTime) {
          const lastRead = new Date(lastReadTime)
          // Count only notifications newer than last read time
          const unreadCount = notifData.notifications.filter(
            n => new Date(n.time) > lastRead
          ).length
          setNotificationCount(unreadCount)
        } else {
          setNotificationCount(notifData.unread_count)
        }
      } catch (err) {
        // Jika gagal fetch, gunakan cached/default values
        console.error('Failed to fetch data:', err)
      } finally {
        setIsLoading(false)
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
   * Handle notification modal: buka modal dan langsung mark as read
   * Badge akan langsung clear saat modal dibuka (using localStorage)
   */
  const handleNotificationOpen = () => {
    setShowNotifications(true)
    // Langsung clear badge saat dibuka dan simpan timestamp
    if (notificationCount > 0) {
      setNotificationCount(0)
      // Simpan timestamp ke localStorage agar tidak muncul lagi
      if (typeof window !== 'undefined') {
        localStorage.setItem(NOTIF_READ_KEY, new Date().toISOString())
      }
    }
  }

  /**
   * Handle notification modal close: tidak perlu refresh karena sudah di-mark
   */
  const handleNotificationClose = (open: boolean) => {
    setShowNotifications(open)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all duration-300" id="ijli">
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            {/* Light mode logo */}
            <img
              src="/logo-pertamina.png"
              alt="Pertamina"
              className="h-10 object-contain dark:hidden"
            />
            {/* Dark mode logo */}
            <img
              src="/logo-pertamina-darkmode.png"
              alt="Pertamina"
              className="h-10 object-contain hidden dark:block"
            />
          </div>

          {/* Right Section: Notifications & User */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl hover:bg-muted/50 transition-all duration-200"
              onClick={handleNotificationOpen}
              aria-label="Notifikasi"
            >
              <SafeIcon name="Bell" className="h-5 w-5 text-muted-foreground" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center font-bold shadow-lg"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 px-3 py-2 h-auto rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full opacity-75" />
                    <Avatar className="h-9 w-9 relative border-2 border-background">
                      <AvatarImage src={avatarUrl} alt={userName || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm">
                        {userName ? userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '..'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-foreground">{userName || <span className="text-muted-foreground">Loading...</span>}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{userRole || ''}</p>
                  </div>
                  <SafeIcon name="ChevronDown" className="h-4 w-4 hidden md:block text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="font-normal px-2 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <a href="/profil-admin" className="flex items-center gap-2 px-2 py-2">
                    <SafeIcon name="User" className="h-4 w-4 text-muted-foreground" />
                    <span>Profil Saya</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowLogoutConfirm(true)}
                  className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
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
        onOpenChange={handleNotificationClose}
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
