
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import DeliveryInfoCard from './DeliveryInfoCard'
import DeliveryTimeline from './DeliveryTimeline'
import DeliveryProofSection from './DeliveryProofSection'
import DeliveryStatusOverride from './DeliveryStatusOverride'

interface DeliveryDetail {
  id: string
  orderId: string
  baseStation: {
    name: string
    address: string
    phone: string
    contact: string
  }
  driver: {
    name: string
    phone: string
    vehicle: string
    licensePlate: string
  }
  status: 'pending' | 'in_transit' | 'delivered' | 'failed'
  scheduledDate: string
  actualDeliveryDate?: string
  proof?: {
    image: string
    timestamp: string
    notes: string
  }
  timeline: Array<{
    status: string
    timestamp: string
    notes: string
  }>
}

const mockDelivery: DeliveryDetail = {
  id: 'DLV-2024-001',
  orderId: 'ORD-2024-12345',
  baseStation: {
    name: 'Pangkalan Maju Jaya',
    address: 'Jl. Raya Industri No. 45, Jakarta Timur',
    phone: '(021) 5555-1234',
    contact: 'Budi Santoso'
  },
  driver: {
    name: 'Ahmad Wijaya',
    phone: '0812-3456-7890',
    vehicle: 'Truck LPG',
    licensePlate: 'B 1234 ABC'
  },
  status: 'in_transit',
  scheduledDate: '2024-01-15',
  actualDeliveryDate: undefined,
  proof: undefined,
  timeline: [
    {
      status: 'Pesanan Dikonfirmasi',
      timestamp: '2024-01-15 08:00',
      notes: 'Pesanan telah dikonfirmasi dan disiapkan'
    },
    {
      status: 'Dalam Perjalanan',
      timestamp: '2024-01-15 10:30',
      notes: 'Driver telah berangkat dari gudang'
    },
    {
      status: 'Menunggu Pengiriman',
      timestamp: '2024-01-15 14:00',
      notes: 'Tiba di lokasi pangkalan'
    }
  ]
}

const statusConfig = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
  in_transit: { label: 'Dalam Perjalanan', color: 'bg-blue-100 text-blue-800', icon: 'Truck' },
  delivered: { label: 'Terkirim', color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
  failed: { label: 'Gagal', color: 'bg-red-100 text-red-800', icon: 'AlertCircle' }
}

export default function DeliveryDetailContent() {
  const [delivery, setDelivery] = useState<DeliveryDetail>(mockDelivery)
  const [showStatusOverride, setShowStatusOverride] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    setDelivery(prev => ({
      ...prev,
      status: newStatus as any,
      timeline: [
        ...prev.timeline,
        {
          status: `Status diubah menjadi ${statusConfig[newStatus as keyof typeof statusConfig].label}`,
          timestamp: new Date().toLocaleString('id-ID'),
          notes: 'Status diubah oleh admin'
        }
      ]
    }))
    setShowStatusOverride(false)
  }

  const config = statusConfig[delivery.status]

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 animate-fadeInUp">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {delivery.id}
            </h1>
            <Badge className={config.color}>
              <SafeIcon name={config.icon} className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Pesanan: {delivery.orderId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <SafeIcon name="ArrowLeft" className="h-4 w-4" />
            Kembali
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowStatusOverride(true)}
            className="gap-2"
          >
            <SafeIcon name="Edit" className="h-4 w-4" />
            Ubah Status
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Station Info */}
          <DeliveryInfoCard
            title="Informasi Pangkalan"
            icon="Store"
            data={[
              { label: 'Nama', value: delivery.baseStation.name },
              { label: 'Alamat', value: delivery.baseStation.address },
              { label: 'Kontak', value: delivery.baseStation.contact },
              { label: 'Telepon', value: delivery.baseStation.phone }
            ]}
          />

          {/* Driver Info */}
          <DeliveryInfoCard
            title="Informasi Driver"
            icon="User"
            data={[
              { label: 'Nama', value: delivery.driver.name },
              { label: 'Telepon', value: delivery.driver.phone },
              { label: 'Kendaraan', value: delivery.driver.vehicle },
              { label: 'Plat Nomor', value: delivery.driver.licensePlate }
            ]}
          />

          {/* Delivery Proof */}
          {delivery.proof && (
            <DeliveryProofSection proof={delivery.proof} />
          )}
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-1">
          <DeliveryTimeline timeline={delivery.timeline} />
        </div>
      </div>

      {/* Status Override Modal */}
      <DeliveryStatusOverride
        open={showStatusOverride}
        onOpenChange={setShowStatusOverride}
        currentStatus={delivery.status}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
