/**
 * OrdersListPage - Daftar Pesanan dengan API Integration
 * 
 * PENJELASAN:
 * Component ini menampilkan daftar pesanan dengan UI original
 * tetapi data diambil dari API backend:
 * - Fetch orders dari API dengan pagination
 * - Map API response ke format UI original
 * - Support search dan filter
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import OrdersListTable from './OrdersListTable'
import { ordersApi, type Order as ApiOrder, type OrderStatus } from '@/lib/api'
import { toast } from 'sonner'

// Interface sesuai dengan OrdersListTable
interface OrderItem {
  type: string
  quantity: number
}

interface Order {
  id: string
  apiId: string
  pangkalan: string
  items: OrderItem[]
  qty: number
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  tanggal: string
}

// Status mapping dari backend ke UI
const API_TO_UI_STATUS: Record<OrderStatus, 'pending' | 'processing' | 'completed' | 'cancelled'> = {
  DRAFT: 'pending',
  MENUNGGU_PEMBAYARAN: 'pending',
  DIPROSES: 'processing',
  SIAP_KIRIM: 'processing',
  DIKIRIM: 'processing',
  SELESAI: 'completed',
  BATAL: 'cancelled',
}

const UI_TO_API_STATUS: Record<string, OrderStatus | undefined> = {
  all: undefined,
  pending: 'MENUNGGU_PEMBAYARAN',
  processing: 'DIPROSES',
  completed: 'SELESAI',
  cancelled: 'BATAL',
}

// Helper: Map API order ke UI format
function mapApiToUI(apiOrder: ApiOrder): Order {
  const totalQty = apiOrder.order_items.reduce((sum, item) => sum + item.qty, 0)

  return {
    id: (apiOrder as any).code || apiOrder.id.substring(0, 12),
    apiId: apiOrder.id,
    pangkalan: apiOrder.pangkalans?.name || 'Unknown',
    items: apiOrder.order_items.map(item => ({
      type: item.label || item.lpg_type,
      quantity: item.qty
    })),
    qty: totalQty,
    total: apiOrder.total_amount,
    status: API_TO_UI_STATUS[apiOrder.current_status] || 'pending',
    tanggal: new Date(apiOrder.created_at).toISOString().split('T')[0]
  }
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalOrders, setTotalOrders] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const apiStatus = UI_TO_API_STATUS[statusFilter]
        const response = await ordersApi.getAll(1, 100, apiStatus)

        const mappedOrders = response.data.map(mapApiToUI)
        setOrders(mappedOrders)
        setTotalOrders(response.meta.total)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        toast.error('Gagal memuat data pesanan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [statusFilter])

  // Client-side search filter
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders

    return orders.filter(order => {
      const itemsText = order.items.map(item => item.type).join(' ').toLowerCase()
      return (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pangkalan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemsText.includes(searchTerm.toLowerCase())
      )
    })
  }, [orders, searchTerm])

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pesanan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pesanan LPG Anda dengan mudah
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto gap-2">
          <a href="/buat-pesanan">
            <SafeIcon name="Plus" className="h-4 w-4" />
            Buat Pesanan
          </a>
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Cari Pesanan</label>
          <div className="relative">
            <SafeIcon
              name="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder="Cari ID pesanan, pangkalan, atau jenis LPG..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <label className="text-sm font-medium mb-2 block">Filter Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Belum Dibayar</SelectItem>
              <SelectItem value="processing">Diproses</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
            Memuat pesanan...
          </span>
        ) : (
          `Menampilkan ${filteredOrders.length} dari ${totalOrders} pesanan`
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Memuat data pesanan...</span>
        </div>
      ) : (
        <OrdersListTable orders={filteredOrders} />
      )}
    </div>
  )
}
