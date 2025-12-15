/**
 * SalesChart - Chart Pesanan Mingguan dengan Data Real dari API
 * 
 * PENJELASAN:
 * Chart ini menampilkan data penjualan (total_amount) 7 hari terakhir.
 * Data diambil dari API /dashboard/sales menggunakan dashboardApi.getSalesChart()
 */

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardApi } from '@/lib/api'

interface ChartDataPoint {
  day: string
  sales: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground">{payload[0].payload.day}</p>
        <p className="text-sm text-primary font-bold">
          Rp {(payload[0].value / 1000000).toFixed(1)}Jt
        </p>
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
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
          tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}Jt`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, opacity: 0.3 }} />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--primary))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          activeDot={{ r: 7, strokeWidth: 2 }}
          isAnimationActive={isVisible}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-in-out"
          fillOpacity={1}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

