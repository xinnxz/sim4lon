
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import OrderStatusBadge from './OrderStatusBadge'

interface Order {
  id: string
  pangkalan: string
  jenisLpg: string
  qty: number
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  tanggal: string
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    pangkalan: 'Pangkalan Maju Jaya',
    jenisLpg: 'LPG 12kg',
    qty: 50,
    total: 2500000,
    status: 'pending',
    tanggal: '2024-01-15'
  },
  {
    id: 'ORD-002',
    pangkalan: 'Pangkalan Sejahtera',
    jenisLpg: 'LPG 3kg',
    qty: 100,
    total: 1500000,
    status: 'processing',
    tanggal: '2024-01-14'
  },
  {
    id: 'ORD-003',
    pangkalan: 'Pangkalan Bersama',
    jenisLpg: 'LPG 50kg',
    qty: 20,
    total: 5000000,
    status: 'completed',
    tanggal: '2024-01-13'
  },
  {
    id: 'ORD-004',
    pangkalan: 'Pangkalan Maju Jaya',
    jenisLpg: 'LPG 12kg',
    qty: 75,
    total: 3750000,
    status: 'pending',
    tanggal: '2024-01-12'
  },
  {
    id: 'ORD-005',
    pangkalan: 'Pangkalan Sentosa',
    jenisLpg: 'LPG 3kg',
    qty: 150,
    total: 2250000,
    status: 'cancelled',
    tanggal: '2024-01-11'
  },
  {
    id: 'ORD-006',
    pangkalan: 'Pangkalan Bersama',
    jenisLpg: 'LPG 12kg',
    qty: 60,
    total: 3000000,
    status: 'processing',
    tanggal: '2024-01-10'
  },
  {
    id: 'ORD-007',
    pangkalan: 'Pangkalan Sejahtera',
    jenisLpg: 'LPG 50kg',
    qty: 15,
    total: 3750000,
    status: 'completed',
    tanggal: '2024-01-09'
  },
  {
    id: 'ORD-008',
    pangkalan: 'Pangkalan Maju Jaya',
    jenisLpg: 'LPG 3kg',
    qty: 200,
    total: 3000000,
    status: 'pending',
    tanggal: '2024-01-08'
  },
]

export default function OrderListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pangkalan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.jenisLpg.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pesanan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pesanan masuk dengan mudah
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          <a href="./buat-pesanan.html">
            <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
            Buat Pesanan
          </a>
        </Button>
</div>

       {/* Summary Stats */}
       <div className="grid gap-4 sm:grid-cols-4">
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Pesanan
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-2xl font-bold">{mockOrders.length}</p>
           </CardContent>
         </Card>
         <Card>
<CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Belum Dibayar
              </CardTitle>
            </CardHeader>
           <CardContent>
             <p className="text-2xl font-bold text-yellow-600">
               {mockOrders.filter(o => o.status === 'pending').length}
             </p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Diproses
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-2xl font-bold text-blue-600">
               {mockOrders.filter(o => o.status === 'processing').length}
             </p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Selesai
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-2xl font-bold text-primary">
               {mockOrders.filter(o => o.status === 'completed').length}
             </p>
           </CardContent>
</Card>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
<CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {/* Search Input */}
              <div className="relative sm:col-span-2">
                <SafeIcon 
                  name="Search" 
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Cari ID pesanan, pangkalan, atau jenis LPG..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Belum Dibayar</SelectItem>
                  <SelectItem value="processing">Diproses</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
       <Card>
         <CardHeader>
           <CardTitle>Daftar Pesanan</CardTitle>
           <CardDescription>
             Total {filteredOrders.length} pesanan
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div className="overflow-x-auto">
             <Table>
               <TableHeader>
                 <TableRow className="hover:bg-transparent">
                   <TableHead className="font-semibold">ID Pesanan</TableHead>
                   <TableHead className="font-semibold">Pangkalan</TableHead>
                   <TableHead className="font-semibold">Jenis LPG</TableHead>
                   <TableHead className="text-right font-semibold">Qty</TableHead>
                   <TableHead className="text-right font-semibold">Total</TableHead>
                   <TableHead className="font-semibold">Status</TableHead>
                   <TableHead className="font-semibold">Tanggal</TableHead>
                   <TableHead className="text-right font-semibold">Aksi</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredOrders.length > 0 ? (
                   filteredOrders.map((order) => (
                     <TableRow key={order.id} className="hover:bg-muted/50">
                       <TableCell className="font-medium text-primary">
                         {order.id}
                       </TableCell>
                       <TableCell className="text-sm">
                         {order.pangkalan}
                       </TableCell>
                       <TableCell className="text-sm">
                         {order.jenisLpg}
                       </TableCell>
                       <TableCell className="text-right text-sm">
                         {order.qty} unit
                       </TableCell>
                       <TableCell className="text-right text-sm font-medium">
                         {formatCurrency(order.total)}
                       </TableCell>
                       <TableCell>
                         <OrderStatusBadge status={order.status} />
                       </TableCell>
                       <TableCell className="text-sm text-muted-foreground">
                         {formatDate(order.tanggal)}
                       </TableCell>
<TableCell className="text-right">
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            <a href="./detail-pesanan.html" className="flex items-center justify-center gap-2">
                              <SafeIcon name="Eye" className="h-4 w-4" />
                              Lihat Detail
                            </a>
                          </Button>
                        </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={8} className="text-center py-8">
                       <div className="flex flex-col items-center gap-2">
                         <SafeIcon name="InboxX" className="h-8 w-8 text-muted-foreground" />
                         <p className="text-muted-foreground">Tidak ada pesanan yang ditemukan</p>
                       </div>
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </div>
         </CardContent>
       </Card>
    </div>
  )
}
