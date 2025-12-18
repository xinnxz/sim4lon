/**
 * PangkalanOrderChart - Chart Top 3 Pangkalan dengan Data Real dari API
 * 
 * PENJELASAN:
 * Chart ini menampilkan top 3 pangkalan berdasarkan jumlah order.
 * Data diambil dari API /dashboard/top-pangkalan
 * Includes button to view full ranking in modal
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
import { dashboardApi, pangkalanApi } from '@/lib/api'

interface ChartDataPoint {
  name: string
  value: number
  index?: number
  percentage?: string
}

// 3 warna untuk 3 pangkalan
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const index = payload[0].payload.index ?? 0

    // Determine ranking badge color
    const getRankBadge = (idx: number) => {
      if (idx === 0) return { text: '🥇 #1', color: 'text-yellow-600 bg-yellow-100' }
      if (idx === 1) return { text: '🥈 #2', color: 'text-gray-600 bg-gray-100' }
      if (idx === 2) return { text: '🥉 #3', color: 'text-amber-600 bg-amber-100' }
      return { text: `#${idx + 1}`, color: 'text-muted-foreground bg-muted' }
    }

    const rankBadge = getRankBadge(index)

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 backdrop-blur-sm min-w-[200px]">
        {/* Ranking Badge */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rankBadge.color}`}>
            {rankBadge.text}
          </span>
          <span className="text-sm font-bold text-primary">{data.percentage}%</span>
        </div>

        {/* Nama Pangkalan */}
        <p className="text-sm font-bold text-foreground mb-2 truncate max-w-[180px]" title={data.name}>
          {data.name}
        </p>

        {/* Jumlah Pesanan */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Total Pesanan:</span>
          <span className="text-sm font-bold text-green-600">{data.value} pesanan</span>
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

        // Calculate percentages and add index for ranking
        const totalValue = response.data.reduce((sum, item) => sum + item.value, 0)
        const processedData = response.data.map((item, index) => ({
          ...item,
          index,
          percentage: totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0'
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
        // Fetch all pangkalan with order counts
        const response = await pangkalanApi.getAll(1, 100) // Get up to 100 pangkalan
        // Sort by order count (if available) or just show all
        const sorted = response.data
          .filter((p: any) => p._count?.orders > 0)
          .map((p: any) => ({
            name: p.name,
            value: p._count?.orders || 0,
          }))
          .sort((a: any, b: any) => b.value - a.value)

        const total = sorted.reduce((sum: number, item: any) => sum + item.value, 0)
        const withPercentage = sorted.map((item: any) => ({
          ...item,
          percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
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
        <div className="animate-pulse text-muted-foreground text-sm">Memuat data...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-destructive text-sm">{error}</div>
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
              dataKey="value"
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
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend - Below Chart */}
      <div className="flex flex-col gap-1.5 pt-2 pb-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="flex-1 truncate text-muted-foreground" title={item.name}>
              {item.name}
            </span>
            <span className="font-semibold text-foreground shrink-0">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleOpenModal}
          >
            <SafeIcon name="BarChart3" className="h-3.5 w-3.5 mr-1.5" />
            Lihat Semua Ranking
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Ranking Semua Pangkalan</DialogTitle>
            <DialogDescription>
              Berdasarkan jumlah pesanan
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[50vh] pr-2">
            {isLoadingMore ? (
              <div className="flex items-center justify-center py-8">
                <SafeIcon name="Loader2" className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : allRankings.length > 0 ? (
              <div className="space-y-2">
                {allRankings.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-600 text-white' :
                          'bg-muted text-muted-foreground'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.value} pesanan</p>
                    </div>
                    <span className="text-sm font-semibold text-primary shrink-0">
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