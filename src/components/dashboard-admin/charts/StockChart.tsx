/**
 * StockChart - Chart PEMAKAIAN Stok DINAMIS per Produk LPG
 * 
 * PENJELASAN:
 * Chart ini menampilkan PEMAKAIAN stok (yang keluar/dijual) 7 hari terakhir.
 * Bukan level stok, tapi berapa banyak yang terjual per hari.
 * Otomatis handle produk baru tanpa perlu update code.
 * Warna line diambil dari product.color di database.
 * 
 * Style sama dengan WeeklyConsumptionChart di halaman Stok LPG.
 */

import { useState, useEffect } from 'react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Area, AreaChart
} from 'recharts'
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

// Fungsi untuk menentukan level pemakaian
const getUsageLevel = (qty: number) => {
  if (qty <= 0) return { text: 'TIDAK ADA', color: 'text-gray-500 bg-gray-100' }
  if (qty >= 50) return { text: 'TINGGI', color: 'text-green-600 bg-green-100' }
  if (qty >= 20) return { text: 'SEDANG', color: 'text-blue-600 bg-blue-100' }
  return { text: 'RENDAH', color: 'text-yellow-600 bg-yellow-100' }
}

// Premium Custom Tooltip (sama dengan WeeklyConsumptionChart)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  const totalUsage = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0)

  return (
    <div
      className="rounded-xl border shadow-2xl p-4 min-w-[240px]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-800">📦 Pemakaian - {label}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">
          {totalUsage} Unit
        </span>
      </div>

      {/* Usage per product */}
      <div className="space-y-2">
        {payload.map((entry: any, index: number) => {
          const level = getUsageLevel(entry.value)
          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-700 font-medium truncate max-w-[100px]">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: entry.color }}>
                  {entry.value || 0}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${level.color}`}>
                  {level.text}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Custom Legend with premium styling (sama dengan WeeklyConsumptionChart)
const CustomLegend = ({ payload }: any) => {
  if (!payload) return null
  return (
    <div className="flex flex-wrap justify-center gap-3 pt-4">
      {payload.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/50 shadow-sm hover:shadow-md transition-shadow"
          style={{ borderColor: `${entry.color}40` }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}60` }}
          />
          <span className="text-xs font-medium text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

interface StockChartProps {
  isVisible?: boolean
}

export default function StockChart({ isVisible = true }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardApi.getStockChart()
        setChartData(response as ChartResponse)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch stock chart:', err)
        setError('Gagal memuat data')
        setChartData(null)
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
  if (!chartData || chartData.data.length === 0 || chartData.products.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">Belum ada data stok</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData.data}
        margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
      >
        <defs>
          {chartData.products.map((product) => (
            <linearGradient key={`gradient-${product.id}`} id={`gradient-dashboard-${product.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={product.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={product.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
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
          tickFormatter={(value) => `${value}`}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
        />

        <Legend content={<CustomLegend />} />

        {/* Dynamic Areas with gradient - same style as WeeklyConsumptionChart */}
        {chartData.products.map((product, index) => (
          <Area
            key={product.id}
            type="monotone"
            dataKey={product.id}
            name={product.name}
            stroke={product.color}
            strokeWidth={2.5}
            fill={`url(#gradient-dashboard-${product.id})`}
            dot={{
              fill: product.color,
              r: 4,
              strokeWidth: 2,
              stroke: 'white',
            }}
            activeDot={{
              r: 7,
              strokeWidth: 3,
              stroke: 'white',
              style: { filter: `drop-shadow(0 0 6px ${product.color})` }
            }}
            isAnimationActive={isVisible}
            animationBegin={index * 100}
            animationDuration={800}
            animationEasing="ease-out"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
