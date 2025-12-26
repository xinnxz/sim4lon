
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { formatCurrency } from '@/lib/currency'

interface OrderItem {
  type: string
  quantity: number
}

interface Order {
  id: string
  apiId?: string
  pangkalan: string
  items: OrderItem[]
  qty: number
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  tanggal: string
}

interface OrdersListTableProps {
  orders: Order[]
}

const statusConfig: Record<string, { label: string; variant?: 'outline' | 'secondary'; color?: string; className?: string }> = {
  pending: {
    label: 'Belum Dibayar',
    variant: 'outline',
    color: 'text-yellow-600'
  },
  processing: {
    label: 'Diproses',
    variant: 'secondary',
    color: 'text-blue-600'
  },
  completed: {
    label: 'Selesai',
    className: 'bg-[#ebebeb] text-slate-700 border-[#ebebeb]'
  },
  cancelled: {
    label: 'Dibatalkan',
    className: 'bg-red-600 text-red-600 border-red-600'
  }
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

function formatLpgDisplay(items: OrderItem[]): string {
  if (items.length === 0) return '-'
  if (items.length === 1) return items[0].type

  return `${items.length} jenis`
}

export default function OrdersListTable({ orders }: OrdersListTableProps) {
  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <SafeIcon name="InboxX" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Tidak ada pesanan</h3>
        <p className="text-muted-foreground mb-4">
          Tidak ada pesanan yang sesuai dengan kriteria pencarian Anda
        </p>
        <Button asChild>
          <a href="/buat-pesanan">
            <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
            Buat Pesanan Baru
          </a>
        </Button>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">ID Pesanan</TableHead>
              <TableHead className="font-semibold">Pangkalan</TableHead>
              <TableHead className="font-semibold">Jenis LPG</TableHead>
              <TableHead className="font-semibold text-right">Qty</TableHead>
              <TableHead className="font-semibold text-right">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Tanggal</TableHead>
              <TableHead className="font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const status = statusConfig[order.status]
              return (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-primary">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.pangkalan}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatLpgDisplay(order.items)}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {order.qty} unit
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    {status.className ? (
                      <Badge
                        id={order.status === 'completed' ? 'i1frsm-2' : order.status === 'cancelled' ? 'im9klt' : undefined}
                        className={status.className}
                        style={order.status === 'cancelled' ? {
                          color: '#ebebeb',
                          backgroundImage: 'linear-gradient(#dd3333 0%, #dd3333 100%)',
                          backgroundColor: '#dd3333',
                          borderColor: '#dd3333'
                        } : undefined}
                      >
                        {status.label}
                      </Badge>
                    ) : (
                      <Badge variant={status.variant} className={status.color}>
                        {status.label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.tanggal)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a href={`/detail-pesanan?id=${order.apiId || order.id}`}>
                        <SafeIcon name="Eye" className="h-4 w-4" />
                        <span className="hidden sm:inline">Lihat</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
