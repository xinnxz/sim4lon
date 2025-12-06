
import { Card, CardContent } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface KPICardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: string
  color: string
  iconColor: string
}

export default function KPICard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  iconColor,
}: KPICardProps) {
  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? '↑' : '↓'} {change} dari kemarin
            </p>
          </div>
          <div className={`${color} p-3 rounded-lg`}>
            <SafeIcon name={icon} className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
