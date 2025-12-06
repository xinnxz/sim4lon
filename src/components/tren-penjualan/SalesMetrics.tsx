
import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface SalesMetricsProps {
  dateRange: {
    from: Date
    to: Date
  }
}

// Mock data generator for metrics
const generateMetrics = (from: Date, to: Date) => {
  const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
  
  const totalSales = 982500000 + Math.random() * 100000000
  const totalOrders = Math.floor(Math.random() * 500) + 300
  const avgDailySales = totalSales / days
  const growthRate = (Math.random() * 30 - 5).toFixed(1)

  return {
    totalSales,
    totalOrders,
    avgDailySales,
    growthRate: parseFloat(growthRate),
  }
}

export default function SalesMetrics({ dateRange }: SalesMetricsProps) {
  const metrics = useMemo(() => {
    return generateMetrics(dateRange.from, dateRange.to)
  }, [dateRange])

  const metrics_data = [
    {
      title: 'Total Penjualan',
      value: `Rp ${(metrics.totalSales / 1000000).toFixed(1)}M`,
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      delay: '0s',
    },
    {
      title: 'Total Pesanan',
      value: metrics.totalOrders.toString(),
      icon: 'ShoppingCart',
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/20',
      delay: '0.1s',
    },
    {
      title: 'Rata-rata Harian',
      value: `Rp ${(metrics.avgDailySales / 1000000).toFixed(1)}M`,
      icon: 'BarChart3',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      delay: '0.2s',
    },
    {
      title: 'Pertumbuhan',
      value: `${metrics.growthRate > 0 ? '+' : ''}${metrics.growthRate}%`,
      icon: metrics.growthRate > 0 ? 'ArrowUp' : 'ArrowDown',
      color: metrics.growthRate > 0 ? 'text-primary' : 'text-destructive',
      bgColor: metrics.growthRate > 0 ? 'bg-primary/10' : 'bg-destructive/10',
      delay: '0.3s',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics_data.map((metric, index) => (
        <Card 
          key={index}
          className="animate-fadeInUp hover:shadow-lg transition-all duration-300"
          style={{ animationDelay: metric.delay }}
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {metric.value}
                </p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <SafeIcon 
                  name={metric.icon} 
                  className={`h-6 w-6 ${metric.color}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
