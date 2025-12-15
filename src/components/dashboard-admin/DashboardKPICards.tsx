/**
 * DashboardKPICards - KPI Cards dengan Data Real dari API
 * 
 * PENJELASAN:
 * Component ini menampilkan 4 KPI cards di dashboard:
 * 1. Total Pesanan Hari Ini
 * 2. Pesanan Belum Diproses (pending)
 * 3. Pesanan Selesai Hari Ini
 * 4. Total Stok LPG
 * 
 * Data diambil dari API /dashboard/stats menggunakan useEffect.
 */

import { useState, useEffect } from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { use3DTilt } from '@/hooks/use3DTilt'
import { dashboardApi, type DashboardStats } from '@/lib/api'

interface KPICardData {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: string
  color: string
  iconColor: string
}

interface KPICardItemProps {
  kpi: KPICardData
  index: number
}

const KPICardItem = ({ kpi, index }: KPICardItemProps) => {
  const { cardRef, isHovering, handleMouseMove, handleMouseEnter, handleMouseLeave, getTransform } = use3DTilt()

  return (
    <div
      ref={cardRef}
      className={`animate-scaleIn kpi-card-${index + 1}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: getTransform(),
          transformStyle: 'preserve-3d',
          transition: isHovering ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)',
        }}
      >
        <div
          className="overflow-hidden shadow-sm transition-shadow duration-300 ease-out cursor-default group relative bg-gradient-to-br from-card via-card to-card/70 h-full rounded-xl border-0 bg-card text-card-foreground"
          style={{
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'box-shadow 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
            border: '1px solid hsl(var(--border))',
            pointerEvents: 'auto'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm sm:text-base font-semibold leading-tight">{kpi.title}</CardTitle>
            <div className={`${kpi.color} p-2.5 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg`}>
              <SafeIcon name={kpi.icon} className={`h-5 w-5 ${kpi.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl sm:text-3xl font-bold transition-colors duration-300">{kpi.value}</div>
            <Badge
              variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
              className="text-xs font-semibold transition-all duration-300"
            >
              {kpi.change}
            </Badge>
          </CardContent>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton untuk KPI cards
 */
const KPICardSkeleton = ({ index }: { index: number }) => (
  <div className={`animate-pulse kpi-card-${index + 1}`}>
    <div className="h-32 bg-muted rounded-xl" />
  </div>
)

/**
 * Format angka dengan separator ribuan
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

export default function DashboardKPICards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch data dari API saat component mount
   */
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

  // Show loading skeleton while fetching
  if (isLoading) {
    return (
      <div id="il6kka" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
        {[0, 1, 2, 3].map((index) => (
          <KPICardSkeleton key={index} index={index} />
        ))}
      </div>
    )
  }

  // Build KPI data from API response
  // Calculate total stock - ONLY from dynamic products (no legacy fallback)
  const totalStock = stats?.dynamicProducts?.reduce((sum, p) => sum + p.stock.current, 0) || 0;
  const hasProducts = stats?.dynamicProducts && stats.dynamicProducts.length > 0;

  // Format stock breakdown for badge text
  const getStockBreakdown = () => {
    if (!hasProducts) {
      return 'Belum ada produk LPG';
    }
    const productCount = stats!.dynamicProducts.length;
    return `${productCount} jenis produk`;
  };

  const kpiData: KPICardData[] = [
    {
      title: 'Total Pesanan',
      value: formatNumber(stats?.todayOrders || 0),
      change: 'Hari ini',
      changeType: 'positive',
      icon: 'ShoppingCart',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Menunggu Pembayaran',
      value: formatNumber(stats?.pendingOrders || 0),
      change: 'Perlu ditagih',
      changeType: stats && stats.pendingOrders > 5 ? 'negative' : 'positive',
      icon: 'Clock',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Pesanan Selesai',
      value: formatNumber(stats?.completedOrders || 0),
      change: 'Hari ini',
      changeType: 'positive',
      icon: 'Truck',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Stok LPG',
      value: formatNumber(totalStock),
      change: getStockBreakdown(),
      changeType: totalStock < 100 ? 'negative' : 'positive',
      icon: 'Package',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ]

  return (
    <div id="il6kka" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
      {kpiData.map((kpi, index) => (
        <KPICardItem key={kpi.title} kpi={kpi} index={index} />
      ))}
    </div>
  )
}