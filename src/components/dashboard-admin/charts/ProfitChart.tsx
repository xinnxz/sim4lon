/**
 * ProfitChart - Chart Keuntungan dengan Data Real dari API
 * 
 * PENJELASAN:
 * Chart ini menampilkan profit (Harga Jual - Modal) 7 hari terakhir.
 * Data diambil dari API /dashboard/profit menggunakan dashboardApi.getProfitChart()
 * 
 * RUMUS PROFIT:
 * Profit = Total Penjualan - Total Modal
 * - Total Penjualan = sum(price_per_unit * qty) dari order_items
 * - Total Modal = sum(cost_price * qty) dari lpg_products
 */

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { dashboardApi } from '@/lib/api'

interface ChartDataPoint {
  day: string
  profit: number
  totalSales?: number
  totalCost?: number
  orderCount?: number
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 backdrop-blur-sm min-w-[200px]">
        <p className="text-sm font-bold text-foreground mb-3 border-b pb-2">{data.day}</p>

        {/* Total Penjualan */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Total Penjualan:</span>
          <span className="text-sm font-semibold text-blue-600">{formatRupiah(data.totalSales)}</span>
        </div>

        {/* Total Modal */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Total Modal:</span>
          <span className="text-sm font-semibold text-orange-600">{formatRupiah(data.totalCost)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed my-2"></div>

        {/* Keuntungan */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-foreground">Keuntungan:</span>
          <span className="text-sm font-bold text-green-600">{formatRupiah(data.profit)}</span>
        </div>

        {/* Order Count */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">Pesanan Selesai:</span>
          <span className="text-xs font-medium text-foreground">{data.orderCount} pesanan</span>
        </div>
      </div>
    )
  }
  return null
}

const GRADIENT_COLORS = [
  'hsl(152 100% 35%)',
  'hsl(152 95% 38%)',
  'hsl(152 90% 40%)',
  'hsl(152 85% 38%)',
  'hsl(152 90% 35%)',
  'hsl(152 95% 33%)',
  'hsl(152 100% 30%)',
]

interface ProfitChartProps {
  isVisible?: boolean
}

export default function ProfitChart({ isVisible = true }: ProfitChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardApi.getProfitChart()
        setData(response.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch profit chart:', err)
        setError('Gagal memuat data')
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
        <div className="text-muted-foreground">Belum ada data keuntungan</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="colorProfitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(152 100% 40%)" stopOpacity={1} />
            <stop offset="50%" stopColor="hsl(152 90% 35%)" stopOpacity={0.95} />
            <stop offset="100%" stopColor="hsl(152 85% 30%)" stopOpacity={0.9} />
          </linearGradient>
          <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="barShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="hsl(152 100% 30%)" floodOpacity="0.3" />
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
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(152 100% 40% / 0.08)', radius: 8 }}
        />
        <Bar
          dataKey="profit"
          fill="url(#colorProfitGradient)"
          radius={[10, 10, 0, 0]}
          isAnimationActive={isVisible}
          animationBegin={0}
          animationDuration={1000}
          animationEasing="ease-out"
          style={{ filter: 'url(#barShadow)' }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

