
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import type { Delivery } from './mockData'

interface DeliveryTableProps {
  deliveries: Delivery[]
}

const statusConfig = {
  pending: { label: 'Menunggu', variant: 'outline' as const, color: 'text-yellow-600' },
  in_transit: { label: 'Dalam Perjalanan', variant: 'secondary' as const, color: 'text-blue-600' },
  delivered: { label: 'Terkirim', variant: 'default' as const, color: 'text-green-600' },
  cancelled: { label: 'Dibatalkan', variant: 'destructive' as const, color: 'text-red-600' },
}

export default function DeliveryTable({ deliveries }: DeliveryTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (deliveries.length === 0) {
    return (
      <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <SafeIcon name="Package" className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground">Tidak ada pengiriman ditemukan</p>
          <p className="text-sm text-muted-foreground mt-1">
            Coba ubah filter atau pencarian Anda
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">ID Pengiriman</TableHead>
                <TableHead className="font-semibold">Pangkalan</TableHead>
                <TableHead className="font-semibold">Driver</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Tanggal</TableHead>
                <TableHead className="text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery, index) => {
                const status = statusConfig[delivery.status as keyof typeof statusConfig]
                
                return (
                  <TableRow 
                    key={delivery.id}
                    className="hover:bg-muted/50 transition-colors"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    <TableCell className="font-medium text-primary">
                      {delivery.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <SafeIcon name="MapPin" className="h-4 w-4 text-muted-foreground" />
                        {delivery.baseName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <SafeIcon name="User" className="h-4 w-4 text-muted-foreground" />
                        {delivery.driverName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(delivery.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="hover:bg-primary/10"
                      >
                        <a href={`./detail-pengiriman.html?id=${delivery.id}`}>
                          <SafeIcon name="Eye" className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Detail</span>
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
