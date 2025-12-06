
import { useState } from 'react'
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

interface AdminHeaderProps {
  userName?: string
  userRole?: string
  notificationCount?: number
}

export default function AdminHeader({ 
  userName = 'Admin User',
  userRole = 'Administrator',
  notificationCount = 3
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

return (
    <>
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" id="ijli">
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
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(true)}
              aria-label="Notifikasi"
            >
              <SafeIcon name="Bell" className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
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
                    <AvatarImage src="https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/307adb9b-4e82-4810-bce6-d781a7e2c71a.png" alt={userName} />
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
                  <a href="./profil-admin.html" className="cursor-pointer">
                    <SafeIcon name="User" className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="./profil-admin.html" className="cursor-pointer">
                    <SafeIcon name="Settings" className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
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
         onConfirm={async () => {
           window.location.href = './login.html'
         }}
       />
     </>
   )
}
