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
import { ordersApi, type Order, type OrderStatus } from '@/lib/api'

/**
 * Status labels for display
 */
const statusLabels: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  DIPROSES: 'Diproses',
  SIAP_KIRIM: 'Siap Kirim',
  DIKIRIM: 'Dikirim',
  SELESAI: 'Selesai',
  BATAL: 'Dibatalkan',
}

/**
 * Status badge colors
 */
const statusColors: Record<OrderStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  MENUNGGU_PEMBAYARAN: 'bg-yellow-100 text-yellow-700',
  DIPROSES: 'bg-blue-100 text-blue-700',
  SIAP_KIRIM: 'bg-purple-100 text-purple-700',
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

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    menungguPembayaran: 0,
    diproses: 0,
    selesai: 0,
    batal: 0,
  })

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

      // Update stats (fetch all untuk hitung stats)
      if (currentPage === 1 && !status) {
        calculateStats(response.data, response.meta.total)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Gagal memuat data pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Calculate stats from orders
   */
  const calculateStats = (orderList: Order[], total: number) => {
    // For accurate stats, we need to fetch all statuses
    // This is a simplified version using current page data
    setStats({
      total,
      menungguPembayaran: orderList.filter(o => o.current_status === 'MENUNGGU_PEMBAYARAN').length,
      diproses: orderList.filter(o => o.current_status === 'DIPROSES').length,
      selesai: orderList.filter(o => o.current_status === 'SELESAI').length,
      batal: orderList.filter(o => o.current_status === 'BATAL').length,
    })
  }

  // Fetch on mount and filter change
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
   * Format date
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pesanan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pesanan masuk dengan mudah
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          <a href="/buat-pesanan">
            <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
            Buat Pesanan
          </a>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Tilt3DCard className="animate-fadeInUp">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardContent>
        </Tilt3DCard>

        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Menunggu Bayar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.menungguPembayaran}</p>
          </CardContent>
        </Tilt3DCard>

        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Diproses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.diproses}</p>
          </CardContent>
        </Tilt3DCard>

        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{stats.selesai}</p>
          </CardContent>
        </Tilt3DCard>

        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dibatalkan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{stats.batal}</p>
          </CardContent>
        </Tilt3DCard>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <SafeIcon
                name="Search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Cari ID pesanan, pangkalan, atau jenis LPG..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</SelectItem>
                <SelectItem value="DIPROSES">Diproses</SelectItem>
                <SelectItem value="SIAP_KIRIM">Siap Kirim</SelectItem>
                <SelectItem value="DIKIRIM">Dikirim</SelectItem>
                <SelectItem value="SELESAI">Selesai</SelectItem>
                <SelectItem value="BATAL">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          <CardDescription>
            Total {filteredOrders.length} pesanan ditampilkan
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        <TableCell className="font-medium text-primary">
                          {order.id.slice(0, 8)}...
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
                          <Badge className={statusColors[order.current_status]}>
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
        </CardContent>
      </Card>
    </div>
  )
}
