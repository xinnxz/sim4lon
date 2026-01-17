
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

/**
 * Get LPG product image based on label (flexible matching)
 */
const getLpgImage = (label: string): string | null => {
  if (!label) return null
  const l = label.toLowerCase()

  // Bright Gas / 220gr
  if (l.includes('bright') || l.includes('220')) {
    return '/images/products/bright-gas-220gr.png'
  }
  // 50kg
  if (l.includes('50kg') || l.includes('50 kg')) {
    return '/images/products/lpg-50kg.png'
  }
  // 12kg
  if (l.includes('12kg') || l.includes('12 kg')) {
    return '/images/products/lpg-12kg.png'
  }
  // 5.5kg / 5kg
  if (l.includes('5.5') || l.includes('5kg') || l.includes('5 kg')) {
    return '/images/products/lpg-5kg.png'
  }
  // 3kg
  if (l.includes('3kg') || l.includes('3 kg')) {
    return '/images/products/lpg-3kg.png'
  }
  return null
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
          {items.map((item) => {
            const imgSrc = getLpgImage(item.description)
            return (
              <TableRow key={item.id} className="border-b border-border hover:bg-secondary/30">
                <TableCell className="text-foreground">
                  <div className="flex items-center gap-3">
                    {imgSrc && (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={imgSrc}
                          alt={item.description}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    )}
                    <span>{item.description}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-foreground">{item.quantity}</TableCell>
                <TableCell className="text-center text-muted-foreground text-sm">{item.unit}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell className="text-right font-semibold text-foreground">{formatCurrency(item.total)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

