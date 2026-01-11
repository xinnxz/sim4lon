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
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <SafeIcon name="Truck" className="h-4 w-4 text-indigo-500" />
          Informasi Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Status Pengiriman</p>
          <Badge
            variant="status"
            className={`mt-1 text-xs ${delivery.status === 'not_scheduled' || delivery.status === 'ready_to_ship'
              ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
              delivery.status === 'scheduled'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                delivery.status === 'in_delivery' || delivery.status === 'assigned'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              }`}
          >
            {delivery.statusLabel}
          </Badge>
        </div>

        {delivery.driver ? (
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Driver</p>
            <p className="font-medium text-sm sm:text-base">{delivery.driver}</p>
            {delivery.driverPhone && (
              <a
                href={`tel:${delivery.driverPhone}`}
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 mt-1"
              >
                <SafeIcon name="Phone" className="h-3 w-3 sm:h-4 sm:w-4" />
                {delivery.driverPhone}
              </a>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Driver</p>
            <p className="text-xs sm:text-sm text-muted-foreground italic">Belum ditugaskan</p>
          </div>
        )}

        {delivery.estimatedDate ? (
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Tanggal Estimasi</p>
            <p className="font-medium text-sm sm:text-base">{delivery.estimatedDate}</p>
          </div>
        ) : null}

        <div className="bg-secondary/50 p-2 sm:p-3 rounded-lg">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Catatan</p>
          <p className="text-xs sm:text-sm">{delivery.notes}</p>
        </div>
      </CardContent>
    </Card>
  )
}
