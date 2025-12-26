/**
 * ActivityPage - Riwayat Aktivitas dengan UI Modern
 * 
 * PENJELASAN:
 * Component ini menampilkan riwayat aktivitas sistem dengan fitur:
 * - Timeline view aktivitas
 * - Filter berdasarkan tipe aktivitas
 * - Pagination
 * - Summary cards dengan AnimatedNumber
 * - Skeleton loading yang elegan
 */

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination'
import SafeIcon from '@/components/common/SafeIcon'
import AnimatedNumber from '@/components/common/AnimatedNumber'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
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
 * Supports both uppercase (ORDER_NEW) and lowercase (order_new) types
 */
const getActivityConfig = (type: string, iconOverride?: string | null) => {
  const configs: Record<string, { icon: string; color: string; bgColor: string; borderColor: string; label: string; gradient: string }> = {
    // Order activities
    'ORDER_NEW': {
      icon: 'ShoppingCart',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Pesanan Baru',
      gradient: 'from-blue-500 to-blue-600'
    },
    'ORDER_CREATED': {
      icon: 'ShoppingCart',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Pesanan Dibuat',
      gradient: 'from-blue-500 to-blue-600'
    },
    'ORDER_UPDATED': {
      icon: 'RefreshCw',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      label: 'Update Pesanan',
      gradient: 'from-amber-500 to-amber-600'
    },
    'ORDER_STATUS_UPDATED': {
      icon: 'RefreshCw',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      label: 'Status Diperbarui',
      gradient: 'from-amber-500 to-amber-600'
    },
    'ORDER_COMPLETED': {
      icon: 'CheckCircle2',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      borderColor: 'border-emerald-500/20',
      label: 'Selesai',
      gradient: 'from-emerald-600/90 to-emerald-500/90'
    },
    'ORDER_DELIVERED': {
      icon: 'Truck',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      label: 'Dikirim',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    'ORDER_CANCELLED': {
      icon: 'XCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Dibatalkan',
      gradient: 'from-red-500 to-red-600'
    },
    // Stock activities
    'STOCK_IN': {
      icon: 'PackagePlus',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      label: 'Stok Masuk',
      gradient: 'from-primary to-primary/80'
    },
    'STOCK_OUT': {
      icon: 'PackageMinus',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      label: 'Stok Keluar',
      gradient: 'from-orange-500 to-orange-600'
    },
    // System activities
    'USER_LOGIN': {
      icon: 'User',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-border',
      label: 'Login',
      gradient: 'from-muted-foreground/60 to-muted-foreground/50'
    },
    'SYSTEM_CREATE': {
      icon: 'Plus',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      borderColor: 'border-emerald-500/20',
      label: 'Data Dibuat',
      gradient: 'from-emerald-600/90 to-emerald-500/90'
    },
    'SYSTEM_UPDATE': {
      icon: 'Edit',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      label: 'Data Diperbarui',
      gradient: 'from-amber-500 to-amber-600'
    },
    'SYSTEM_DELETE': {
      icon: 'Trash2',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Data Dihapus',
      gradient: 'from-red-500 to-red-600'
    }
  }
  // Case-insensitive lookup
  const normalizedType = type.toUpperCase()
  const config = configs[normalizedType] || {
    icon: 'Activity',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Aktivitas',
    gradient: 'from-gray-500 to-gray-600'
  }
  return { ...config, icon: iconOverride || config.icon }
}

const activityFilters = [
  { value: 'all', label: 'Semua', icon: 'ListFilter', color: 'from-slate-500 to-slate-600' },
  { value: 'ORDER', label: 'Pesanan', icon: 'ShoppingCart', color: 'from-cyan-500 to-blue-600' },
  { value: 'STOCK', label: 'Stok LPG', icon: 'Package', color: 'from-primary to-primary/80' },
  { value: 'SYSTEM', label: 'Sistem', icon: 'Settings', color: 'from-slate-600 to-slate-700' },
]

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

// Skeleton Card Component
const StatCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div className="animate-pulse" style={{ animationDelay: `${delay}ms` }}>
    <Card className="border-0 glass-card h-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-200 w-10 h-10 animate-shimmer" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-slate-200 rounded animate-shimmer" />
            <div className="h-7 w-14 bg-slate-200 rounded animate-shimmer" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Timeline Skeleton Component
const TimelineSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex gap-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
        <div className="hidden sm:flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-slate-200 animate-shimmer" />
          <div className="w-0.5 h-16 bg-slate-200 mt-2 animate-shimmer" />
        </div>
        <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-40 bg-slate-200 rounded animate-shimmer" />
            <div className="h-5 w-20 bg-slate-200 rounded animate-shimmer" />
          </div>
          <div className="h-4 w-3/4 bg-slate-200 rounded animate-shimmer mb-3" />
          <div className="flex gap-4">
            <div className="h-3 w-24 bg-slate-200 rounded animate-shimmer" />
            <div className="h-3 w-20 bg-slate-200 rounded animate-shimmer" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

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
          typeParam = 'ORDER_NEW' // Will filter ORDER_* types on backend
        } else if (selectedFilter === 'STOCK') {
          typeParam = 'STOCK_IN' // Will filter STOCK_* types on backend
        } else if (selectedFilter === 'SYSTEM') {
          typeParam = 'USER_LOGIN' // Will filter USER_* types on backend
        } else if (selectedFilter !== 'all') {
          typeParam = selectedFilter
        }

        const response = await activityApi.getAll(currentPage, itemsPerPage, typeParam)
        setActivities(response.data)
        setMeta(response.meta)
      } catch (err) {
        console.error('Failed to fetch activities:', err)
        setError('Gagal memuat riwayat aktivitas. Silakan coba lagi.')
        setActivities([])
        setMeta(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivities()
  }, [currentPage, itemsPerPage, selectedFilter])

  // Stats for current page
  const stats = useMemo(() => ({
    total: meta?.total || 0,
    showing: activities.length,
    orderCount: activities.filter(a => a.type.startsWith('ORDER')).length,
    stockCount: activities.filter(a => a.type.startsWith('STOCK')).length,
    systemCount: activities.filter(a => a.type.startsWith('USER') || a.type.startsWith('SYSTEM')).length,
  }), [meta, activities])

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    setCurrentPage(1)
  }

  // Retry function
  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    window.location.reload()
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
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen">
      {/* Header - with Vertical Gradient Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-primary/40" />
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">
              Riwayat Aktivitas
            </h1>
            <p className="text-muted-foreground/80 mt-1">
              Pantau semua aktivitas sistem secara real-time
            </p>
          </div>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-card/50 backdrop-blur-sm w-fit">
          <SafeIcon name="Database" className="h-4 w-4 mr-2" />
          {isLoading ? '... ' : <AnimatedNumber value={stats.total} delay={0} />} Total
        </Badge>
      </div>

      {/* Gradient Divider Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Filter Chips */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {activityFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "outline"}
                size="sm"
                className={`gap-2 transition-all duration-200 ${selectedFilter === filter.value
                  ? `bg-gradient-to-r ${filter.color} text-white shadow-md hover:shadow-lg`
                  : 'bg-transparent hover:bg-white/50 text-muted-foreground'
                  }`}
                onClick={() => handleFilterChange(filter.value)}
              >
                <SafeIcon name={filter.icon} className="h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SafeIcon name="Clock" className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-lg">Timeline Aktivitas</CardTitle>
                <CardDescription>
                  {isLoading ? 'Memuat...' : `Menampilkan ${stats.showing} dari ${stats.total} aktivitas`}
                </CardDescription>
              </div>
            </div>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1) }}
            >
              <SelectTrigger className="w-36 bg-white/50">
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
        <CardContent className="p-6">
          {isLoading ? (
            <TimelineSkeleton />
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <SafeIcon name="AlertTriangle" className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Terjadi Kesalahan</h3>
              <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
              <Button onClick={handleRetry} className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <SafeIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          ) : activities.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-4">
                <SafeIcon name="Inbox" className="h-12 w-12 text-primary/60" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Belum Ada Aktivitas</h3>
              <p className="text-muted-foreground max-w-md">
                Aktivitas sistem akan muncul di sini saat pesanan dibuat, pembayaran diterima, atau stok diperbarui.
              </p>
            </div>
          ) : (
            // Timeline View
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden sm:block" />

              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const config = getActivityConfig(activity.type, activity.icon_name)

                  return (
                    <div
                      key={activity.id}
                      className="relative flex gap-4 group animate-fadeInUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Timeline Dot */}
                      <div className="hidden sm:flex flex-col items-center z-10">
                        <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${config.gradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                          <SafeIcon name={config.icon} className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 p-5 rounded-xl border ${config.borderColor} bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group-hover:translate-x-1`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            {/* Mobile Icon */}
                            <div className={`sm:hidden h-10 w-10 rounded-xl bg-gradient-to-br ${config.gradient} shadow-sm flex items-center justify-center`}>
                              <SafeIcon name={config.icon} className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-foreground text-lg">{activity.title}</h4>
                          </div>
                          <Badge className={`text-xs bg-gradient-to-r ${config.gradient} text-white border-0 shadow-sm w-fit`}>
                            {config.label}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {activity.description || activity.pangkalan_name || 'Tidak ada detail'}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1">
                            <SafeIcon name="Clock" className="h-3.5 w-3.5" />
                            {formatRelativeTime(activity.timestamp)}
                          </span>
                          {activity.users && (
                            <span className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1">
                              <SafeIcon name="User" className="h-3.5 w-3.5" />
                              {activity.users.name}
                            </span>
                          )}
                          {activity.detail_numeric && (
                            <span className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 font-medium">
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
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="hover:bg-purple-50"
                      >
                        <SafeIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
                        Prev
                      </Button>
                    </PaginationItem>
                    <div className="flex items-center gap-1 mx-2">
                      {getPaginationItems().map((item, i) => (
                        <PaginationItem key={i}>
                          {item === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <Button
                              variant={item === currentPage ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => setCurrentPage(item as number)}
                              className={item === currentPage ? 'bg-purple-500 hover:bg-purple-600' : ''}
                            >
                              {item}
                            </Button>
                          )}
                        </PaginationItem>
                      ))}
                    </div>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="hover:bg-purple-50"
                      >
                        Next
                        <SafeIcon name="ChevronRight" className="h-4 w-4 ml-1" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
