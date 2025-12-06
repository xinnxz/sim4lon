
import { Badge } from '@/components/ui/badge'

interface InvoiceSummaryProps {
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  paymentStatus: string
  paymentMethod: string
  paymentDate: string
}

export default function InvoiceSummary({
  subtotal,
  tax,
  shippingCost,
  total,
  paymentStatus,
  paymentMethod,
  paymentDate,
}: InvoiceSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lunas':
      case 'paid':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'pending':
        return 'bg-accent/20 text-accent-foreground border-accent/30'
      case 'belum dibayar':
      case 'unpaid':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-secondary text-foreground border-border'
    }
  }

  return (
    <div className="space-y-6">
      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pajak (10%):</span>
            <span className="text-foreground">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biaya Pengiriman:</span>
            <span className="text-foreground">{formatCurrency(shippingCost)}</span>
          </div>
          <div className="border-t-2 border-primary/20 pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Total:</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="grid grid-cols-3 gap-4 bg-secondary/30 p-4 rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status Pembayaran</p>
          <Badge className={`${getStatusColor(paymentStatus)} border`}>
            {paymentStatus}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Metode Pembayaran</p>
          <p className="text-sm font-semibold text-foreground">{paymentMethod}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tanggal Pembayaran</p>
          <p className="text-sm font-semibold text-foreground">{formatDate(paymentDate)}</p>
        </div>
      </div>
    </div>
  )
}
