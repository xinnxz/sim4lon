'use client'

/**
 * WeeklyConsumptionChart - Chart Pemakaian Stok DINAMIS per Produk LPG Aktif
 * 
 * PENJELASAN:
 * Chart ini menampilkan tren pemakaian stok 7 hari terakhir untuk produk LPG AKTIF saja.
 * - Data diambil dari API dashboardApi.getStockChart() (sama dengan dashboard)
 * - Warna line sesuai dengan product.color di database
 * - Tooltip dengan info lengkap (nama produk, qty, kategori)
 * - Auto sync dengan perubahan produk via refreshTrigger
 * - Menggunakan AreaChart dengan premium styling
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts'
import SafeIcon from '@/components/common/SafeIcon'
import { dashboardApi } from '@/lib/api'

interface WeeklyConsumptionChartProps {
  refreshTrigger?: number
}

interface ProductInfo {
  id: string
  name: string
  color: string
}

interface ChartResponse {
  products: ProductInfo[]
  data: Record<string, any>[]
}

// Fungsi untuk menentukan level pemakaian (sama dengan dashboard)
const getUsageLevel = (qty: number) => {
  if (qty <= 0) return { text: 'TIDAK ADA', color: 'text-gray-500 bg-gray-100' }
  if (qty >= 50) return { text: 'TINGGI', color: 'text-green-600 bg-green-100' }
  if (qty >= 20) return { text: 'SEDANG', color: 'text-blue-600 bg-blue-100' }
  return { text: 'RENDAH', color: 'text-yellow-600 bg-yellow-100' }
}

// Premium Custom Tooltip (enhanced from dashboard version)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  const totalQty = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0)

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
        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary font-bold">
          {totalQty} Unit
        </Badge>
      </div>

      {/* Items */}
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
                <span className="text-sm text-gray-700 font-medium truncate max-w-[100px]">
                  {entry.name}
                </span>
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

// Custom Legend with premium styling
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

export default function WeeklyConsumptionChart({ refreshTrigger }: WeeklyConsumptionChartProps) {
  const [chartData, setChartData] = useState<ChartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from same API as dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Use SAME API as dashboard chart for consistent data
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

  // Loading state with premium skeleton
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-primary/80 via-emerald-400 to-primary/80 animate-pulse" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 flex items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <SafeIcon name="Loader2" className="h-5 w-5 animate-spin" />
              <span className="text-sm">Memuat data grafik...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-xl bg-red-100/50">
              <SafeIcon name="AlertTriangle" className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (!chartData || chartData.data.length === 0 || chartData.products.length === 0) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400" />
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-xl bg-gray-100/50">
              <SafeIcon name="BarChart3" className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">Belum ada data pemakaian</p>
            <p className="text-xs text-muted-foreground">Data akan muncul setelah ada pergerakan stok</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Premium top border gradient */}
      <div className="h-1 bg-gradient-to-r from-primary/80 via-emerald-400 to-teal-500" />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-emerald-600"
              style={{ boxShadow: '0 4px 12px -2px rgba(34,197,94,0.4)' }}
            >
              <SafeIcon name="TrendingUp" className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Tren Pemakaian Mingguan</CardTitle>
              <CardDescription className="text-xs">
                Pergerakan stok 7 hari terakhir • {chartData.products.length} produk aktif
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-200">
            <SafeIcon name="Activity" className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <defs>
                {chartData.products.map((product) => (
                  <linearGradient key={`gradient-${product.id}`} id={`gradient-stock-${product.id}`} x1="0" y1="0" x2="0" y2="1">
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
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />

              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
              />

              <Legend content={<CustomLegend />} />

              {/* Dynamic Areas for each product - same data as dashboard */}
              {chartData.products.map((product, index) => (
                <Area
                  key={product.id}
                  type="monotone"
                  dataKey={product.id}
                  name={product.name}
                  stroke={product.color}
                  strokeWidth={2.5}
                  fill={`url(#gradient-stock-${product.id})`}
                  dot={{
                    fill: product.color,
                    r: 4,
                    strokeWidth: 2,
                    stroke: 'white'
                  }}
                  activeDot={{
                    r: 7,
                    strokeWidth: 3,
                    stroke: 'white',
                    style: { filter: `drop-shadow(0 0 6px ${product.color})` }
                  }}
                  animationBegin={index * 100}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
