
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Item {
  id: number
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

interface InvoiceItemsProps {
  items: Item[]
}

export default function InvoiceItems({ items }: InvoiceItemsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-primary/20 hover:bg-transparent">
            <TableHead className="text-foreground font-semibold">Deskripsi</TableHead>
            <TableHead className="text-right text-foreground font-semibold">Qty</TableHead>
            <TableHead className="text-center text-foreground font-semibold">Satuan</TableHead>
            <TableHead className="text-right text-foreground font-semibold">Harga Satuan</TableHead>
            <TableHead className="text-right text-foreground font-semibold">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-b border-border hover:bg-secondary/30">
              <TableCell className="text-foreground">{item.description}</TableCell>
              <TableCell className="text-right text-foreground">{item.quantity}</TableCell>
              <TableCell className="text-center text-muted-foreground text-sm">{item.unit}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(item.unitPrice)}</TableCell>
              <TableCell className="text-right font-semibold text-foreground">{formatCurrency(item.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
