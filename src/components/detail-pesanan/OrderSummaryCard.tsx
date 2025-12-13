/**
 * OrderSummaryCard - Ringkasan pesanan dengan breakdown harga
 * 
 * PENJELASAN:
 * Component ini menampilkan:
 * - Tanggal pesanan
 * - Daftar item pesanan
 * - Breakdown harga: Subtotal, PPN 12% (jika ada), Total
 * - Menggunakan formatCurrency untuk format uang yang konsisten
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import OrderItemsTable from './OrderItemsTable'
import { formatCurrency } from '@/lib/currency'

interface OrderSummaryCardProps {
  order: {
    id: string
    createdDate: string
    createdTime: string
    subtotal: number
    tax: number
    total: number
    paidAmount: number
    items: Array<{
      id: number
      type: string
      quantity: number
      price: number
      subtotal: number
    }>
  }
}

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Date */}
        <div>
          <p className="text-sm text-muted-foreground">Tanggal Pesanan</p>
          <p className="font-medium">{order.createdDate} {order.createdTime}</p>
        </div>

        <Separator />

        {/* Order Items Table */}
        <OrderItemsTable items={order.items} />

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                PPN 12%
                <Badge variant="outline" className="text-[10px] px-1 py-0 bg-orange-50 text-orange-600 border-orange-200">
                  Non-Subsidi
                </Badge>
              </span>
              <span className="font-medium text-orange-600">+ {formatCurrency(order.tax)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(order.total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
