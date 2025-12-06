
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'

interface OrderData {
  id: string
  baseStation: string
  lpgType: string
  quantity: number
  totalAmount: number
  status: string
  date: string
}

interface PaymentSummaryProps {
  order: OrderData
}

export default function PaymentSummary({ order }: PaymentSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order ID */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">ID Pesanan</p>
          <p className="font-mono font-semibold text-sm">{order.id}</p>
        </div>

        <Separator />

        {/* Base Station */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Pangkalan</p>
          <p className="text-sm font-medium">{order.baseStation}</p>
        </div>

        {/* LPG Type & Quantity */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Jenis LPG</p>
            <p className="text-sm font-medium">{order.lpgType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Jumlah</p>
            <p className="text-sm font-medium">{order.quantity} unit</p>
          </div>
        </div>

        {/* Order Date */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Tanggal Pesanan</p>
          <p className="text-sm font-medium flex items-center gap-2">
            <SafeIcon name="Calendar" className="h-4 w-4 text-muted-foreground" />
            {new Date(order.date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

<Separator />

        {/* Total Amount */}
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Total Pembayaran</p>
          <p className="text-2xl font-bold text-primary">
            Rp {order.totalAmount.toLocaleString('id-ID')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
