/**
 * PaymentSummary - Ringkasan pesanan di halaman pembayaran
 * 
 * PENJELASAN:
 * Menampilkan ringkasan pesanan dengan layout yang jelas:
 * - ID Pesanan dan Pangkalan
 * - Detail LPG per item dengan quantity masing-masing
 * - Total quantity dan Total pembayaran
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import { formatCurrency } from '@/lib/currency'

interface LpgItem {
  type: string
  quantity: number
}

interface OrderData {
  id: string
  baseStation: string
  lpgType: string
  quantity: number
  items?: LpgItem[] // optional for backward compatibility
  totalAmount: number
  status: string
  date: string
}

interface PaymentSummaryProps {
  order: OrderData
}

export default function PaymentSummary({ order }: PaymentSummaryProps) {
  // Use items if available, otherwise fallback to parsing lpgType
  const hasItems = order.items && order.items.length > 0

  return (
    <Card>
      <CardHeader className="pb-3">
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

        {/* LPG Items - Show each type with quantity */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Detail LPG</p>
          <div className="space-y-2">
            {hasItems ? (
              // Show each item with quantity
              order.items!.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.quantity} unit</span>
                </div>
              ))
            ) : (
              // Fallback for old interface
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-medium">{order.lpgType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total Quantity - Highlighted */}
        <div className="bg-secondary rounded-lg p-3 border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Jumlah</span>
            <span className="text-lg font-bold text-primary">
              {order.quantity} <span className="text-sm font-normal text-muted-foreground">unit</span>
            </span>
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
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Total Pembayaran</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
