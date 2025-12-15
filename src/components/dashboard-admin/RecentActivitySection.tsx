
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import SafeIcon from '@/components/common/SafeIcon'
import { activityApi, type ActivityLog } from '@/lib/api'

/**
 * Utility: Format relative time dari timestamp
 */
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Get icon name based on activity type
 */
const getActivityIcon = (type: string, iconName?: string | null): string => {
  if (iconName) return iconName
  switch (type) {
    case 'ORDER_NEW': return 'ShoppingCart'
    case 'ORDER_UPDATED': return 'Edit'
    case 'ORDER_COMPLETED': return 'CheckCircle'
    case 'ORDER_CANCELLED': return 'XCircle'
    case 'PAYMENT_RECEIVED': return 'CreditCard'
    case 'STOCK_IN': return 'ArrowDownCircle'
    case 'STOCK_OUT': return 'ArrowUpCircle'
    case 'USER_LOGIN': return 'LogIn'
    default: return 'Activity'
  }
}

/**
 * Get badge style based on activity type
 */
const getActivityStyle = (type: string): { bg: string; text: string; badge: string; badgeText: string } => {
  switch (type) {
    case 'ORDER_NEW':
      return { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', badgeText: 'Baru' }
    case 'ORDER_COMPLETED':
      return { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100 text-green-700', badgeText: 'Selesai' }
    case 'ORDER_CANCELLED':
      return { bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-100 text-red-700', badgeText: 'Batal' }
    case 'PAYMENT_RECEIVED':
      return { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', badgeText: 'Pembayaran' }
    case 'STOCK_IN':
      return { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', badgeText: 'Stok Masuk' }
    case 'STOCK_OUT':
      return { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700', badgeText: 'Stok Keluar' }
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700', badgeText: 'Lainnya' }
  }
}

export default function RecentActivitySection() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const data = await activityApi.getRecent(5)
        setActivities(data)
      } catch (err) {
        console.error('Failed to fetch recent activities:', err)
        setError('Gagal memuat aktivitas')
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivities()
  }, [])

  return (
    <Card className="h-full flex flex-col shadow-enterprise">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Pantau aktivitas sistem secara real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-3 max-h-96 overflow-y-auto flex-1">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <SafeIcon name="AlertCircle" className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">{error}</p>
            </div>
          ) : activities.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <SafeIcon name="Inbox" className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">Belum ada aktivitas</p>
            </div>
          ) : (
            // Activity list
            activities.map((activity, index) => {
              const style = getActivityStyle(activity.type)
              const icon = getActivityIcon(activity.type, activity.icon_name)

              return (
                <div
                  key={activity.id}
                  className="transition-all duration-300 ease-out hover:bg-muted/50 p-3 rounded-lg cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} transition-all duration-300`}>
                      <SafeIcon
                        name={icon}
                        className={`h-5 w-5 ${style.text}`}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <p className="text-xs sm:text-sm font-medium">{activity.title}</p>
                        <Badge variant="outline" className={`text-xs flex-shrink-0 ${style.badge} hover:bg-inherit`}>
                          {style.badgeText}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {activity.description || activity.pangkalan_name || 'Tidak ada detail'}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <p className="text-muted-foreground">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                        {activity.detail_numeric && (
                          <p className="font-semibold text-primary">
                            {activity.detail_numeric.toLocaleString('id-ID')} tabung
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < activities.length - 1 && <Separator className="mt-3" />}
                </div>
              )
            })
          )}
        </div>
        <Button
          variant="outline"
          className="w-full mt-2 text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out group"
          asChild
        >
          <a href="/riwayat-aktivitas">
            Lihat Semua Aktivitas
            <SafeIcon name="ArrowRight" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
