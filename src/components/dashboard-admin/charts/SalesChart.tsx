/**
 * SalesChart - Chart Pesanan Mingguan dengan Data Real dari API
 * 
 * PENJELASAN:
 * Chart ini menampilkan data penjualan (total_amount) 7 hari terakhir.
 * Data diambil dari API /dashboard/sales menggunakan dashboardApi.getSalesChart()
 */

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardApi } from '@/lib/api'

interface ChartDataPoint {
  day: string
  sales: number
}

// Format angka ke format Rupiah
const formatRupiah = (value: number) => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}Jt`
  } else if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(0)}K`
  }
  return `Rp ${value.toLocaleString('id-ID')}`
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  allData?: ChartDataPoint[]
}

const CustomTooltip = ({ active, payload, allData = [] }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint
    const currentSales = data.sales

    // Hitung rata-rata dari semua data
    const totalSales = allData.reduce((sum, d) => sum + d.sales, 0)
    const avgSales = allData.length > 0 ? totalSales / allData.length : 0
    const diffFromAvg = currentSales - avgSales
    const diffPercent = avgSales > 0 ? ((diffFromAvg / avgSales) * 100).toFixed(1) : '0'

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 backdrop-blur-sm min-w-[180px]">
        <p className="text-sm font-bold text-foreground mb-3 border-b pb-2">{data.day}</p>

        {/* Total Penjualan */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Total Penjualan:</span>
          <span className="text-sm font-bold text-primary">{formatRupiah(currentSales)}</span>
        </div>

        {/* Perbandingan dengan rata-rata */}
        <div className="border-t pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Rata-rata Minggu:</span>
            <span className="text-xs font-medium text-foreground">{formatRupiah(avgSales)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">vs Rata-rata:</span>
            <span className={`text-xs font-semibold ${diffFromAvg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diffFromAvg >= 0 ? '+' : ''}{diffPercent}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

interface SalesChartProps {
  isVisible?: boolean
}

export default function SalesChart({ isVisible = true }: SalesChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardApi.getSalesChart()
        setData(response.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch sales chart:', err)
        setError('Gagal memuat data')
        // Fallback to empty array
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat data...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

  // No data state
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">Belum ada data penjualan</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(152 100% 35%)" stopOpacity={0.4} />
            <stop offset="50%" stopColor="hsl(152 100% 40%)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="hsl(152 100% 45%)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="strokeSales" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(152 100% 35%)" />
            <stop offset="50%" stopColor="hsl(152 90% 40%)" />
            <stop offset="100%" stopColor="hsl(48 100% 50%)" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.4}
          vertical={false}
        />
        <XAxis
          dataKey="day"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '11px', fontWeight: 500 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '11px', fontWeight: 500 }}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}Jt`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip allData={data} />}
          cursor={{ stroke: 'hsl(152 100% 40%)', strokeWidth: 2, strokeDasharray: '5 5', opacity: 0.5 }}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="url(#strokeSales)"
          strokeWidth={3}
          fill="url(#colorSales)"
          dot={{
            fill: 'hsl(152 100% 40%)',
            r: 5,
            strokeWidth: 3,
            stroke: 'hsl(var(--background))',
            filter: 'url(#glow)'
          }}
          activeDot={{
            r: 8,
            strokeWidth: 3,
            stroke: 'hsl(var(--background))',
            fill: 'hsl(152 100% 35%)',
            filter: 'url(#glow)'
          }}
          isAnimationActive={isVisible}
          animationBegin={0}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

