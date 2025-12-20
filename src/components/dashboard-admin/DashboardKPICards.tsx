/**
 * DashboardKPICards - KPI Cards dengan Premium Animations
 * 
 * PENJELASAN ANIMASI:
 * 1. useCountUp Hook - Animasi angka yang count-up dari 0 ke nilai target
 * 2. Staggered Entrance - Cards muncul berurutan dengan delay dan blur effect
 * 3. 3D Tilt Hover - Effect parallax halus saat hover
 * 4. Floating Orbs - Decorative background circles yang bergerak
 * 5. Icon Rotation - Icons berputar halus saat card di-hover
 * 6. Glow Effect - Ambient glow yang pulse saat hover
 */

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import { dashboardApi, type DashboardStats } from '@/lib/api'

/**
 * Custom Hook: useCountUp
 * Animasi angka yang naik dari 0 ke target value
 */
function useCountUp(target: number, duration: number = 1500, startDelay: number = 0): number {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (target === 0) {
      setCount(0)
      return
    }

    const startAnimation = () => {
      hasStarted.current = true
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp
        }

        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
        // Easing function: easeOutExpo
        const easeProgress = 1 - Math.pow(2, -10 * progress)
        setCount(Math.floor(easeProgress * target))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(target)
        }
      }
      requestAnimationFrame(animate)
    }

    const timeoutId = setTimeout(startAnimation, startDelay)
    return () => {
      clearTimeout(timeoutId)
      startTimeRef.current = null
    }
  }, [target, duration, startDelay])

  return count
}

/**
 * Format angka dengan separator ribuan
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Format angka sebagai currency Rupiah dengan angka lengkap
 * Contoh: 16700000 → Rp 16.700.000
 */
function formatCurrency(num: number): string {
  return `Rp ${formatNumber(num)}`
}

/**
 * Animated Number Component dengan count-up effect
 */
function AnimatedNumber({
  value,
  delay = 0,
  className = '',
  isCurrency = false
}: {
  value: number
  delay?: number
  className?: string
  isCurrency?: boolean
}) {
  const animatedValue = useCountUp(value, 1200, delay)
  return (
    <span className={`kpi-number animate-countUp ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {isCurrency ? formatCurrency(animatedValue) : formatNumber(animatedValue)}
    </span>
  )
}

/**
 * Floating Decorative Orb - Warna lebih jelas
 */
function FloatingOrb({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`absolute rounded-full bg-white/30 animate-floatOrb ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

/**
 * Loading skeleton untuk KPI cards dengan shimmer
 */
const KPICardSkeleton = ({ index }: { index: number }) => (
  <div
    className={`animate-slideInBlur stagger-${index + 1}`}
    style={{ opacity: 0 }}
  >
    <div className="h-32 bg-gradient-to-br from-slate-200 to-slate-100 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 shine-effect" />
    </div>
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

  // KPI Card data
  const kpiCards = [
    {
      title: 'Total Pesanan',
      value: stats?.todayOrders || 0,
      subtitle: 'Hari ini',
      icon: 'ShoppingCart',
      subtitleIcon: 'CalendarDays',
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-blue-500/25 hover:shadow-blue-500/40',
      textAccent: 'text-blue-100',
      delay: 100
    },
    {
      title: 'Penjualan Hari Ini',
      value: stats?.todaySales || 0,
      subtitle: 'Total revenue',
      icon: 'Banknote',
      subtitleIcon: 'TrendingUp',
      gradient: 'from-rose-500 to-red-600',
      shadowColor: 'shadow-rose-500/25 hover:shadow-rose-500/40',
      textAccent: 'text-rose-100',
      delay: 200,
      isCurrency: true
    },
    {
      title: 'Pesanan Selesai',
      value: stats?.completedOrders || 0,
      subtitle: 'Hari ini',
      icon: 'Truck',
      subtitleIcon: 'CheckCircle2',
      gradient: 'from-green-500 to-emerald-600',
      shadowColor: 'shadow-green-500/25 hover:shadow-green-500/40',
      textAccent: 'text-green-100',
      delay: 300
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
      {/* Colored KPI Cards */}
      {kpiCards.map((card, index) => (
        <div
          key={card.title}
          className="animate-slideInBlur"
          style={{ animationDelay: `${card.delay}ms`, opacity: 0 }}
        >
          <Card
            className={`group relative overflow-hidden h-[140px] bg-gradient-to-br ${card.gradient} text-white shadow-lg ${card.shadowColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0`}
          >
            {/* Floating Orbs Decoration */}
            <FloatingOrb className="w-24 h-24 top-0 right-0 -translate-y-1/2 translate-x-1/2" delay={index * 0.5} />
            <FloatingOrb className="w-16 h-16 bottom-0 left-0 translate-y-1/2 -translate-x-1/2 opacity-50" delay={index * 0.5 + 1} />

            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <SafeIcon name={card.icon} className="h-4 w-4 icon-bounce-target icon-rotate-hover transition-transform duration-300" />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className={`${card.isCurrency ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-4xl'} font-bold tracking-tight`}>
                <AnimatedNumber value={card.value} delay={card.delay + 200} isCurrency={card.isCurrency} />
              </p>
              <p className={`${card.textAccent} text-sm mt-2 flex items-center gap-1`}>
                <SafeIcon name={card.subtitleIcon} className="h-3.5 w-3.5" />
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Total Stok - White Card with Purple accent */}
      <div
        className="animate-slideInBlur"
        style={{ animationDelay: '400ms', opacity: 0 }}
      >
        <Card
          className="group relative overflow-hidden h-[140px] bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0"
        >
          {/* Floating Orbs Decoration - Warna lebih jelas */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-100 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed opacity-80" />

          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                <SafeIcon name="Package" className="h-4 w-4 text-purple-600 icon-bounce-target icon-rotate-hover" />
              </div>
              Total Stok LPG
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              <AnimatedNumber value={totalStock} delay={600} />
            </p>
            <p className="text-slate-500 text-sm mt-2 flex items-center gap-1">
              <SafeIcon name="Layers" className="h-3.5 w-3.5" />
              {productCount > 0 ? `${productCount} jenis produk` : 'Belum ada produk'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
