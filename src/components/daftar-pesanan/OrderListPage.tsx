/**
 * OrderListPage - Daftar Pesanan dengan Data Real dari API
 * 
 * PENJELASAN:
 * Component ini menampilkan daftar pesanan dengan fitur:
 * - Fetch data dari API (bukan mock data)
 * - Search dan filter berdasarkan status
 * - Pagination
 * - Summary stats berdasarkan status
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import { toast } from 'sonner'
import { ordersApi, type Order, type OrderStatus, type OrderStats } from '@/lib/api'
import AnimatedNumber from '@/components/common/AnimatedNumber'

/**
 * Status labels for display
 */
const statusLabels: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  DIPROSES: 'Diproses',
  SIAP_KIRIM: 'Siap Kirim', // Legacy - kept for backward compatibility
  DIKIRIM: 'Sedang Dikirim',
  SELESAI: 'Selesai',
  BATAL: 'Dibatalkan',
}

/**
 * Status badge colors
 */
const statusColors: Record<OrderStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  MENUNGGU_PEMBAYARAN: 'bg-amber-100 text-amber-700',
  DIPROSES: 'bg-blue-100 text-blue-700',
  SIAP_KIRIM: 'bg-purple-100 text-purple-700', // Legacy
  DIKIRIM: 'bg-indigo-100 text-indigo-700',
  SELESAI: 'bg-green-100 text-green-700',
  BATAL: 'bg-red-100 text-red-700',
}

export default function OrderListPage() {
  // Data state
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalOrders, setTotalOrders] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Stats state - fetch from API for accurate counts (today only)
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  /**
   * Fetch orders from API
   */
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter as OrderStatus
      const response = await ordersApi.getAll(currentPage, 10, status)

      setOrders(response.data)
      setTotalOrders(response.meta.total)
      setTotalPages(response.meta.totalPages)

    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Gagal memuat data pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fetch stats from API
   */
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      const data = await ordersApi.getStats(true) // today only
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchStats()
  }, [])

  // Fetch orders on page/filter change
  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter])

  // Debounce search - in future can add search to API
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchOrders()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  /**
   * Format currency
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  /**
   * Format date with time
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /**
   * Format order code - use from API or fallback
   */
  const formatOrderCode = (order: Order) => {
    // Use code from API if available, otherwise generate fallback
    return order.code || `ORD-${order.id.slice(0, 4).toUpperCase()}`
  }

  /**
   * Get items summary (first item + more count)
   */
  const getItemsSummary = (order: Order) => {
    if (!order.order_items || order.order_items.length === 0) {
      return '-'
    }
    const first = order.order_items[0]
    const more = order.order_items.length - 1
    const summary = `${first.label} (${first.qty})`
    return more > 0 ? `${summary} +${more} lainnya` : summary
  }

  /**
   * Get total quantity
   */
  const getTotalQty = (order: Order) => {
    if (!order.order_items) return 0
    return order.order_items.reduce((sum, item) => sum + item.qty, 0)
  }

  // Filter orders by search (client-side for now)
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      order.id.toLowerCase().includes(term) ||
      order.pangkalans?.name.toLowerCase().includes(term) ||
      order.order_items?.some(item => item.label.toLowerCase().includes(term))
    )
  })

  return (
    <div className="flex-1 space-y-6 p-6 dashboard-gradient-bg min-h-screen">
      {/* Header with Premium Styling */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Daftar Pesanan</h1>
            <p className="text-muted-foreground/80 mt-1">
              Kelola semua pesanan masuk dengan mudah
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
          style={{ boxShadow: '0 4px 15px -3px rgba(22, 163, 74, 0.4)' }}
        >
          <a href="/buat-pesanan">
            <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
            Buat Pesanan
          </a>
        </Button>
      </div>

      {/* Summary Stats - Hari Ini with Tilt3D + Premium Styling */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow">
          <div className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Hari Ini</p>
                <p className="text-3xl font-bold mt-2"><AnimatedNumber value={stats?.total || 0} delay={100} /></p>
                <p className="text-xs text-muted-foreground mt-1">pesanan</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" style={{ boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)' }}>
                <SafeIcon name="ShoppingCart" className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
          </div>
        </Tilt3DCard>

        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow">
          <div className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menunggu Bayar</p>
                <p className="text-3xl font-bold mt-2 text-amber-600"><AnimatedNumber value={stats?.menunggu_pembayaran || 0} delay={200} /></p>
                <p className="text-xs text-muted-foreground mt-1">hari ini</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200" style={{ boxShadow: '0 4px 12px -2px rgba(245,158,11,0.3)' }}>
                <SafeIcon name="Clock" className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
          </div>
        </Tilt3DCard>

        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow">
          <div className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diproses</p>
                <p className="text-3xl font-bold mt-2 text-blue-600"><AnimatedNumber value={stats?.diproses || 0} delay={300} /></p>
                <p className="text-xs text-muted-foreground mt-1">hari ini</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200" style={{ boxShadow: '0 4px 12px -2px rgba(59,130,246,0.3)' }}>
                <SafeIcon name="RefreshCw" className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300" />
          </div>
        </Tilt3DCard>

        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow">
          <div className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dikirim</p>
                <p className="text-3xl font-bold mt-2 text-indigo-600"><AnimatedNumber value={stats?.dikirim || 0} delay={400} /></p>
                <p className="text-xs text-muted-foreground mt-1">hari ini</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200" style={{ boxShadow: '0 4px 12px -2px rgba(99,102,241,0.3)' }}>
                <SafeIcon name="Truck" className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-300" />
          </div>
        </Tilt3DCard>

        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-5 card-hover-glow">
          <div className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selesai</p>
                <p className="text-3xl font-bold mt-2 text-green-600"><AnimatedNumber value={stats?.selesai || 0} delay={500} /></p>
                <p className="text-xs text-muted-foreground mt-1">hari ini</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200" style={{ boxShadow: '0 4px 12px -2px rgba(34,197,94,0.3)' }}>
                <SafeIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-300" />
          </div>
        </Tilt3DCard>
      </div>

      {/* Filters Card with Glass Effect */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          Filter & Pencarian
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <SafeIcon
              name="Search"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Cari ID pesanan, pangkalan, atau jenis LPG..."
              className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-11 bg-background/50 border-border/50">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</SelectItem>
              <SelectItem value="DIPROSES">Diproses</SelectItem>
              <SelectItem value="DIKIRIM">Sedang Dikirim</SelectItem>
              <SelectItem value="SELESAI">Selesai</SelectItem>
              <SelectItem value="BATAL">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table with Premium Card */}
      <div className="chart-card-premium rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-lg font-semibold">Daftar Pesanan</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Total {filteredOrders.length} pesanan ditampilkan
          </p>
        </div>
        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">ID Pesanan</TableHead>
                    <TableHead className="font-semibold">Pangkalan</TableHead>
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="text-right font-semibold">Qty</TableHead>
                    <TableHead className="text-right font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Tanggal</TableHead>
                    <TableHead className="text-right font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-primary font-mono">
                          {formatOrderCode(order)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {order.pangkalans?.name || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {getItemsSummary(order)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {getTotalQty(order)} unit
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="status" className={statusColors[order.current_status]}>
                            {statusLabels[order.current_status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            <a href={`/detail-pesanan?id=${order.id}`} className="flex items-center justify-center gap-2">
                              <SafeIcon name="Eye" className="h-4 w-4" />
                              Lihat
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <SafeIcon name="Inbox" className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">Tidak ada pesanan yang ditemukan</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <SafeIcon name="ChevronLeft" className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <SafeIcon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
