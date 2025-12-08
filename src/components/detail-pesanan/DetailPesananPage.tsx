
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import OrderSummaryCard from '@/components/detail-pesanan/OrderSummaryCard'
import OrderDetailsCard from '@/components/detail-pesanan/OrderDetailsCard'
import CustomerInfoCard from '@/components/detail-pesanan/CustomerInfoCard'
import StatusTimeline from '@/components/detail-pesanan/StatusTimeline'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MOCK_DRIVER_LIST } from '@/data/user'

// Mock order data
const mockOrder = {
  id: 'PES-2024-12345',
  date: '2024-01-15',
  status: 'Menunggu Pembayaran',
  statusCode: 'pending_payment',
  pangkalan: {
    name: 'Pangkalan Maju Jaya',
    address: 'Jl. Raya Utama No. 123, Jakarta Selatan',
    phone: '(021) 555-1234',
    contact: 'Budi Santoso'
  },
  items: [
    { id: 1, type: 'LPG 3kg', quantity: 50, price: 45000, subtotal: 2250000 },
    { id: 2, type: 'LPG 12kg', quantity: 20, price: 120000, subtotal: 2400000 }
  ],
  total: 4650000,
  paymentMethod: null,
  paymentStatus: 'Belum Dibayar',
  timeline: [
{ status: 'Pesanan Dibuat', date: '2024-01-15 10:30', completed: true },
    { status: 'Menunggu Pembayaran', date: '2024-01-15 10:30', completed: true },
    { status: 'Pembayaran Diterima', date: null, completed: false },
    { status: 'Siap Dikirim', date: null, completed: false },
    { status: 'Dalam Pengiriman', date: null, completed: false },
    { status: 'Selesai', date: null, completed: false }
  ]
}

export default function DetailPesananPage() {
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePrintOrderDetails = () => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.print()
      }, 100)
    }
  }

  const handleSendOrderViaWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const orderDetails = `
Pesanan ${mockOrder.id}

Detail Pesanan:
${mockOrder.items.map(item => `- ${item.type}: ${item.quantity} unit @ Rp ${item.price.toLocaleString('id-ID')} = Rp ${item.subtotal.toLocaleString('id-ID')}`).join('\n')}

Total: Rp ${mockOrder.total.toLocaleString('id-ID')}
Status: ${mockOrder.status}
Tanggal: ${new Date(mockOrder.date).toLocaleDateString('id-ID')}

Pelanggan: ${mockOrder.pangkalan.contact}
Lokasi: ${mockOrder.pangkalan.address}
`.trim()
      
      const encodedMessage = encodeURIComponent(orderDetails)
      const phone = mockOrder.pangkalan.phone.replace(/\D/g, '')
      const whatsappUrl = `https://wa.me/62${phone.replace(/^0/, '')}?text=${encodedMessage}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleSelectDriver = (driverId: string) => {
    setSelectedDriver(driverId)
    setIsDriverModalOpen(false)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="./daftar-pesanan.html">
            <Button variant="ghost" size="icon">
              <SafeIcon name="ArrowLeft" className="h-5 w-5" />
            </Button>
          </a>
          <div>
            <h1 className="text-3xl font-bold">Detail Pesanan</h1>
            <p className="text-muted-foreground">Pesanan {mockOrder.id}</p>
          </div>
        </div>
        <Badge className={`text-base px-3 py-1 ${getStatusColor(mockOrder.statusCode)}`}>
          {mockOrder.status}
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <OrderSummaryCard order={mockOrder} />
          <OrderDetailsCard items={mockOrder.items} total={mockOrder.total} />
          <CustomerInfoCard customer={mockOrder.pangkalan} />
          <StatusTimeline timeline={mockOrder.timeline} />
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-semibold">Tindakan</h3>
            <div className="space-y-3">
<a href="./catat-pembayaran.html" className="block">
                <Button className="w-full" variant="default">
                  <SafeIcon name="CreditCard" className="mr-2 h-4 w-4" />
                  Catat Pembayaran
                </Button>
              </a>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setIsDriverModalOpen(true)}
              >
                <SafeIcon name="Users" className="mr-2 h-4 w-4" />
                Tugaskan Driver
              </Button>
<Button 
                 className="w-full" 
                 variant="outline"
                 onClick={handlePrintOrderDetails}
               >
                 <SafeIcon name="Printer" className="mr-2 h-4 w-4" />
                 Cetak Invoice
               </Button>
<a href="./nota-pembayaran.html" className="block">
                <Button 
                 className="w-full" 
                 variant="outline"
               >
                 <SafeIcon name="Printer" className="mr-2 h-4 w-4" />
                 Cetak Nota
               </Button>
              </a>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="rounded-lg border bg-card p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-semibold">Ringkasan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Pesanan:</span>
                <span className="font-medium">{mockOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal:</span>
                <span className="font-medium">{new Date(mockOrder.date).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status Pembayaran:</span>
                <span className="font-medium text-yellow-600">{mockOrder.paymentStatus}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-primary">Rp {mockOrder.total.toLocaleString('id-ID')}</span>
              </div>
            </div>
</div>

          {/* Driver Assignment Modal */}
          <Dialog open={isDriverModalOpen} onOpenChange={setIsDriverModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Pilih Driver</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {MOCK_DRIVER_LIST.map((driver) => (
                  <button
                    key={driver.userId}
                    onClick={() => handleSelectDriver(driver.userId)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={driver.avatarUrl} alt={driver.nama} />
                      <AvatarFallback>{driver.nama.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{driver.nama}</p>
                      <p className="text-xs text-muted-foreground">{driver.telepon}</p>
                    </div>
                    {selectedDriver === driver.userId && (
                      <SafeIcon name="Check" className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
