
'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import DeliveryTable from './DeliveryTable'
import { mockDeliveries, deliveryStatuses, mockDrivers } from './mockData'

export default function DaftarPengirimanPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [driverFilter, setDriverFilter] = useState<string>('all')

  // Filter and search deliveries
  const filteredDeliveries = useMemo(() => {
    return mockDeliveries.filter(delivery => {
      const matchesSearch = 
        delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.baseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.driverName.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter
      const matchesDriver = driverFilter === 'all' || delivery.driverName === driverFilter

      return matchesSearch && matchesStatus && matchesDriver
    })
  }, [searchQuery, statusFilter, driverFilter])

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="animate-fadeInDown">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Pengiriman</h1>
        <p className="text-muted-foreground mt-2">
          Kelola dan pantau semua pengiriman LPG Anda
        </p>
      </div>

      {/* Search and Filter Card */}
      <Card className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="text-lg">Pencarian & Filter</CardTitle>
          <CardDescription>
            Cari pengiriman berdasarkan ID, pangkalan, atau driver
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <SafeIcon 
                  name="Search" 
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Cari ID pengiriman, pangkalan, atau driver..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {deliveryStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Driver Filter */}
            <div>
              <Select value={driverFilter} onValueChange={setDriverFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Driver</SelectItem>
                  {mockDrivers.map(driver => (
                    <SelectItem key={driver} value={driver}>
                      {driver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{filteredDeliveries.length}</span> dari <span className="font-semibold text-foreground">{mockDeliveries.length}</span> pengiriman
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setSearchQuery('')
            setStatusFilter('all')
            setDriverFilter('all')
          }}
        >
          <SafeIcon name="RotateCcw" className="mr-2 h-4 w-4" />
          Reset Filter
        </Button>
      </div>

      {/* Delivery Table */}
      <DeliveryTable deliveries={filteredDeliveries} />
    </div>
  )
}
