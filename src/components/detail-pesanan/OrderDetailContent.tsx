/**
 * OrderDetailContent - Detail pesanan dengan API integration
 * 
 * PENJELASAN:
 * Component ini menampilkan detail pesanan dengan UI original
 * tetapi data diambil dari API backend:
 * - Fetch order dari API berdasarkan ID URL
 * - Map API response ke struktur UI original
 * - Update status via API
 * - Assign driver via API
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import SafeIcon from '@/components/common/SafeIcon'
import OrderSummaryCard from './OrderSummaryCard'
import OrderItemsTable from './OrderItemsTable'
import OrderTimelineStatus from './OrderTimelineStatus'
import OrderActionsPanel from './OrderActionsPanel'
import CustomerInfoCard from './CustomerInfoCard'
import DeliveryInfoCard from './DeliveryInfoCard'
import { ordersApi, driversApi, type Order as ApiOrder, type Driver, type OrderStatus } from '@/lib/api'
import { toast } from 'sonner'

// Status mapping dari backend ke UI
const STATUS_MAP: Record<OrderStatus, { status: string; label: string }> = {
  DRAFT: { status: 'created', label: 'Draft' },
  MENUNGGU_PEMBAYARAN: { status: 'pending_payment', label: 'Menunggu Pembayaran' },
  DIPROSES: { status: 'payment_confirmed', label: 'Pembayaran Diterima' },
  SIAP_KIRIM: { status: 'ready_to_ship', label: 'Siap Dikirim' },
  DIKIRIM: { status: 'driver_assigned', label: 'Driver Ditugaskan' },
  SELESAI: { status: 'completed', label: 'Pesanan Selesai' },
  BATAL: { status: 'cancelled', label: 'Dibatalkan' },
}

// Interface untuk UI order structure
interface UIOrder {
  id: string
  apiId: string
  status: string
  statusLabel: string
  createdDate: string
  createdTime: string
  customer: {
    name: string
    address: string
    email: string
    contact: string
    contactPhone: string
  }
  items: { id: number; type: string; quantity: number; price: number; subtotal: number }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string | null
  paidAmount: number
  delivery: {
    status: string
    statusLabel: string
    driver: string | null
    driverPhone: string | null
    estimatedDate: string | null
    notes: string
  }
  timeline: { status: string; label: string; date: string | null; completed: boolean }[]
}

// Helper: Map API order ke UI structure
function mapApiToUI(apiOrder: ApiOrder): UIOrder {
  const statusInfo = STATUS_MAP[apiOrder.current_status] || { status: 'unknown', label: 'Unknown' }
  const createdAt = new Date(apiOrder.created_at)

  return {
    id: (apiOrder as any).code || apiOrder.id.substring(0, 12),
    apiId: apiOrder.id,
    status: statusInfo.status,
    statusLabel: statusInfo.label,
    createdDate: createdAt.toLocaleDateString('id-ID'),
    createdTime: createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    customer: {
      name: apiOrder.pangkalans?.name || 'Unknown',
      address: apiOrder.pangkalans?.address || '-',
      email: '-',
      contact: apiOrder.pangkalans?.pic_name || '-',
      contactPhone: apiOrder.pangkalans?.phone || '-'
    },
    items: apiOrder.order_items.map((item, idx) => ({
      id: idx + 1,
      type: item.label || item.lpg_type,
      quantity: item.qty,
      price: item.price_per_unit,
      subtotal: item.sub_total
    })),
    subtotal: (apiOrder as any).subtotal || apiOrder.total_amount,
    tax: (apiOrder as any).tax_amount || 0,
    total: apiOrder.total_amount,
    paymentMethod: null,
    paidAmount: 0,
    delivery: {
      status: apiOrder.drivers ? 'assigned' : 'not_scheduled',
      statusLabel: apiOrder.drivers ? 'Driver Ditugaskan' : 'Belum Dijadwalkan',
      driver: apiOrder.drivers?.name || null,
      driverPhone: apiOrder.drivers?.phone || null,
      estimatedDate: null,
      notes: apiOrder.note || 'Tidak ada catatan'
    },
    timeline: buildTimeline(apiOrder)
  }
}

// Helper: Build timeline from API timeline_tracks
function buildTimeline(apiOrder: ApiOrder) {
  const baseTimeline = [
    { status: 'created', label: 'Pesanan Dibuat', date: null as string | null, completed: false },
    { status: 'pending_payment', label: 'Menunggu Pembayaran', date: null as string | null, completed: false },
    { status: 'payment_confirmed', label: 'Pembayaran Diterima', date: null as string | null, completed: false },
    { status: 'driver_assigned', label: 'Driver Ditugaskan', date: null as string | null, completed: false },
    { status: 'completed', label: 'Pesanan Selesai', date: null as string | null, completed: false },
  ]

  // Mark created as completed
  baseTimeline[0].completed = true
  baseTimeline[0].date = new Date(apiOrder.created_at).toLocaleString('id-ID')

  // Update based on timeline_tracks from API
  if (apiOrder.timeline_tracks) {
    apiOrder.timeline_tracks.forEach(track => {
      const mappedStatus = STATUS_MAP[track.status]?.status
      const idx = baseTimeline.findIndex(t => t.status === mappedStatus)
      if (idx !== -1) {
        baseTimeline[idx].completed = true
        baseTimeline[idx].date = new Date(track.created_at).toLocaleString('id-ID')
      }
    })
  }

  return baseTimeline
}

export default function OrderDetailContent() {
  const [order, setOrder] = useState<UIOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  // Get order ID from URL
  const getOrderId = () => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
  }

  // Fetch order and drivers on mount
  useEffect(() => {
    const fetchData = async () => {
      const orderId = getOrderId()
      if (!orderId) {
        toast.error('ID pesanan tidak ditemukan')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const [apiOrder, driversRes] = await Promise.all([
          ordersApi.getById(orderId),
          driversApi.getAll(1, 100, undefined, true)
        ])

        setOrder(mapApiToUI(apiOrder))
        setDrivers(driversRes.data)
      } catch (error) {
        console.error('Failed to fetch order:', error)
        toast.error('Gagal memuat data pesanan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // API: Update status
  const updateStatus = async (newStatus: OrderStatus, description: string) => {
    if (!order) return

    try {
      setIsUpdating(true)
      const updated = await ordersApi.updateStatus(order.apiId, { status: newStatus, description })
      setOrder(mapApiToUI(updated))
      toast.success(`Status diubah ke ${STATUS_MAP[newStatus].label}`)
    } catch (error: any) {
      console.error('Failed to update status:', error)
      toast.error(error.message || 'Gagal mengubah status')
    } finally {
      setIsUpdating(false)
    }
  }

  // Handlers
  const handlePaymentClick = () => {
    window.location.href = `/catat-pembayaran?id=${order?.apiId}`
  }

  const handlePaymentConfirmed = async () => {
    await updateStatus('DIPROSES', 'Pembayaran dikonfirmasi')
  }

  const handlePrintInvoice = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleSendWhatsApp = () => {
    if (!order) return
    const message = `Halo, berikut adalah detail pesanan Anda:\n\nID Pesanan: ${order.id}\nTotal: Rp ${order.total.toLocaleString('id-ID')}\n\nTerima kasih telah memesan.`
    const whatsappUrl = `https://wa.me/${order.customer.contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSelectDriver = async (driverId: string) => {
    if (!order) return

    try {
      setIsUpdating(true)
      const updated = await ordersApi.update(order.apiId, { driver_id: driverId })
      setOrder(mapApiToUI(updated))
      setIsDriverModalOpen(false)
      toast.success('Driver berhasil ditugaskan')
    } catch (error: any) {
      console.error('Failed to assign driver:', error)
      toast.error(error.message || 'Gagal menugaskan driver')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCompleteOrder = async () => {
    await updateStatus('SELESAI', 'Pesanan selesai')
  }

  const handleConfirmOrder = async () => {
    await updateStatus('MENUNGGU_PEMBAYARAN', 'Pesanan dikonfirmasi, menunggu pembayaran')
  }

  const handleEditOrder = () => {
    if (order) {
      window.location.href = `/buat-pesanan?id=${order.apiId}`
    }
  }

  const handleCancelOrder = () => {
    setIsCancelModalOpen(true)
  }

  const confirmCancelOrder = async () => {
    await updateStatus('BATAL', 'Pesanan dibatalkan')
    setIsCancelModalOpen(false)
    window.location.href = '/daftar-pesanan'
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Memuat detail pesanan...</span>
      </div>
    )
  }

  // Error state
  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <SafeIcon name="AlertCircle" className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-semibold">Pesanan Tidak Ditemukan</h2>
        <Button onClick={() => window.location.href = '/daftar-pesanan'}>
          <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
          Kembali ke Daftar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = '/daftar-pesanan'}
          >
            <SafeIcon name="ArrowLeft" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detail Pesanan</h1>
            <p className="text-muted-foreground font-mono">ID: {order.id}</p>
          </div>
        </div>
        <Badge
          className={`text-base px-4 py-2 ${order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'payment_confirmed' ? 'bg-blue-100 text-blue-800' :
              order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
            }`}
        >
          {order.statusLabel}
        </Badge>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <OrderSummaryCard order={order} />

          {/* Timeline Status */}
          <OrderTimelineStatus timeline={order.timeline} />
        </div>

        {/* Right Column - Info Cards & Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <CustomerInfoCard customer={order.customer} />

          {/* Delivery Info */}
          <DeliveryInfoCard delivery={order.delivery} />

          {/* Actions Panel */}
          <OrderActionsPanel
            orderStatus={order.status}
            onPaymentClick={handlePaymentClick}
            onPaymentConfirmed={handlePaymentConfirmed}
            onPrintInvoice={handlePrintInvoice}
            onSendWhatsApp={handleSendWhatsApp}
            onDriverAssignClick={() => setIsDriverModalOpen(true)}
            onCompleteOrder={handleCompleteOrder}
            onEditOrder={handleEditOrder}
            onCancelOrder={handleCancelOrder}
            onConfirmOrder={handleConfirmOrder}
            isPaymentConfirmed={order.status === 'payment_confirmed'}
            isDriverAssigned={order.delivery.driver !== null}
          />
        </div>
      </div>

      {/* Driver Assignment Modal - Now with API drivers */}
      <Dialog open={isDriverModalOpen} onOpenChange={setIsDriverModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {drivers.map((driver) => (
              <button
                key={driver.id}
                onClick={() => handleSelectDriver(driver.id)}
                disabled={isUpdating}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left disabled:opacity-50"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">{driver.phone || '-'}</p>
                </div>
                {selectedDriverId === driver.id && (
                  <SafeIcon name="Check" className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SafeIcon name="AlertCircle" className="h-5 w-5 text-destructive" />
              Batalkan Pesanan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm font-medium text-destructive mb-2">Tindakan ini tidak dapat dibatalkan</p>
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin membatalkan pesanan <span className="font-semibold">{order.id}</span>? Pesanan akan ditandai sebagai dibatalkan dan tidak dapat diproses lebih lanjut.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsCancelModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={confirmCancelOrder}
                variant="destructive"
                className="flex-1"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SafeIcon name="Trash2" className="mr-2 h-4 w-4" />
                )}
                Batalkan Pesanan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}