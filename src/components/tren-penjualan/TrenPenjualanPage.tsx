
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import SalesChart from './SalesChart'
import DateRangeFilter from './DateRangeFilter'
import SalesMetrics from './SalesMetrics'
import ReportNavigation from '@/components/pemakaian-stok/ReportNavigation'

export default function TrenPenjualanPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  })

  const handleDateRangeChange = (from: Date, to: Date) => {
    setDateRange({ from, to })
  }

return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Tren Penjualan</h1>
          <p className="text-muted-foreground mt-1">
            Analisis tren penjualan mingguan dan historis untuk memahami pola bisnis Anda
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a href="./dashboard-laporan.html">
            <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Kembali
          </a>
        </Button>
      </div>

      {/* Report Navigation Tabs */}
      <ReportNavigation currentPage="tren_penjualan" />

      {/* Sales Metrics Summary */}
      <SalesMetrics dateRange={dateRange} />

{/* Main Content */}
       <div className="w-full space-y-6">
         {/* Date Range Filter */}
         <Card className="animate-fadeInUp">
           <CardHeader>
             <CardTitle>Filter Periode</CardTitle>
             <CardDescription>
               Pilih rentang tanggal untuk melihat tren penjualan spesifik
             </CardDescription>
           </CardHeader>
           <CardContent>
             <DateRangeFilter 
               onDateRangeChange={handleDateRangeChange}
               initialFrom={dateRange.from}
               initialTo={dateRange.to}
             />
           </CardContent>
         </Card>

         {/* Sales Chart */}
         <Card className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
           <CardHeader>
             <CardTitle>Tren Penjualan Mingguan</CardTitle>
             <CardDescription>
               Visualisasi penjualan harian dalam periode yang dipilih
             </CardDescription>
           </CardHeader>
           <CardContent>
             <SalesChart dateRange={dateRange} />
           </CardContent>
         </Card>

         {/* Additional Insights */}
         <Card className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
           <CardHeader>
             <CardTitle>Ringkasan Analisis</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <p className="text-sm text-muted-foreground">Hari Penjualan Tertinggi</p>
                 <p className="text-2xl font-bold text-primary">Senin, 15 Jan 2024</p>
                 <p className="text-sm text-muted-foreground">Rp 45.500.000</p>
               </div>
               <div className="space-y-2">
                 <p className="text-sm text-muted-foreground">Rata-rata Penjualan Harian</p>
                 <p className="text-2xl font-bold text-primary">Rp 32.750.000</p>
                 <p className="text-sm text-muted-foreground">Dari 30 hari terakhir</p>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
    </div>
  )
}
