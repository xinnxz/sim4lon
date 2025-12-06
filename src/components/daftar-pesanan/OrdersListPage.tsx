
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
import SafeIcon from '@/components/common/SafeIcon'
import OrdersListTable from './OrdersListTable'

interface OrderItem {
  type: string
  quantity: number
}

interface Order {
  id: string
  pangkalan: string
  items: OrderItem[]
  qty: number
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  tanggal: string
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    pangkalan: 'Pangkalan Maju Jaya',
    items: [{ type: 'LPG 12kg', quantity: 50 }],
    qty: 50,
    total: 2500000,
    status: 'pending',
    tanggal: '2024-01-15'
  },
  {
    id: 'ORD-002',
    pangkalan: 'Pangkalan Sejahtera',
    items: [{ type: 'LPG 3kg', quantity: 100 }],
    qty: 100,
    total: 1500000,
    status: 'processing',
    tanggal: '2024-01-14'
  },
  {
    id: 'ORD-003',
    pangkalan: 'Pangkalan Bersama',
    items: [{ type: 'LPG 50kg', quantity: 20 }],
    qty: 20,
    total: 5000000,
    status: 'completed',
    tanggal: '2024-01-13'
  },
  {
    id: 'ORD-004',
    pangkalan: 'Pangkalan Maju Jaya',
    items: [
      { type: 'LPG 12kg', quantity: 40 },
      { type: 'LPG 3kg', quantity: 35 }
    ],
    qty: 75,
    total: 3750000,
    status: 'pending',
    tanggal: '2024-01-12'
  },
  {
    id: 'ORD-005',
    pangkalan: 'Pangkalan Sentosa',
    items: [{ type: 'LPG 3kg', quantity: 150 }],
    qty: 150,
    total: 2250000,
    status: 'processing',
    tanggal: '2024-01-11'
  },
  {
    id: 'ORD-006',
    pangkalan: 'Pangkalan Bersama',
    items: [
      { type: 'LPG 12kg', quantity: 30 },
      { type: 'LPG 3kg', quantity: 30 }
    ],
    qty: 60,
    total: 3000000,
    status: 'cancelled',
    tanggal: '2024-01-10'
  },
  {
    id: 'ORD-007',
    pangkalan: 'Pangkalan Jaya Abadi',
    items: [{ type: 'LPG 50kg', quantity: 15 }],
    qty: 15,
    total: 3750000,
    status: 'completed',
    tanggal: '2024-01-09'
  },
  {
    id: 'ORD-008',
    pangkalan: 'Pangkalan Maju Jaya',
    items: [
      { type: 'LPG 12kg', quantity: 50 },
      { type: 'LPG 3kg', quantity: 100 },
      { type: 'LPG 50kg', quantity: 50 }
    ],
    qty: 200,
    total: 3000000,
    status: 'pending',
    tanggal: '2024-01-08'
  },
]

export default function OrdersListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const itemsText = order.items.map(item => item.type).join(' ').toLowerCase()
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pangkalan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemsText.includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pesanan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pesanan LPG Anda dengan mudah
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto gap-2">
          <a href="./buat-pesanan.html">
            <SafeIcon name="Plus" className="h-4 w-4" />
            Buat Pesanan
          </a>
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Cari Pesanan</label>
          <div className="relative">
            <SafeIcon 
              name="Search" 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder="Cari ID pesanan, pangkalan, atau jenis LPG..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <label className="text-sm font-medium mb-2 block">Filter Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Status" />
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
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredOrders.length} dari {mockOrders.length} pesanan
      </div>

      {/* Table */}
      <OrdersListTable orders={filteredOrders} />
    </div>
  )
}
