import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'

interface Delivery {
  status: string
  statusLabel: string
  driver: string | null
  driverPhone?: string | null
  estimatedDate: string | null
  notes: string
}

interface DeliveryInfoCardProps {
  delivery: Delivery
}

export default function DeliveryInfoCard({ delivery }: DeliveryInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informasi Pengiriman</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Status Pengiriman</p>
          <Badge
            variant="status"
            className={`mt-1 ${delivery.status === 'not_scheduled' || delivery.status === 'ready_to_ship' ? 'bg-gray-100 text-gray-700' :
              delivery.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                delivery.status === 'in_delivery' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-green-100 text-green-700'
              }`}
          >
            {delivery.statusLabel}
          </Badge>
        </div>

        {delivery.driver ? (
          <div>
            <p className="text-sm text-muted-foreground">Driver</p>
            <p className="font-medium">{delivery.driver}</p>
            {delivery.driverPhone && (
              <a
                href={`tel:${delivery.driverPhone}`}
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
              >
                <SafeIcon name="Phone" className="h-4 w-4" />
                {delivery.driverPhone}
              </a>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">Driver</p>
            <p className="text-sm text-muted-foreground italic">Belum ditugaskan</p>
          </div>
        )}

        {delivery.estimatedDate ? (
          <div>
            <p className="text-sm text-muted-foreground">Tanggal Estimasi</p>
            <p className="font-medium">{delivery.estimatedDate}</p>
          </div>
        ) : null}

        <div className="bg-secondary/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium mb-1">Catatan</p>
          <p className="text-sm">{delivery.notes}</p>
        </div>
      </CardContent>
    </Card>
  )
}