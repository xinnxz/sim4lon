
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Pangkalan {
  id: string
  nama: string
  alamat: string
  kontak: string
  email: string
  catatan: string
  createdAt: string
  updatedAt: string
  picName: string
  area: string
  status: string
}

interface OrderHistory {
  orderId: string
  date: string
  total: number
  status: 'SELESAI' | 'DIBATALKAN' | 'DIPROSES' | 'MENUNGGU_PEMBAYARAN'
}

interface PangkalanInfoCardProps {
  pangkalan: Pangkalan
}

interface OrderHistoryDetails extends OrderHistory {
  lpgType: string
  quantity: number
}

const mockOrderHistory: OrderHistoryDetails[] = [
  {
    orderId: 'ORD-12345',
    date: '20 Des 2024',
    total: 5250000,
    status: 'SELESAI',
    lpgType: 'LPG 12 Kg',
    quantity: 50
  },
  {
    orderId: 'ORD-12344',
    date: '17 Des 2024',
    total: 3000000,
    status: 'DIBATALKAN',
    lpgType: 'LPG 3 Kg',
    quantity: 100
  },
  {
    orderId: 'ORD-12343',
    date: '10 Des 2024',
    total: 2500000,
    status: 'SELESAI',
    lpgType: 'LPG 12 Kg',
    quantity: 40
  }
]

export default function PangkalanInfoCard({ pangkalan }: PangkalanInfoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadgeStyle = (status: OrderHistory['status']) => {
    switch (status) {
      case 'SELESAI':
        return 'bg-primary/10 text-primary border-primary/30'
      case 'DIBATALKAN':
        return 'bg-destructive/10 text-destructive border-destructive/30'
      case 'DIPROSES':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'MENUNGGU_PEMBAYARAN':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusLabel = (status: OrderHistory['status']) => {
    switch (status) {
      case 'SELESAI':
        return 'Selesai'
      case 'DIBATALKAN':
        return 'Dibatalkan'
      case 'DIPROSES':
        return 'Diproses'
      case 'MENUNGGU_PEMBAYARAN':
        return 'Menunggu Pembayaran'
      default:
        return status
    }
  }

return (
    <div className="space-y-4">
      {/* A. Informasi Utama */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <SafeIcon name="Store" className="h-5 w-5 text-primary" />
                </div>
                Informasi Utama
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nama Pangkalan</p>
              <p className="text-base text-foreground mt-1">{pangkalan.nama}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID Pangkalan</p>
              <p className="text-base text-foreground mt-1">{pangkalan.id}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Area / Wilayah</p>
              <p className="text-base text-foreground mt-1">{pangkalan.area}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-1">
                <Badge variant="outline" className="bg-primary/5">{pangkalan.status}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

{/* B. Contact Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Users" className="h-5 w-5 text-primary" />
            Kontak Utama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nama PIC</p>
            <p className="text-base text-foreground mt-1">{pangkalan.picName}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-start gap-3">
                <SafeIcon name="Phone" className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nomor Telepon</p>
                  <p className="text-base text-foreground mt-1">{pangkalan.kontak}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <SafeIcon name="Mail" className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base text-foreground mt-1">{pangkalan.email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

{/* C. Full Address */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="MapPin" className="h-5 w-5 text-primary" />
            Alamat Lengkap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-foreground">{pangkalan.alamat}</p>
        </CardContent>
      </Card>

{/* D. Notes */}
       <Card>
         <CardHeader className="pb-2">
           <CardTitle className="flex items-center gap-2">
             <SafeIcon name="FileText" className="h-5 w-5 text-primary" />
             Catatan Pangkalan
           </CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-base text-foreground">{pangkalan.catatan}</p>
         </CardContent>
       </Card>

       {/* E. Order History */}
       <Card>
         <CardHeader className="pb-2">
           <CardTitle className="flex items-center gap-2">
             <SafeIcon name="History" className="h-5 w-5 text-primary" />
             Riwayat Pesanan Pangkalan
           </CardTitle>
           <CardDescription>Riwayat Pesanan Terbaru</CardDescription>
         </CardHeader>
         <CardContent>
           <div className="w-full overflow-x-auto">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead className="min-w-[100px]">ID Pesanan</TableHead>
                   <TableHead className="min-w-[110px]">Tanggal</TableHead>
                   <TableHead className="min-w-[120px]">Jenis LPG</TableHead>
                   <TableHead className="min-w-[90px] text-center">Kuantitas</TableHead>
                   <TableHead className="min-w-[130px] text-right">Total</TableHead>
                   <TableHead className="min-w-[110px]">Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {mockOrderHistory.map((order) => (
                   <TableRow key={order.orderId}>
                     <TableCell className="font-medium text-foreground">
                       {order.orderId}
                     </TableCell>
                     <TableCell className="text-foreground">
                       {order.date}
                     </TableCell>
                     <TableCell className="text-foreground">
                       {order.lpgType}
                     </TableCell>
                     <TableCell className="text-center text-foreground">
                       {order.quantity} unit
                     </TableCell>
                     <TableCell className="text-right font-semibold text-foreground">
                       {formatCurrency(order.total)}
                     </TableCell>
                     <TableCell>
                       <Badge
                         variant="outline"
                         className={`${getStatusBadgeStyle(order.status)} border`}
                       >
                         {getStatusLabel(order.status)}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
         </CardContent>
       </Card>

       {/* F. Metadata */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dibuat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tanggal Pembuatan</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              {formatDate(pangkalan.createdAt)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Diperbarui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              {formatDate(pangkalan.updatedAt)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
