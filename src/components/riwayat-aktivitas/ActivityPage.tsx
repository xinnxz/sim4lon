
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import SafeIcon from '@/components/common/SafeIcon'
import { activityApi, type ActivityLog, type ActivityResponse } from '@/lib/api'

/**
 * Format relative time dari timestamp
 */
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Get icon and style based on activity type
 */
const getActivityConfig = (type: string, iconOverride?: string | null) => {
  const configs: Record<string, { icon: string; color: string; bgColor: string; borderColor: string; label: string }> = {
    'ORDER_NEW': {
      icon: 'ShoppingCart',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Pesanan Baru'
    },
    'ORDER_UPDATED': {
      icon: 'RefreshCw',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      label: 'Update Pesanan'
    },
    'ORDER_COMPLETED': {
      icon: 'CheckCircle2',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Selesai'
    },
    'ORDER_CANCELLED': {
      icon: 'XCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Dibatalkan'
    },
    'PAYMENT_RECEIVED': {
      icon: 'Banknote',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      label: 'Pembayaran'
    },
    'STOCK_IN': {
      icon: 'PackagePlus',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      label: 'Stok Masuk'
    },
    'STOCK_OUT': {
      icon: 'PackageMinus',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      label: 'Stok Keluar'
    },
    'USER_LOGIN': {
      icon: 'LogIn',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      label: 'Login'
    }
  }
  const config = configs[type] || {
    icon: 'Activity',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Aktivitas'
  }
  return { ...config, icon: iconOverride || config.icon }
}

const activityFilters = [
  { value: 'all', label: 'Semua', icon: 'ListFilter' },
  { value: 'ORDER', label: 'Pesanan', icon: 'ShoppingCart' },
  { value: 'PAYMENT', label: 'Pembayaran', icon: 'Banknote' },
  { value: 'STOCK', label: 'Stok', icon: 'Package' },
]

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

export default function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [meta, setMeta] = useState<ActivityResponse['meta'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Map filter to API type parameter
        let typeParam: string | undefined
        if (selectedFilter === 'ORDER') {
          typeParam = 'ORDER_NEW' // API will need to handle wildcards or we fetch all order types
        } else if (selectedFilter === 'PAYMENT') {
          typeParam = 'PAYMENT_RECEIVED'
        } else if (selectedFilter === 'STOCK') {
          typeParam = 'STOCK_IN' // Similar issue
        } else if (selectedFilter !== 'all') {
          typeParam = selectedFilter
        }

        const response = await activityApi.getAll(currentPage, itemsPerPage, typeParam)
        setActivities(response.data)
        setMeta(response.meta)
      } catch (err) {
        console.error('Failed to fetch activities:', err)
        setError('Gagal memuat riwayat aktivitas')
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivities()
  }, [currentPage, itemsPerPage, selectedFilter])

  // Stats for current page
  const stats = useMemo(() => ({
    total: meta?.total || 0,
    showing: activities.length
  }), [meta, activities])

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    setCurrentPage(1)
  }

  // Pagination helpers
  const totalPages = meta?.totalPages || 1
  const getPaginationItems = () => {
    const items: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
    } else if (currentPage <= 3) {
      items.push(1, 2, 3, 4, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - 2) {
      items.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      items.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
    }
    return items
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <SafeIcon name="History" className="h-7 w-7 text-primary" />
            Riwayat Aktivitas
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Pantau semua aktivitas sistem secara real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium">
            <SafeIcon name="Database" className="h-4 w-4 mr-1.5" />
            {stats.total.toLocaleString('id-ID')} Total
          </Badge>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {activityFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? "default" : "outline"}
            size="sm"
            className={`gap-2 transition-all duration-200 ${selectedFilter === filter.value
                ? 'shadow-md scale-105'
                : 'hover:scale-[1.02]'
              }`}
            onClick={() => handleFilterChange(filter.value)}
          >
            <SafeIcon name={filter.icon} className="h-4 w-4" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Timeline Aktivitas</CardTitle>
              <CardDescription>
                Menampilkan {stats.showing} dari {stats.total} aktivitas
              </CardDescription>
            </div>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1) }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt.toString()}>{opt} per halaman</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Skeleton Loading
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="w-0.5 h-12 mt-2" />
                  </div>
                  <div className="flex-1 space-y-2 pb-4">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <SafeIcon name="AlertTriangle" className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Terjadi Kesalahan</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <SafeIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          ) : activities.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <SafeIcon name="Inbox" className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Belum Ada Aktivitas</h3>
              <p className="text-muted-foreground max-w-sm">
                Aktivitas sistem akan muncul di sini saat pesanan dibuat, pembayaran diterima, atau stok diperbarui.
              </p>
            </div>
          ) : (
            // Timeline View
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden sm:block" />

              <div className="space-y-1">
                {activities.map((activity, index) => {
                  const config = getActivityConfig(activity.type, activity.icon_name)

                  return (
                    <div
                      key={activity.id}
                      className="relative flex gap-4 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Timeline Dot */}
                      <div className="hidden sm:flex flex-col items-center z-10">
                        <div className={`h-10 w-10 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                          <SafeIcon name={config.icon} className={`h-5 w-5 ${config.color}`} />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 p-4 rounded-xl border ${config.borderColor} ${config.bgColor} group-hover:shadow-md transition-all duration-200 mb-3`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {/* Mobile Icon */}
                            <div className={`sm:hidden h-8 w-8 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
                              <SafeIcon name={config.icon} className={`h-4 w-4 ${config.color}`} />
                            </div>
                            <h4 className="font-semibold text-foreground">{activity.title}</h4>
                          </div>
                          <Badge variant="secondary" className={`text-xs ${config.bgColor} ${config.color} border ${config.borderColor} w-fit`}>
                            {config.label}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {activity.description || activity.pangkalan_name || 'Tidak ada detail'}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <SafeIcon name="Clock" className="h-3.5 w-3.5" />
                            {formatRelativeTime(activity.timestamp)}
                          </span>
                          {activity.users && (
                            <span className="flex items-center gap-1">
                              <SafeIcon name="User" className="h-3.5 w-3.5" />
                              {activity.users.name}
                            </span>
                          )}
                          {activity.detail_numeric && (
                            <span className="font-semibold text-primary flex items-center gap-1">
                              <SafeIcon name="Package" className="h-3.5 w-3.5" />
                              {activity.detail_numeric.toLocaleString('id-ID')} tabung
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && !isLoading && !error && (
            <div className="mt-6 pt-6 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1) }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {getPaginationItems().map((item, i) => (
                    <PaginationItem key={i}>
                      {item === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={item === currentPage}
                          onClick={(e) => { e.preventDefault(); setCurrentPage(item as number) }}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1) }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
