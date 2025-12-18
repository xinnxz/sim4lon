/**
 * StockChart - Chart PEMAKAIAN Stok DINAMIS per Produk LPG
 * 
 * PENJELASAN:
 * Chart ini menampilkan PEMAKAIAN stok (yang keluar/dijual) 7 hari terakhir.
 * Bukan level stok, tapi berapa banyak yang terjual per hari.
 * Otomatis handle produk baru tanpa perlu update code.
 * Warna line diambil dari product.color di database.
 */

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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
    // Fungsi untuk menentukan level pemakaian
    const getUsageLevel = (qty: number) => {
      if (qty <= 0) return { text: 'TIDAK ADA', color: 'text-gray-500 bg-gray-100' }
      if (qty >= 50) return { text: 'TINGGI', color: 'text-green-600 bg-green-100' }
      if (qty >= 20) return { text: 'SEDANG', color: 'text-blue-600 bg-blue-100' }
      return { text: 'RENDAH', color: 'text-yellow-600 bg-yellow-100' }
    }

    // Hitung total pemakaian
    const totalUsage = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0)

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 backdrop-blur-sm min-w-[220px]">
        <p className="text-sm font-bold text-foreground mb-3 border-b pb-2">📦 Pemakaian - {label}</p>

        {/* Usage per product */}
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            const level = getUsageLevel(entry.value)
            return (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-foreground truncate max-w-[100px]">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: entry.color }}>
                    {entry.value} Unit
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${level.color}`}>
                    {level.text}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total summary */}
        <div className="border-t mt-3 pt-2 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Total Pemakaian:</span>
          <span className="text-sm font-bold text-foreground">{totalUsage} Unit</span>
        </div>
      </div>
    )
  }
  return null
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
      <LineChart
        data={chartData.data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        className="drop-shadow-sm"
      >
        <defs>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
          tickFormatter={(value) => `${value}`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, strokeDasharray: '5 5', opacity: 0.4 }}
        />
        <Legend
          wrapperStyle={{ fontSize: '10px', paddingTop: '12px' }}
          iconType="circle"
          iconSize={8}
        />
        {/* Dynamic Lines - one per product */}
        {chartData.products.map((product, index) => (
          <Line
            key={product.id}
            type="monotone"
            dataKey={product.id}
            name={product.name}
            stroke={product.color}
            strokeWidth={2.5}
            dot={{
              fill: product.color,
              r: 4,
              strokeWidth: 2,
              stroke: 'hsl(var(--background))',
            }}
            activeDot={{
              r: 7,
              strokeWidth: 3,
              stroke: 'hsl(var(--background))',
              fill: product.color,
              filter: 'url(#lineGlow)'
            }}
            isAnimationActive={isVisible}
            animationBegin={index * 150}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
