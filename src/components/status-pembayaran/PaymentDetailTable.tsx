
'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SafeIcon from '@/components/common/SafeIcon'

interface PaymentDetail {
  id: string
  pangkalan: string
  amount: number
  status: string
  date: string
  dueDate: string
}

interface PaymentDetailTableProps {
  data: PaymentDetail[]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Lunas':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <SafeIcon name="CheckCircle" className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    case 'Belum Dibayar':
      return <Badge variant="destructive">
        <SafeIcon name="AlertCircle" className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    case 'Tertunda':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <SafeIcon name="Clock" className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function PaymentDetailTable({ data }: PaymentDetailTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>ID Pesanan</TableHead>
            <TableHead>Pangkalan</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Pesanan</TableHead>
            <TableHead>Tanggal Jatuh Tempo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.pangkalan}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(item.amount)}
              </TableCell>
              <TableCell>
                {getStatusBadge(item.status)}
              </TableCell>
              <TableCell>{formatDate(item.date)}</TableCell>
              <TableCell>{formatDate(item.dueDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
