/**
 * OrderDetailsContent - LEGACY/DEMO component with mock data
 * 
 * NOTE: File ini hanya untuk demo/preview dengan mock data.
 * Untuk real implementation, gunakan OrderDetailContent.tsx (tanpa 's')
 * yang sudah terintegrasi dengan API.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import OrderItemsTable from './OrderItemsTable'
import OrderTimelineStatus from './OrderTimelineStatus'
import { formatCurrency } from '@/lib/currency'

// Mock order data dengan interface yang benar
const mockOrder = {
  id: 'ORD-2024-001234',
  createdDate: '15 Januari 2024',
  createdTime: '10:30',
  status: 'processing',
  statusLabel: 'Sedang Diproses',
  baseName: 'Pangkalan Maju Jaya',
  baseAddress: 'Jl. Raya Utama No. 123, Jakarta Selatan',
  basePhone: '021-1234567',
  baseContact: 'Budi Santoso',
  items: [
    { id: 1, type: '3kg', quantity: 50, price: 75000, subtotal: 3750000 },
    { id: 2, type: '12kg', quantity: 20, price: 250000, subtotal: 5000000 },
  ],
  subtotal: 8750000,
  tax: 875000,
  total: 9625000,
  paidAmount: 0,
  paymentStatus: 'pending' as const,
  paymentMethod: null as string | null,
  timeline: [
    { status: 'created', label: 'Pesanan Dibuat', date: '2024-01-15 10:30', completed: true },
    { status: 'confirmed', label: 'Pesanan Dikonfirmasi', date: '2024-01-15 11:00', completed: true },
    { status: 'payment', label: 'Menunggu Pembayaran', date: null, completed: false },
    { status: 'assigned', label: 'Driver Ditugaskan', date: null, completed: false },
    { status: 'delivered', label: 'Pengiriman Selesai', date: null, completed: false },
  ],
  notes: 'Pesanan reguler, pengiriman standar',
}

export default function OrderDetailsContent() {
  const [order] = useState(mockOrder)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            className="h-10 w-10"
          >
            <SafeIcon name="ArrowLeft" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detail Pesanan</h1>
            <p className="text-muted-foreground">Pesanan {order.id}</p>
          </div>
        </div>
        <Badge className={`text-base px-4 py-2 ${getStatusColor(order.status)}`}>
          {order.statusLabel}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left Side (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Item Pesanan</CardTitle>
              <CardDescription>Daftar LPG yang dipesan</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderItemsTable items={order.items} />
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline Status</CardTitle>
              <CardDescription>Riwayat perubahan status pesanan</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTimelineStatus timeline={order.timeline} />
            </CardContent>
          </Card>

          {/* Notes Section */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Catatan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Base Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Pangkalan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama Pangkalan</p>
                <p className="text-sm font-semibold">{order.baseName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                <p className="text-sm">{order.baseAddress}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kontak</p>
                <p className="text-sm font-semibold">{order.baseContact}</p>
                <p className="text-sm text-muted-foreground">{order.basePhone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card - Inline to avoid interface mismatch */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tanggal</span>
                <span className="font-medium">{order.createdDate} {order.createdTime}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">PPN 12%</span>
                <span className="font-medium">{formatCurrency(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(order.total)}</span>
              </div>
              <Separator />
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Status Pembayaran</p>
                <Badge variant={order.paymentStatus === 'pending' ? 'outline' : 'default'}>
                  {order.paymentStatus === 'pending' ? 'Belum Dibayar' : 'Sudah Dibayar'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - Inline instead of using OrderActionsPanel */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" variant="outline">
                <SafeIcon name="Printer" className="mr-2 h-4 w-4" />
                Cetak Invoice
              </Button>
              <Button className="w-full">
                <SafeIcon name="CreditCard" className="mr-2 h-4 w-4" />
                Catat Pembayaran
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
