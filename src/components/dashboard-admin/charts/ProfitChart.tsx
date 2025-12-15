/**
 * ProfitChart - Chart Keuntungan dengan Data Real dari API
 * 
 * PENJELASAN:
 * Chart ini menampilkan profit (10% dari penjualan SELESAI) 7 hari terakhir.
 * Data diambil dari API /dashboard/profit menggunakan dashboardApi.getProfitChart()
 */

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { dashboardApi } from '@/lib/api'

interface ChartDataPoint {
  day: string
  profit: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground">{payload[0].payload.day}</p>
        <p className="text-sm font-bold text-green-600">Rp {(payload[0].value / 1000).toFixed(0)}K</p>
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
            <stop offset="0%" stopColor="hsl(152 100% 35%)" stopOpacity={1} />
            <stop offset="100%" stopColor="hsl(152 100% 45%)" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="day"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.1)', radius: 8 }} />
        <Bar
          dataKey="profit"
          fill="url(#colorProfitGradient)"
          radius={[8, 8, 0, 0]}
          isAnimationActive={isVisible}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

