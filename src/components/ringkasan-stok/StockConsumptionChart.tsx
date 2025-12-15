/**
 * StockConsumptionChart - Chart Pemakaian Stok DINAMIS per Produk LPG
 * 
 * PENJELASAN:
 * Chart ini menampilkan tren pemakaian stok 7 hari terakhir untuk SEMUA produk LPG aktif.
 * Data diambil dari API /dashboard/stock-consumption
 * Warna line sesuai dengan product.color di database.
 */

'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dashboardApi } from '@/lib/api'

interface ProductInfo {
  id: string
  name: string
  color: string
}

interface ChartResponse {
  products: ProductInfo[]
  data: Record<string, any>[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value} tabung</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface StockConsumptionChartProps {
  refreshTrigger?: number
}

export default function StockConsumptionChart({ refreshTrigger }: StockConsumptionChartProps) {
  const [chartData, setChartData] = useState<ChartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Reuse stock chart endpoint - shows stock per product per day
        const response = await dashboardApi.getStockChart()
        setChartData(response as ChartResponse)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch stock consumption chart:', err)
        setError('Gagal memuat data')
        setChartData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [refreshTrigger])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Memuat data...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-destructive text-sm">{error}</div>
      </div>
    )
  }

  // No data state
  if (!chartData || chartData.data.length === 0 || chartData.products.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Belum ada data pemakaian stok</div>
      </div>
    )
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
          <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '11px' }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '11px' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, opacity: 0.3 }} />
          <Legend
            wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
            iconType="line"
          />
          {/* Dynamic Lines - one per product */}
          {chartData.products.map((product, index) => (
            <Line
              key={product.id}
              type="monotone"
              dataKey={product.id}
              name={product.name}
              stroke={product.color}
              strokeWidth={2}
              dot={{ fill: product.color, r: 3, strokeWidth: 1, stroke: 'hsl(var(--background))' }}
              activeDot={{ r: 5, strokeWidth: 2 }}
              animationBegin={index * 80}
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
