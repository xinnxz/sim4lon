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
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <Card>
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
                  <TableCell className="font-medium">LPG {item.type}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
