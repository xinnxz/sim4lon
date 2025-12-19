/**
 * DashboardKPICards - KPI Cards dengan Styling Premium seperti Pangkalan Dashboard
 * 
 * PENJELASAN:
 * Component ini menampilkan 4 KPI cards di dashboard dengan gradient colors yang vibrant:
 * 1. Total Pesanan Hari Ini - Blue gradient
 * 2. Pesanan Belum Diproses (pending) - Orange/Amber gradient
 * 3. Pesanan Selesai Hari Ini - Green gradient
 * 4. Total Stok LPG - White with purple accent
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import { dashboardApi, type DashboardStats } from '@/lib/api'

/**
 * Format angka dengan separator ribuan
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Loading skeleton untuk KPI cards
 */
const KPICardSkeleton = ({ index }: { index: number }) => (
  <div className={`animate-pulse kpi-card-${index + 1}`}>
    <div className="h-32 bg-slate-200 rounded-2xl" />
  </div>
)

export default function DashboardKPICards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const data = await dashboardApi.getStats()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
        setError('Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
        {[0, 1, 2, 3].map((index) => (
          <KPICardSkeleton key={index} index={index} />
        ))}
      </div>
    )
  }

  // Calculate totals
  const totalStock = stats?.dynamicProducts?.reduce((sum, p) => sum + p.stock.current, 0) || 0
  const productCount = stats?.dynamicProducts?.length || 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
      {/* Total Pesanan - Blue Gradient */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
            <SafeIcon name="ShoppingCart" className="h-4 w-4" />
            Total Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl lg:text-4xl font-bold tracking-tight">{formatNumber(stats?.todayOrders || 0)}</p>
          <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
            <SafeIcon name="CalendarDays" className="h-3.5 w-3.5" />
            Hari ini
          </p>
        </CardContent>
      </Card>

      {/* Menunggu Pembayaran - Amber/Orange Gradient */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
            <SafeIcon name="Clock" className="h-4 w-4" />
            Menunggu Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl lg:text-4xl font-bold tracking-tight">{formatNumber(stats?.pendingOrders || 0)}</p>
          <p className="text-amber-100 text-sm mt-2 flex items-center gap-1">
            <SafeIcon name="AlertCircle" className="h-3.5 w-3.5" />
            Perlu ditagih
          </p>
        </CardContent>
      </Card>

      {/* Pesanan Selesai - Green Gradient */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
            <SafeIcon name="Truck" className="h-4 w-4" />
            Pesanan Selesai
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl lg:text-4xl font-bold tracking-tight">{formatNumber(stats?.completedOrders || 0)}</p>
          <p className="text-green-100 text-sm mt-2 flex items-center gap-1">
            <SafeIcon name="CheckCircle2" className="h-3.5 w-3.5" />
            Hari ini
          </p>
        </CardContent>
      </Card>

      {/* Total Stok - White with Purple accent */}
      <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
              <SafeIcon name="Package" className="h-4 w-4 text-purple-600" />
            </div>
            Total Stok LPG
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">{formatNumber(totalStock)}</p>
          <p className="text-slate-500 text-sm mt-2 flex items-center gap-1">
            <SafeIcon name="Layers" className="h-3.5 w-3.5" />
            {productCount > 0 ? `${productCount} jenis produk` : 'Belum ada produk'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}