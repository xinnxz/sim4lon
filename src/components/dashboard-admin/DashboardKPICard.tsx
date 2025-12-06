
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import type { DashboardKPIModel } from '@/data/dashboard'

interface DashboardKPICardProps {
  kpi: DashboardKPIModel
}

const colorClasses = {
  green: 'bg-primary/10 text-primary',
  yellow: 'bg-accent/20 text-accent-foreground',
  blue: 'bg-blue-100 text-blue-700',
  gray: 'bg-secondary text-foreground',
}

export default function DashboardKPICard({ kpi }: DashboardKPICardProps) {
  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.title}
        </CardTitle>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClasses[kpi.colorClass]}`}>
          <SafeIcon name={kpi.iconName} className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{kpi.value}</div>
          {kpi.unit && (
            <p className="text-xs text-muted-foreground">{kpi.unit}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
