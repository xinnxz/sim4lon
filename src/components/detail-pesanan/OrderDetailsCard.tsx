
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

interface OrderItem {
  id: number
  type: string
  quantity: number
  price: number
  subtotal: number
}

interface OrderDetailsCardProps {
  items: OrderItem[]
  total: number
}

export default function OrderDetailsCard({ items, total }: OrderDetailsCardProps) {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Detail Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis LPG</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    Rp {item.price.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rp {items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pajak (0%)</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biaya Pengiriman</span>
            <span>Rp 0</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
