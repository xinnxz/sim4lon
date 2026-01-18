/**
 * PangkalanRevenueChart - Chart Top 3 Pangkalan berdasarkan Pendapatan
 * 
 * PENJELASAN:
 * Chart ini menampilkan top 3 pangkalan berdasarkan total pendapatan (revenue).
 * Data diambil dari API /dashboard/top-pangkalan
 * Menggunakan data consumer_orders untuk konsistensi dengan Laporan Pangkalan
 * 
 * Features:
 * - Donut chart dengan animasi smooth
 * - Tooltip profesional menampilkan pendapatan dan transaksi
 * - Modal untuk melihat ranking lengkap
 * - Format currency Indonesia
 */

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon'
import { dashboardApi } from '@/lib/api'

interface ChartDataPoint {
  name: string
  value: number           // Transaction count
  totalAmount: number     // Revenue in Rupiah
  index?: number
  percentage?: string
}

// Gradient colors untuk 3 pangkalan teratas - Professional palette
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b']

/**
 * Format currency ke Rupiah
 */
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}jt`
  }
  if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(0)}rb`
  }
  return `Rp ${value.toLocaleString('id-ID')}`
}

const formatCurrencyFull = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Custom Tooltip - Tampilan profesional
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint
    const index = data.index ?? 0

    // Ranking badge styling
    const getRankBadge = (idx: number) => {
      if (idx === 0) return { emoji: '🥇', text: 'Peringkat 1', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
      if (idx === 1) return { emoji: '🥈', text: 'Peringkat 2', color: 'text-gray-600 bg-gray-50 border-gray-200' }
      if (idx === 2) return { emoji: '🥉', text: 'Peringkat 3', color: 'text-amber-600 bg-amber-50 border-amber-200' }
      return { emoji: '📊', text: `Peringkat ${idx + 1}`, color: 'text-muted-foreground bg-muted border-border' }
    }

    const rankBadge = getRankBadge(index)

    return (
      <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl p-4 min-w-[220px]">
        {/* Header with rank badge */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
          <span className={`text-xs px-2 py-1 rounded-lg font-medium border ${rankBadge.color}`}>
            {rankBadge.emoji} {rankBadge.text}
          </span>
        </div>

        {/* Nama Pangkalan */}
        <p className="text-sm font-bold text-foreground mb-3 truncate" title={data.name}>
          {data.name}
        </p>

        {/* Stats Grid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <SafeIcon name="Wallet" className="h-3 w-3" />
              Pendapatan
            </span>
            <span className="text-sm font-bold text-green-600">
              {formatCurrencyFull(data.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <SafeIcon name="ShoppingCart" className="h-3 w-3" />
              Transaksi
            </span>
            <span className="text-sm font-semibold text-foreground">
              {data.value} penjualan
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-border/50 mt-1">
            <span className="text-xs text-muted-foreground">Kontribusi</span>
            <span className="text-sm font-bold text-primary">{data.percentage}%</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

interface PangkalanOrderChartProps {
  isVisible?: boolean
}

export default function PangkalanOrderChart({ isVisible = true }: PangkalanOrderChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [allRankings, setAllRankings] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardApi.getTopPangkalan()

        // Calculate percentages based on totalAmount (revenue)
        const totalRevenue = response.data.reduce((sum, item: any) => sum + (item.totalAmount || 0), 0)
        const processedData = response.data.map((item: any, index) => ({
          ...item,
          index,
          percentage: totalRevenue > 0 ? ((item.totalAmount / totalRevenue) * 100).toFixed(1) : '0'
        }))

        setData(processedData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch pangkalan chart:', err)
        setError('Gagal memuat data')
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch all rankings when modal opens
  const handleOpenModal = async () => {
    setShowModal(true)
    if (allRankings.length === 0) {
      setIsLoadingMore(true)
      try {
        const response = await dashboardApi.getTopPangkalan(100) // Get all rankings

        // Calculate percentages based on totalAmount
        const totalRevenue = response.data.reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0)
        const withPercentage = response.data.map((item: any, index) => ({
          ...item,
          index,
          percentage: totalRevenue > 0 ? ((item.totalAmount / totalRevenue) * 100).toFixed(1) : '0'
        }))

        setAllRankings(withPercentage)
      } catch (err) {
        console.error('Failed to fetch all rankings:', err)
      } finally {
        setIsLoadingMore(false)
      }
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
          Memuat data...
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-destructive text-sm flex items-center gap-2">
          <SafeIcon name="AlertCircle" className="h-4 w-4" />
          {error}
        </div>
      </div>
    )
  }

  // No data state
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Belum ada data pangkalan</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Donut Chart - Fill available space */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%"
              paddingAngle={4}
              dataKey="totalAmount"
              labelLine={false}
              isAnimationActive={isVisible}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-in-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend - Below Chart */}
      <div className="flex flex-col gap-2 pt-3 pb-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2.5 text-sm">
            <div
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="flex-1 truncate text-foreground font-medium" title={item.name}>
              {item.name}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">
                {formatCurrency(item.totalAmount)}
              </span>
              <span className="font-bold text-primary text-sm">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs mt-1 hover:bg-primary/5 hover:border-primary/30"
            onClick={handleOpenModal}
          >
            <SafeIcon name="TrendingUp" className="h-3.5 w-3.5 mr-1.5" />
            Lihat Semua Ranking
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SafeIcon name="Award" className="h-5 w-5 text-primary" />
              Ranking Pangkalan
            </DialogTitle>
            <DialogDescription>
              Berdasarkan total pendapatan penjualan
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[55vh] pr-2 -mr-2">
            {isLoadingMore ? (
              <div className="flex items-center justify-center py-8">
                <SafeIcon name="Loader2" className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : allRankings.length > 0 ? (
              <div className="space-y-2">
                {allRankings.map((item, index) => (
                  <div
                    key={item.name}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${index < 3 ? 'bg-gradient-to-r from-muted/80 to-transparent' : 'hover:bg-muted/50'
                      }`}
                  >
                    {/* Rank badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                          index === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white' :
                            'bg-muted text-muted-foreground'
                      }`}>
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.value} transaksi</span>
                        <span>•</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrencyFull(item.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Percentage */}
                    <span className="text-sm font-bold text-primary shrink-0">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Tidak ada data pangkalan
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
