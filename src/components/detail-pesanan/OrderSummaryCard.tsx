
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import OrderItemsTable from './OrderItemsTable'

interface OrderSummaryCardProps {
  order: {
    id: string
    createdDate: string
    createdTime: string
    dueDate: string
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
         {/* Dates */}
         <div className="grid grid-cols-2 gap-4">
           <div>
             <p className="text-sm text-muted-foreground">Tanggal Pesanan</p>
             <p className="font-medium">{order.createdDate} {order.createdTime}</p>
           </div>
           <div>
             <p className="text-sm text-muted-foreground">Tanggal Jatuh Tempo</p>
             <p className="font-medium">{order.dueDate}</p>
           </div>
         </div>

         <Separator />

         {/* Order Items Table */}
         <OrderItemsTable items={order.items} />

         <Separator id="iirwmj" />

         {/* Price Breakdown */}
         <div className="space-y-2" id="i50ml5">
           <div className="flex justify-between" id="imacmg">
             <span className="text-muted-foreground">Subtotal</span>
             <span className="font-medium" id="iz15ye">Rp {order.subtotal.toLocaleString('id-ID')}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-muted-foreground" id="iten6g">Pajak (10%)</span>
             <span className="font-medium">Rp {order.tax.toLocaleString('id-ID')}</span>
           </div>
         </div>

         <Separator />

         {/* Total */}
         <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg">
           <span className="font-semibold">Total</span>
           <span className="text-lg font-bold text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
         </div>
      </CardContent>
    </Card>
  )
}
