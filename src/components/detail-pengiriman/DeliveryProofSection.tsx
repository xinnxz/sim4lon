
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface DeliveryProof {
  image: string
  timestamp: string
  notes: string
}

interface DeliveryProofSectionProps {
  proof: DeliveryProof
}

export default function DeliveryProofSection({ proof }: DeliveryProofSectionProps) {
  return (
    <Card className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SafeIcon name="Image" className="h-5 w-5 text-primary" />
          Bukti Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proof Image */}
        <div className="relative overflow-hidden rounded-lg bg-muted">
          <img
            src={proof.image}
            alt="Bukti pengiriman"
            className="h-64 w-full object-cover"
          />
        </div>

        {/* Proof Details */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              Waktu Pengiriman
            </span>
            <span className="text-sm font-semibold text-foreground">
              {proof.timestamp}
            </span>
          </div>
          {proof.notes && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Catatan
              </span>
              <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-md">
                {proof.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
