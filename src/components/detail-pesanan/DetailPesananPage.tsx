/**
 * DetailPesananPage - Halaman Detail Pesanan dengan Data Real
 * 
 * PENJELASAN:
 * Component ini menampilkan detail pesanan dengan:
 * - Fetch data dari API berdasarkan ID di URL
 * - Tampilkan info pangkalan, items, timeline
 * - Tombol aksi untuk update status
 * - Assign driver
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import SafeIcon from '@/components/common/SafeIcon'
import OrderActionsPanel from '@/components/detail-pesanan/OrderActionsPanel'
import { toast } from 'sonner'
import {
  ordersApi,
  driversApi,
  type Order,
  type OrderStatus,
  type Driver
} from '@/lib/api'

/**
 * Status labels for display
 */
const statusLabels: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  DIPROSES: 'Diproses',
  SIAP_KIRIM: 'Siap Kirim', // Legacy
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

export default function DetailPesananPage() {
  // Data state
  const [order, setOrder] = useState<Order | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Modal state
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)

  /**
   * Get order ID from URL
   */
  const getOrderId = (): string | null => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
  }

  /**
   * Fetch order data
   */
  const fetchOrder = async () => {
    const orderId = getOrderId()
    if (!orderId) {
      toast.error('ID pesanan tidak ditemukan')
      window.location.href = '/daftar-pesanan'
      return
    }

    try {
      setIsLoading(true)
      const orderData = await ordersApi.getById(orderId)
      setOrder(orderData)
    } catch (error: any) {
      console.error('Failed to fetch order:', error)
      toast.error(error.message || 'Gagal memuat data pesanan')
      window.location.href = '/daftar-pesanan'
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fetch drivers for assignment
   */
  const fetchDrivers = async () => {
    try {
      const response = await driversApi.getAll(1, 50, undefined, true)
      setDrivers(response.data)
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
    }
  }

  useEffect(() => {
    fetchOrder()
    fetchDrivers()
  }, [])

  /**
   * Handle status change
   */
  const handleStatusChange = async (newStatus: OrderStatus, description: string) => {
    if (!order) return

    try {
      setIsUpdating(true)
      const updated = await ordersApi.updateStatus(order.id, {
        status: newStatus,
        description,
      })
      setOrder(updated)
      toast.success(`Status berhasil diubah ke ${statusLabels[newStatus]}`)
    } catch (error: any) {
      console.error('Failed to update status:', error)
      toast.error(error.message || 'Gagal mengubah status')
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Handle driver assignment
   */
  const handleAssignDriver = async (driverId: string) => {
    if (!order) return

    try {
      setIsUpdating(true)
      const updated = await ordersApi.update(order.id, { driver_id: driverId })
      setOrder(updated)
      setIsDriverModalOpen(false)
      toast.success('Driver berhasil ditugaskan')
    } catch (error: any) {
      console.error('Failed to assign driver:', error)
      toast.error(error.message || 'Gagal menugaskan driver')
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Handle print invoice
   */
  const handlePrintInvoice = () => {
    window.print()
  }

  /**
   * Handle send WhatsApp
   */
  const handleSendWhatsApp = () => {
    if (!order || !order.pangkalans) return

    const itemsText = order.order_items
      .map(item => `- ${item.label}: ${item.qty} x Rp ${item.price_per_unit.toLocaleString('id-ID')}`)
      .join('\n')

    const message = `
*Pesanan ${order.id.slice(0, 8)}*

${itemsText}

*Total: Rp ${order.total_amount.toLocaleString('id-ID')}*
Status: ${statusLabels[order.current_status]}
`.trim()

    const phone = order.pangkalans.phone?.replace(/\D/g, '') || ''
    const whatsappUrl = `https://wa.me/62${phone.replace(/^0/, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  /**
   * Handle edit order
   */
  const handleEditOrder = () => {
    if (!order) return
    window.location.href = `/buat-pesanan?id=${order.id}`
  }

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <SafeIcon name="Loader2" className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Memuat detail pesanan...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <SafeIcon name="AlertCircle" className="h-8 w-8 mx-auto text-destructive" />
          <p className="mt-2 text-muted-foreground">Pesanan tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/daftar-pesanan">
            <Button variant="ghost" size="icon">
              <SafeIcon name="ArrowLeft" className="h-5 w-5" />
            </Button>
          </a>
          <div>
            <h1 className="text-3xl font-bold">Detail Pesanan</h1>
            <p className="text-muted-foreground">{order.id.slice(0, 8)}...</p>
          </div>
        </div>
        <Badge variant="status" className={`text-base px-3 py-1 ${statusColors[order.current_status]}`}>
          {statusLabels[order.current_status]}
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pangkalan Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pangkalan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama</span>
                <span className="font-medium">{order.pangkalans?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alamat</span>
                <span className="font-medium text-right">{order.pangkalans?.address || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telepon</span>
                <span className="font-medium">{order.pangkalans?.phone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PIC</span>
                <span className="font-medium">{order.pangkalans?.pic_name || '-'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Item Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.qty} x {formatCurrency(item.price_per_unit)}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.sub_total)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Driver Info */}
          {order.drivers && (
            <Card>
              <CardHeader>
                <CardTitle>Info Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{order.drivers.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{order.drivers.name}</p>
                    <p className="text-sm text-muted-foreground">{order.drivers.phone || 'No phone'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          {order.timeline_tracks && order.timeline_tracks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline_tracks.map((track, index) => (
                    <div key={track.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        {index < order.timeline_tracks!.length - 1 && (
                          <div className="w-0.5 h-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium">{statusLabels[track.status] || track.status}</p>
                        <p className="text-sm text-muted-foreground">{track.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(track.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Note */}
          {order.note && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-4">
          <OrderActionsPanel
            orderStatus={order.current_status}
            onPrintInvoice={handlePrintInvoice}
            onSendWhatsApp={handleSendWhatsApp}
            onEditOrder={handleEditOrder}
          />

          {/* Assign Driver Button */}
          {!order.drivers && order.current_status !== 'SELESAI' && order.current_status !== 'BATAL' && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setIsDriverModalOpen(true)}
                  disabled={isUpdating}
                >
                  <SafeIcon name="Users" className="mr-2 h-4 w-4" />
                  Tugaskan Driver
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Pesanan:</span>
                <span className="font-medium">{order.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal:</span>
                <span className="font-medium">{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">{statusLabels[order.current_status]}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Driver Assignment Modal */}
      <Dialog open={isDriverModalOpen} onOpenChange={setIsDriverModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {drivers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Tidak ada driver aktif</p>
            ) : (
              drivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => handleAssignDriver(driver.id)}
                  disabled={isUpdating}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left disabled:opacity-50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.phone || 'No phone'}</p>
                  </div>
                  {order?.driver_id === driver.id && (
                    <SafeIcon name="Check" className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
