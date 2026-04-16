/**
 * OrderItemsTable - Tabel item pesanan
 * 
 * PENJELASAN:
 * Component ini menampilkan daftar item LPG dalam pesanan
 * dengan format currency yang konsisten menggunakan utility formatCurrency
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/currency'

interface OrderItem {
  id: number
  type: string
  quantity: number
  price: number
  subtotal: number
}

interface OrderItemsTableProps {
  items: OrderItem[]
  showTotalRow?: boolean
}

export default function OrderItemsTable({ items, showTotalRow = false }: OrderItemsTableProps) {
  // Calculate totals - ensure numeric conversion
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity), 0)
  const totalSubtotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0)

  return (
    <Card className="shadow-none border-0 hover:shadow-none">
      <CardHeader>
        <CardTitle>Item Pesanan</CardTitle>
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
                  <TableCell className="text-right whitespace-nowrap">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap">
                    {formatCurrency(item.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {showTotalRow && (
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">{totalQty}</TableCell>
                  <TableCell className="text-right"></TableCell>
                  <TableCell className="text-right font-bold whitespace-nowrap">
                    {formatCurrency(totalSubtotal)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

