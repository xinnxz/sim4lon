
import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination'
import SafeIcon from '@/components/common/SafeIcon'
import ActivityCard from './ActivityCard'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'

interface Activity {
  id: string
  type: 'payment' | 'completed' | 'new' | 'shipped'
  title: string
  orderNumber: string
  customerName: string
  timestamp: string
  amount?: string
  quantity?: string
  status: 'completed' | 'pending' | 'processing'
  icon: string
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Pembayaran Diterima',
    orderNumber: '#ORD-2024-001',
    customerName: 'Pangkalan Maju Jaya',
    timestamp: '5 menit yang lalu',
    amount: 'Rp 2.500.000',
    status: 'completed',
    icon: 'CheckCircle'
  },
  {
    id: '2',
    type: 'completed',
    title: 'Pesanan Selesai',
    orderNumber: '#ORD-2024-002',
    customerName: 'Toko Gas Sejahtera',
    timestamp: '1 jam yang lalu',
    quantity: '50 tabung',
    status: 'completed',
    icon: 'Package'
  },
  {
    id: '3',
    type: 'new',
    title: 'Pesanan Baru',
    orderNumber: '#ORD-2024-003',
    customerName: 'Distributor Utama',
    timestamp: '2 jam yang lalu',
    quantity: '100 tabung',
    status: 'pending',
    icon: 'ShoppingCart'
  },
  {
    id: '4',
    type: 'shipped',
    title: 'Pesanan Dikirim',
    orderNumber: '#ORD-2024-004',
    customerName: 'Pangkalan Sentosa',
    timestamp: '3 jam yang lalu',
    quantity: '75 tabung',
    status: 'processing',
    icon: 'Truck'
  },
  {
    id: '5',
    type: 'payment',
    title: 'Pembayaran Diterima',
    orderNumber: '#ORD-2024-005',
    customerName: 'Toko Emas Gas',
    timestamp: '4 jam yang lalu',
    amount: 'Rp 1.800.000',
    status: 'completed',
    icon: 'CheckCircle'
  },
  {
    id: '6',
    type: 'completed',
    title: 'Pesanan Selesai',
    orderNumber: '#ORD-2024-006',
    customerName: 'Pangkalan Bersama',
    timestamp: '5 jam yang lalu',
    quantity: '30 tabung',
    status: 'completed',
    icon: 'Package'
  },
  {
    id: '7',
    type: 'shipped',
    title: 'Pesanan Dikirim',
    orderNumber: '#ORD-2024-007',
    customerName: 'Distributor Cepat',
    timestamp: '6 jam yang lalu',
    quantity: '120 tabung',
    status: 'processing',
    icon: 'Truck'
  },
  {
    id: '8',
    type: 'new',
    title: 'Pesanan Baru',
    orderNumber: '#ORD-2024-008',
    customerName: 'Toko Langganan',
    timestamp: '7 jam yang lalu',
    quantity: '45 tabung',
    status: 'pending',
    icon: 'ShoppingCart'
  },
  {
    id: '9',
    type: 'payment',
    title: 'Pembayaran Diterima',
    orderNumber: '#ORD-2024-009',
    customerName: 'Pangkalan Makmur',
    timestamp: '8 jam yang lalu',
    amount: 'Rp 3.200.000',
    status: 'completed',
    icon: 'CheckCircle'
  },
  {
    id: '10',
    type: 'completed',
    title: 'Pesanan Selesai',
    orderNumber: '#ORD-2024-010',
    customerName: 'Toko Sejahtera Jaya',
    timestamp: '9 jam yang lalu',
    quantity: '60 tabung',
    status: 'completed',
    icon: 'Package'
  },
  {
    id: '11',
    type: 'shipped',
    title: 'Pesanan Dikirim',
    orderNumber: '#ORD-2024-011',
    customerName: 'Distributor Lestari',
    timestamp: '10 jam yang lalu',
    quantity: '90 tabung',
    status: 'processing',
    icon: 'Truck'
  },
  {
    id: '12',
    type: 'new',
    title: 'Pesanan Baru',
    orderNumber: '#ORD-2024-012',
    customerName: 'Perpustakaan Gas Indonesia',
    timestamp: '11 jam yang lalu',
    quantity: '55 tabung',
    status: 'pending',
    icon: 'ShoppingCart'
  },
  {
    id: '13',
    type: 'payment',
    title: 'Pembayaran Diterima',
    orderNumber: '#ORD-2024-013',
    customerName: 'Pangkalan Subur',
    timestamp: '12 jam yang lalu',
    amount: 'Rp 2.100.000',
    status: 'completed',
    icon: 'CheckCircle'
  },
  {
    id: '14',
    type: 'completed',
    title: 'Pesanan Selesai',
    orderNumber: '#ORD-2024-014',
    customerName: 'Toko Gas Bersatu',
    timestamp: '13 jam yang lalu',
    quantity: '70 tabung',
    status: 'completed',
    icon: 'Package'
  },
  {
    id: '15',
    type: 'new',
    title: 'Pesanan Baru',
    orderNumber: '#ORD-2024-015',
    customerName: 'Distributor Sukses',
    timestamp: '14 jam yang lalu',
    quantity: '85 tabung',
    status: 'pending',
    icon: 'ShoppingCart'
  },
  {
    id: '16',
    type: 'shipped',
    title: 'Pesanan Dikirim',
    orderNumber: '#ORD-2024-016',
    customerName: 'Pangkalan Anugerah',
    timestamp: '15 jam yang lalu',
    quantity: '40 tabung',
    status: 'processing',
    icon: 'Truck'
  },
  {
    id: '17',
    type: 'payment',
    title: 'Pembayaran Diterima',
    orderNumber: '#ORD-2024-017',
    customerName: 'Toko Mandiri Gas',
    timestamp: '16 jam yang lalu',
    amount: 'Rp 1.950.000',
    status: 'completed',
    icon: 'CheckCircle'
  },
  {
    id: '18',
    type: 'completed',
    title: 'Pesanan Selesai',
    orderNumber: '#ORD-2024-018',
    customerName: 'Pangkalan Mulia',
    timestamp: '17 jam yang lalu',
    quantity: '65 tabung',
    status: 'completed',
    icon: 'Package'
  },
  {
    id: '19',
    type: 'shipped',
    title: 'Pesanan Dikirim',
    orderNumber: '#ORD-2024-019',
    customerName: 'Distributor Prima',
    timestamp: '18 jam yang lalu',
    quantity: '110 tabung',
    status: 'processing',
    icon: 'Truck'
  },
  {
    id: '20',
    type: 'new',
    title: 'Pesanan Baru',
    orderNumber: '#ORD-2024-020',
    customerName: 'Toko Cantik Gas',
    timestamp: '19 jam yang lalu',
    quantity: '35 tabung',
    status: 'pending',
    icon: 'ShoppingCart'
  },
  {
    id: '21',
    type: 'payment',
    title: 'Pembayaran Diterima',
    orderNumber: '#ORD-2024-021',
    customerName: 'Pangkalan Mitra',
    timestamp: '20 jam yang lalu',
    amount: 'Rp 2.750.000',
    status: 'completed',
    icon: 'CheckCircle'
  },
  {
    id: '22',
    type: 'completed',
    title: 'Pesanan Selesai',
    orderNumber: '#ORD-2024-022',
    customerName: 'Distributor Ceria',
    timestamp: '21 jam yang lalu',
    quantity: '55 tabung',
    status: 'completed',
    icon: 'Package'
  },
  {
    id: '23',
    type: 'new',
    title: 'Pesanan Baru',
    orderNumber: '#ORD-2024-023',
    customerName: 'Pangkalan Harapan',
    timestamp: '22 jam yang lalu',
    quantity: '95 tabung',
    status: 'pending',
    icon: 'ShoppingCart'
  },
  {
    id: '24',
    type: 'shipped',
    title: 'Pesanan Dikirim',
    orderNumber: '#ORD-2024-024',
    customerName: 'Toko Gas Berjaya',
    timestamp: '23 jam yang lalu',
    quantity: '80 tabung',
    status: 'processing',
    icon: 'Truck'
  },
  {
    id: '25',
    type: 'payment',
    title: 'Pembayaran Diterima',
    orderNumber: '#ORD-2024-025',
    customerName: 'Distributor Jaya',
    timestamp: '1 hari yang lalu',
    amount: 'Rp 3.400.000',
    status: 'completed',
    icon: 'CheckCircle'
  },
  {
    id: '26',
    type: 'completed',
    title: 'Pesanan Selesai',
    orderNumber: '#ORD-2024-026',
    customerName: 'Pangkalan Cemerlang',
    timestamp: '1 hari yang lalu',
    quantity: '45 tabung',
    status: 'completed',
    icon: 'Package'
  },
  {
    id: '27',
    type: 'shipped',
    title: 'Pesanan Dikirim',
    orderNumber: '#ORD-2024-027',
    customerName: 'Toko Maju Jaya',
    timestamp: '1 hari yang lalu',
    quantity: '100 tabung',
    status: 'processing',
    icon: 'Truck'
  },
  {
    id: '28',
    type: 'new',
    title: 'Pesanan Baru',
    orderNumber: '#ORD-2024-028',
    customerName: 'Distributor Raih',
    timestamp: '1 hari yang lalu',
    quantity: '70 tabung',
    status: 'pending',
    icon: 'ShoppingCart'
  },
]

const activityTypes = [
  { value: 'all', label: 'Semua Aktivitas' },
  { value: 'payment', label: 'Pembayaran' },
  { value: 'completed', label: 'Pesanan Selesai' },
  { value: 'new', label: 'Pesanan Baru' },
  { value: 'shipped', label: 'Pesanan Dikirim' },
]

const DEFAULT_ITEMS_PER_PAGE = 10
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

export default function ActivityPage() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(DEFAULT_ITEMS_PER_PAGE)

  const filteredActivities = useMemo(() => {
    return selectedType === 'all' 
      ? mockActivities 
      : mockActivities.filter(activity => activity.type === selectedType)
  }, [selectedType])

  const stats = useMemo(() => {
    return {
      total: mockActivities.length,
      payments: mockActivities.filter(a => a.type === 'payment').length,
      completed: mockActivities.filter(a => a.type === 'completed').length,
      new: mockActivities.filter(a => a.type === 'new').length,
      shipped: mockActivities.filter(a => a.type === 'shipped').length,
    }
  }, [])

// Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex)

  // Reset to first page when filter changes
  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setCurrentPage(1)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  // Generate pagination items
  const getPaginationItems = () => {
    const items = []
    const maxVisible = 5
    const halfVisible = Math.floor(maxVisible / 2)

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      if (currentPage <= halfVisible + 1) {
        for (let i = 1; i <= maxVisible; i++) {
          items.push(i)
        }
        items.push('ellipsis')
        items.push(totalPages)
      } else if (currentPage >= totalPages - halfVisible) {
        items.push(1)
        items.push('ellipsis')
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        items.push('ellipsis')
        for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
          items.push(i)
        }
        items.push('ellipsis')
        items.push(totalPages)
      }
    }
    return items
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
<h1 id="ina1p5" className="text-3xl font-bold tracking-tight">Riwayat Aktivitas</h1>
        <p className="text-muted-foreground">
          Pantau semua aktivitas penting dalam sistem distribusi LPG
        </p>
      </div>

{/* Stats Cards */}
<div className="grid gap-4 md:grid-cols-5">
           <Tilt3DCard>
             <CardContent className="pt-6">
               <div className="text-center">
                 <p id="iv8f8z" className="text-3xl font-bold text-foreground">{stats.total}</p>
                 <p className="text-sm text-muted-foreground mt-1">Total Aktivitas</p>
               </div>
             </CardContent>
           </Tilt3DCard>
           <Tilt3DCard>
             <CardContent className="pt-6">
               <div className="text-center">
                 <p id="i6i4kk" className="text-3xl font-bold text-foreground">{stats.payments}</p>
                 <p id="isjhll" className="text-sm text-muted-foreground mt-1">Pembayaran Masuk</p>
               </div>
             </CardContent>
           </Tilt3DCard>
           <Tilt3DCard>
             <CardContent className="pt-6">
               <div className="text-center">
                 <p id="i0gqec" className="text-3xl font-bold text-foreground">{stats.completed}</p>
                 <p className="text-sm text-muted-foreground mt-1">Selesai</p>
               </div>
             </CardContent>
           </Tilt3DCard>
           <Tilt3DCard>
             <CardContent className="pt-6">
               <div className="text-center">
                 <p className="text-3xl font-bold text-foreground">{stats.new}</p>
                 <p className="text-sm text-muted-foreground mt-1">Pesanan Baru</p>
               </div>
             </CardContent>
           </Tilt3DCard>
           <Tilt3DCard>
             <CardContent className="pt-6">
               <div className="text-center">
                 <p id="i5ke5h" className="text-3xl font-bold text-foreground">{stats.shipped}</p>
                 <p className="text-sm text-muted-foreground mt-1">Dikirim</p>
               </div>
             </CardContent>
           </Tilt3DCard>
         </div>

 {/* Activities Section */}
         <Card>
         <CardContent className="space-y-6">
           {/* Filter Tabs */}
  <Tabs value={selectedType} onValueChange={handleTypeChange} className="w-full">
<TabsList className="grid w-full grid-cols-5 bg-transparent p-0 h-auto border-b-2 border-border gap-2" style={{ marginTop: '15px' }}>
              {activityTypes.map(type => (
                <TabsTrigger 
                  key={type.value} 
                  value={type.value} 
                  className="text-xs sm:text-sm rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-4 py-2 transition-all duration-200"
                >
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

{/* Activities List */}
<div className="space-y-2">
              {paginatedActivities.length > 0 ? (
                paginatedActivities.map((activity) => (
                  <ActivityCard 
                    key={activity.id} 
                    activity={activity}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SafeIcon name="InboxX" className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Tidak ada aktivitas untuk filter ini</p>
                </div>
              )}
            </div>

{/* Items Per Page Selector & Pagination */}
            {filteredActivities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label htmlFor="items-per-page" className="text-sm text-muted-foreground">
                      Tampilkan:
                    </label>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(Number(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEMS_PER_PAGE_OPTIONS.map(option => (
                          <SelectItem key={option} value={option.toString()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Menampilkan {startIndex + 1} hingga {Math.min(endIndex, filteredActivities.length)} dari {filteredActivities.length} aktivitas
                  </p>
                </div>
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {getPaginationItems().map((item, index) => (
                        <PaginationItem key={index}>
                          {item === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              isActive={item === currentPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(item as number)
                              }}
                              className="cursor-pointer"
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
