
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
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { notificationApi, agenPangkalanOrdersApi, type NotificationItem } from '@/lib/api'
import { toast } from 'sonner'

interface NotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

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

  // Handle accept order from agen side
  const handleAcceptOrder = async (e: React.MouseEvent, notification: NotificationItem) => {
    e.stopPropagation()
    if (!notification.orderId) return

    try {
      setProcessingId(notification.id)
      await agenPangkalanOrdersApi.confirm(notification.orderId)
      toast.success('Pesanan berhasil dikonfirmasi!')
      // Remove from list
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengkonfirmasi pesanan')
    } finally {
      setProcessingId(null)
    }
  }

  // Handle reject order from agen side
  const handleRejectOrder = async (e: React.MouseEvent, notification: NotificationItem) => {
    e.stopPropagation()
    if (!notification.orderId) return

    try {
      setProcessingId(notification.id)
      await agenPangkalanOrdersApi.cancel(notification.orderId)
      toast.success('Pesanan ditolak')
      // Remove from list
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    } catch (error: any) {
      toast.error(error.message || 'Gagal menolak pesanan')
    } finally {
      setProcessingId(null)
    }
  }

  const getPriorityConfig = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'critical':
        return {
          badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          icon: 'bg-rose-500/10 dark:bg-rose-500/15',
          iconColor: 'text-rose-600 dark:text-rose-400',
          label: 'Kritis!',
          dot: 'bg-rose-500'
        }
      case 'high':
        return {
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: 'bg-amber-500/10 dark:bg-amber-500/15',
          iconColor: 'text-amber-600 dark:text-amber-400',
          label: 'Penting',
          dot: 'bg-amber-500'
        }
      case 'medium':
        return {
          badge: 'bg-primary/10 text-primary border-primary/20',
          icon: 'bg-primary/10 dark:bg-primary/15',
          iconColor: 'text-primary',
          label: 'Info',
          dot: 'bg-primary'
        }
      default:
        return {
          badge: 'bg-muted text-muted-foreground border-border',
          icon: 'bg-muted',
          iconColor: 'text-muted-foreground',
          label: '',
          dot: 'bg-muted-foreground'
        }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 px-6 py-5 border-b border-border/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <SafeIcon name="Bell" className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Notifikasi</DialogTitle>
                <DialogDescription className="text-sm">
                  {isLoading ? 'Memuat...' : notifications.length > 0 ? `${notifications.length} notifikasi aktif` : 'Tidak ada notifikasi'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Notification List */}
        <ScrollArea className="h-[400px]">
          <div className="px-4 py-3 space-y-1">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3 animate-pulse">
                    <div className="h-10 w-10 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <SafeIcon name="BellOff" className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-foreground">Tidak ada notifikasi</p>
                <p className="text-sm text-muted-foreground mt-1">Semua sudah dibaca!</p>
              </div>
            ) : (
              // Notification items
              notifications.map((notification, index) => {
                const config = getPriorityConfig(notification.priority)
                const isAgenOrder = notification.type === 'agen_order'
                const isProcessing = processingId === notification.id

                return (
                  <div
                    key={notification.id}
                    onClick={() => !isAgenOrder && handleNotificationClick(notification)}
                    className={`flex gap-3 p-3 rounded-xl ${isAgenOrder ? '' : 'cursor-pointer hover:bg-muted/50 active:bg-muted'} transition-all duration-200 group`}
                  >
                    {/* Icon with priority indicator */}
                    <div className="relative flex-shrink-0">
                      <div className={`h-10 w-10 rounded-xl ${config.icon} flex items-center justify-center transition-colors`}>
                        <SafeIcon name={notification.icon} className={`h-5 w-5 ${config.iconColor}`} />
                      </div>
                      {(notification.priority === 'critical' || notification.priority === 'high') && (
                        <div className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${config.dot} ring-2 ring-background`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {notification.title}
                        </p>
                        {(notification.priority === 'critical' || notification.priority === 'high') && (
                          <Badge variant="outline" className={`shrink-0 text-[10px] px-1.5 py-0 ${config.badge}`}>
                            {config.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                        <SafeIcon name="Clock" className="h-3 w-3" />
                        {notification.time}
                      </p>

                      {/* Action buttons for agen_order */}
                      {isAgenOrder && notification.orderId && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                            onClick={(e) => handleAcceptOrder(e, notification)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <SafeIcon name="Loader2" className="h-3 w-3 animate-spin" />
                            ) : (
                              <SafeIcon name="Check" className="h-3 w-3" />
                            )}
                            Terima
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 text-rose-600 border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                            onClick={(e) => handleRejectOrder(e, notification)}
                            disabled={isProcessing}
                          >
                            <SafeIcon name="X" className="h-3 w-3" />
                            Tolak
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Arrow indicator (only for non-agen orders) */}
                    {!isAgenOrder && (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <SafeIcon name="ChevronRight" className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <Button
            variant="outline"
            className="w-full gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            asChild
          >
            <a href="/riwayat-aktivitas">
              <SafeIcon name="History" className="h-4 w-4" />
              Lihat Semua Aktivitas
              <SafeIcon name="ArrowRight" className="h-4 w-4 ml-auto" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

