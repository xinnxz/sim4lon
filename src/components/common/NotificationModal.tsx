
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { notificationApi, type NotificationItem } from '@/lib/api'

interface NotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notifications when modal opens
  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await notificationApi.getNotifications(20)
      setNotifications(response.notifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.link) {
      window.location.href = notification.link
    }
  };

  const getPriorityStyle = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-600 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-600 border-orange-300'
      default:
        return 'bg-accent/10 text-accent-foreground border-accent/30'
    }
  }

  const getIconStyle = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 group-hover:bg-red-100'
      case 'high':
        return 'bg-orange-50 group-hover:bg-orange-100'
      case 'medium':
        return 'bg-primary/15 group-hover:bg-primary/20'
      default:
        return 'bg-secondary group-hover:bg-secondary/70'
    }
  }

  const getIconColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-primary'
      default:
        return 'text-foreground'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifikasi</DialogTitle>
          <DialogDescription>
            {isLoading ? 'Memuat notifikasi...' : `Anda memiliki ${notifications.length} notifikasi`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <SafeIcon name="Loader2" className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <SafeIcon name="Bell" className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className="flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/5 active:bg-primary/10 transition-colors duration-200 group"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconStyle(notification.priority)} transition-colors duration-200`}>
                      <SafeIcon
                        name={notification.icon}
                        className={`h-5 w-5 ${getIconColor(notification.priority)}`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-none text-foreground">
                          {notification.title}
                        </p>
                        {(notification.priority === 'critical' || notification.priority === 'high') && (
                          <Badge variant="outline" className={`shrink-0 text-xs ${getPriorityStyle(notification.priority)}`}>
                            {notification.priority === 'critical' ? 'Kritis!' : 'Penting'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  {index < notifications.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <Button variant="outline" className="w-full mt-4 text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-300 ease-out" asChild>
          <a href="/log-aktivitas">
            Lihat Semua Aktivitas
            <SafeIcon name="ArrowRight" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
