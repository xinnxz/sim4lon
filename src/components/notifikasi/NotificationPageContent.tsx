
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import { notificationApi, agenPangkalanOrdersApi, type NotificationItem } from '@/lib/api'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 10

export default function NotificationPageContent() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'stock' | 'order'>('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Stats from backend
  const [pendingCount, setPendingCount] = useState(0)
  const [stockAlertCount, setStockAlertCount] = useState(0)

  // Fetch notifications
  useEffect(() => {
    fetchNotifications()
  }, [currentPage, selectedFilter])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await notificationApi.getNotifications(currentPage, ITEMS_PER_PAGE, selectedFilter)
      setNotifications(response.data)
      setTotal(response.meta.total)
      setTotalPages(response.meta.totalPages)
      setPendingCount(response.meta.pendingCount)
      setStockAlertCount(response.meta.stockAlertCount)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Gagal memuat notifikasi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (filter: typeof selectedFilter) => {
    setSelectedFilter(filter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const getNotificationColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'stock_out':
      case 'stock_critical':
        return 'bg-destructive/10 text-destructive'
      case 'stock_low':
        return 'bg-amber-500/10 text-amber-600'
      case 'agen_order':
        return 'bg-primary/10 text-primary'
      case 'order_new':
        return 'bg-emerald-500/10 text-emerald-600'
      default:
        return 'bg-secondary text-foreground'
    }
  }

  const getNotificationBadgeVariant = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPriorityLabel = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'critical': return 'Kritis!'
      case 'high': return 'Penting'
      case 'medium': return 'Info'
      default: return ''
    }
  }

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.link && notification.type !== 'agen_order') {
      window.location.href = notification.link
    }
  }

  const handleAcceptOrder = async (e: React.MouseEvent, notification: NotificationItem) => {
    e.stopPropagation()
    if (!notification.orderId) return

    try {
      setProcessingId(notification.id)
      await agenPangkalanOrdersApi.confirm(notification.orderId)
      toast.success('Pesanan berhasil dikonfirmasi!')
      fetchNotifications() // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengkonfirmasi pesanan')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectOrder = async (e: React.MouseEvent, notification: NotificationItem) => {
    e.stopPropagation()
    if (!notification.orderId) return

    try {
      setProcessingId(notification.id)
      await agenPangkalanOrdersApi.cancel(notification.orderId)
      toast.success('Pesanan ditolak')
      fetchNotifications() // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Gagal menolak pesanan')
    } finally {
      setProcessingId(null)
    }
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <SafeIcon name="Bell" className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-sm text-muted-foreground">Total Notifikasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <SafeIcon name="ShoppingCart" className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pesanan Menunggu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <SafeIcon name="AlertTriangle" className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stockAlertCount}</p>
                <p className="text-sm text-muted-foreground">Alert Stok</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Daftar Notifikasi</CardTitle>
              <CardDescription>
                {isLoading ? 'Memuat...' : `Menampilkan ${notifications.length} dari ${total} notifikasi`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNotifications}
                disabled={isLoading}
              >
                <SafeIcon name="RefreshCw" className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Semua', value: 'all' as const },
          { label: 'Pesanan Pending', value: 'pending' as const, count: pendingCount },
          { label: 'Alert Stok', value: 'stock' as const, count: stockAlertCount },
          { label: 'Pesanan Baru', value: 'order' as const },
        ].map(filter => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange(filter.value)}
          >
            {filter.label}
            {filter.count !== undefined && filter.count > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {filter.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex gap-4 animate-pulse">
                  <div className="h-12 w-12 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const isAgenOrder = notification.type === 'agen_order'
            const isProcessing = processingId === notification.id

            return (
              <div key={notification.id}>
                <Card
                  className={`transition-all ${!isAgenOrder ? 'cursor-pointer hover:shadow-md' : ''} ${notification.priority === 'critical' ? 'border-destructive/50' : notification.priority === 'high' ? 'border-amber-500/50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getNotificationColor(notification.type)}`}>
                        <SafeIcon name={notification.icon} className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            {(notification.priority === 'critical' || notification.priority === 'high') && (
                              <Badge variant={getNotificationBadgeVariant(notification.priority)}>
                                {getPriorityLabel(notification.priority)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <SafeIcon name="Clock" className="h-3 w-3" />
                          {notification.time}
                        </p>
                        {isAgenOrder && notification.orderId && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={(e) => handleAcceptOrder(e, notification)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" /> : <SafeIcon name="Check" className="h-4 w-4" />}
                              Terima
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-rose-600 border-rose-300 hover:bg-rose-50"
                              onClick={(e) => handleRejectOrder(e, notification)}
                              disabled={isProcessing}
                            >
                              <SafeIcon name="X" className="h-4 w-4" />
                              Tolak
                            </Button>
                          </div>
                        )}
                      </div>
                      {!isAgenOrder && notification.link && (
                        <div className="flex items-center">
                          <SafeIcon name="ChevronRight" className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {index < notifications.length - 1 && <Separator className="my-2" />}
              </div>
            )
          })}
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
                  {selectedFilter !== 'all' ? 'Tidak ada notifikasi untuk filter ini' : 'Belum ada notifikasi saat ini'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <SafeIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              Selanjutnya
              <SafeIcon name="ChevronRight" className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <SafeIcon name="Info" className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Notifikasi Otomatis</p>
              <p className="text-sm text-muted-foreground">
                Sistem akan mengirimkan notifikasi otomatis untuk pesanan baru dari pangkalan, pembayaran, dan perubahan stok penting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
