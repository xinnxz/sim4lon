
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'

const kpiData = [
  {
    title: 'Total Pesanan Hari Ini',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: 'ShoppingCart',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Pesanan Belum Diproses',
    value: '8',
    change: '-3%',
    changeType: 'positive',
    icon: 'Clock',
    color: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
{
    title: 'Pesanan Selesai Hari Ini',
    value: '15',
    change: '+5%',
    changeType: 'positive',
    icon: 'Truck',
    color: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    title: 'Total Stok LPG',
    value: '2,450',
    change: '-8%',
    changeType: 'negative',
    icon: 'Package',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600'
  }
]

export default function DashboardKPICards() {
  return (
    <div id="il6kka" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
      {kpiData.map((kpi, index) => (
        <div 
          key={kpi.title}
          className={`animate-scaleIn kpi-card-${index + 1}`}
        >
          <Card className="overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out cursor-default">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium leading-tight">{kpi.title}</CardTitle>
              <div className={`${kpi.color} p-2 rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                <SafeIcon name={kpi.icon} className={`h-4 w-4 ${kpi.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xl sm:text-2xl font-bold transition-colors duration-300">{kpi.value}</div>
              <Badge 
                variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
                className="text-xs transition-all duration-300"
              >
                {kpi.change} dari kemarin
              </Badge>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
