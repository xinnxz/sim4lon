
import { Card, CardContent } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface KPICardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
}

export default function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  const isPositive = trend === 'up'

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
              {change} dari periode sebelumnya
            </p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            isPositive ? 'bg-primary/10' : 'bg-destructive/10'
          }`}>
            <SafeIcon 
              name={icon} 
              className={`h-6 w-6 ${isPositive ? 'text-primary' : 'text-destructive'}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
