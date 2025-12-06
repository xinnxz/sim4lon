
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  type: 'info' | 'success' | 'warning' | 'error'
  icon: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Pesanan Baru',
    message: 'Pesanan #12345 dari Pangkalan Maju Jaya telah dibuat',
    time: '5 menit yang lalu',
    type: 'info',
    icon: 'ShoppingCart',
    read: false
  },
  {
    id: 2,
    title: 'Pembayaran Diterima',
    message: 'Pembayaran untuk pesanan #12344 telah dikonfirmasi sebesar Rp 2.500.000',
    time: '1 jam yang lalu',
    type: 'success',
    icon: 'CheckCircle',
    read: false
  },
  {
    id: 3,
    title: 'Stok Menipis',
    message: 'Stok LPG 3kg tersisa 50 tabung. Pertimbangkan untuk melakukan pemesanan ulang.',
    time: '2 jam yang lalu',
    type: 'warning',
    icon: 'AlertTriangle',
    read: false
  },
  {
    id: 4,
    title: 'Pengiriman Selesai',
    message: 'Pengiriman #DEL-001 ke Pangkalan Sejahtera telah selesai',
    time: '3 jam yang lalu',
    type: 'success',
    icon: 'Truck',
    read: true
  },
  {
    id: 5,
    title: 'Driver Tidak Tersedia',
    message: 'Driver Budi tidak tersedia untuk pengiriman pada tanggal 15 Januari 2025',
    time: '5 jam yang lalu',
    type: 'warning',
    icon: 'AlertCircle',
    read: true
  },
  {
    id: 6,
    title: 'Sistem Update',
    message: 'Sistem akan melakukan pemeliharaan pada 20 Januari 2025 pukul 22:00 - 23:00',
    time: '1 hari yang lalu',
    type: 'info',
    icon: 'Info',
    read: true
  },
  {
    id: 7,
    title: 'Pesanan Dibatalkan',
    message: 'Pesanan #12340 telah dibatalkan oleh Pangkalan Sentosa',
    time: '2 hari yang lalu',
    type: 'error',
    icon: 'XCircle',
    read: true
  },
  {
    id: 8,
    title: 'Laporan Bulanan Siap',
    message: 'Laporan penjualan bulan Desember 2024 telah siap untuk diunduh',
    time: '3 hari yang lalu',
    type: 'info',
    icon: 'FileText',
    read: true
  },
]

export default function NotificationPageContent() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'success' | 'warning' | 'error'>('all')

  const filteredNotifications = notifications.filter(notif => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'unread') return !notif.read
    return notif.type === selectedFilter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-primary/10 text-primary'
      case 'warning':
        return 'bg-accent/20 text-accent-foreground'
      case 'error':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-secondary text-foreground'
    }
  }

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default'
      case 'warning':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
        <p className="text-muted-foreground">
          Kelola dan lihat semua notifikasi penting dari sistem
        </p>
      </div>

      {/* Filter & Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Daftar Notifikasi</CardTitle>
              <CardDescription>
                {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                  Tandai Semua Dibaca
                </Button>
              )}
              {notifications.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <SafeIcon name="Trash2" className="mr-2 h-4 w-4" />
                  Hapus Semua
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Semua', value: 'all' as const },
          { label: 'Belum Dibaca', value: 'unread' as const },
          { label: 'Sukses', value: 'success' as const },
          { label: 'Peringatan', value: 'warning' as const },
          { label: 'Error', value: 'error' as const },
        ].map(filter => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <div key={notification.id}>
              <Card className={`transition-all ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getNotificationColor(notification.type)}`}>
                      <SafeIcon name={notification.icon} className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <Badge variant={getNotificationBadgeVariant(notification.type)}>
                          {notification.type === 'success' && 'Sukses'}
                          {notification.type === 'warning' && 'Peringatan'}
                          {notification.type === 'error' && 'Error'}
                          {notification.type === 'info' && 'Info'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          title="Tandai sebagai dibaca"
                        >
                          <SafeIcon name="Check" className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus notifikasi"
                      >
                        <SafeIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {index < filteredNotifications.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                <SafeIcon name="Bell" className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Tidak Ada Notifikasi</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedFilter === 'unread' 
                    ? 'Semua notifikasi sudah dibaca' 
                    : 'Tidak ada notifikasi untuk filter yang dipilih'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <SafeIcon name="Info" className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Notifikasi Otomatis
              </p>
              <p className="text-sm text-muted-foreground">
                Sistem akan mengirimkan notifikasi otomatis untuk pesanan baru, pembayaran, pengiriman, dan perubahan stok penting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
