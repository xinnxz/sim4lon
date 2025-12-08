import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { use3DTilt } from '@/hooks/use3DTilt'
import Tilt3DCard from './Tilt3DCard'

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

interface KPICardItemProps {
  kpi: typeof kpiData[0]
  index: number
}

const KPICardItem = ({ kpi, index }: KPICardItemProps) => {
  const { cardRef, isHovering, handleMouseMove, handleMouseEnter, handleMouseLeave, getTransform } = use3DTilt()

  return (
    <div
      ref={cardRef}
      className={`animate-scaleIn kpi-card-${index + 1}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: getTransform(),
          transformStyle: 'preserve-3d',
          transition: isHovering ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)',
        }}
      >
<div 
          className="overflow-hidden shadow-sm transition-shadow duration-300 ease-out cursor-default group relative bg-gradient-to-br from-card via-card to-card/70 h-full rounded-xl border-0 bg-card text-card-foreground"
          style={{
            boxShadow: isHovering 
              ? '0 8px 16px -2px rgba(0, 0, 0, 0.1)' 
              : '0 2px 8px -1px rgba(0, 0, 0, 0.08)',
            transition: 'box-shadow 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
            border: 'none',
            pointerEvents: 'auto'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm sm:text-base font-semibold leading-tight">{kpi.title}</CardTitle>
            <div className={`${kpi.color} p-2.5 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg`}>
              <SafeIcon name={kpi.icon} className={`h-5 w-5 ${kpi.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl sm:text-3xl font-bold transition-colors duration-300">{kpi.value}</div>
            <Badge 
              variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
              className="text-xs font-semibold transition-all duration-300"
            >
              {kpi.change} dari kemarin
            </Badge>
          </CardContent>
        </div>
      </div>
    </div>
  )
}

export default function DashboardKPICards() {
  return (
    <div id="il6kka" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
      {kpiData.map((kpi, index) => (
        <KPICardItem key={kpi.title} kpi={kpi} index={index} />
      ))}
    </div>
  )
}