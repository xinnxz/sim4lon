
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import { LPG_TYPES } from '@/data/enums'

interface StockItem {
  id: string
  name: string
  label: string
  size: string
  quantity: number
  unit: string
  minStock: number
  maxCapacity: number
  status: 'normal' | 'warning' | 'critical'
  icon: string
  color: string
  bgColor: string
}

// Mock stock quantities - in real app, would come from API/database
const stockQuantities: Record<string, number> = {
  '3': 450,
  '5': 300,
  '12': 320,
  '15': 290,
  '25': 180
}

const minStockValues: Record<string, number> = {
  '3': 80,
  '5': 100,
  '12': 120,
  '15': 100,
  '25': 80
}

const maxCapacityValues: Record<string, number> = {
  '3': 300,
  '5': 400,
  '12': 400,
  '15': 400,
  '25': 300
}

const getStatusFromPercentage = (percentage: number): 'normal' | 'warning' | 'critical' => {
  if (percentage < 25) return 'critical'
  if (percentage < 75) return 'normal'
  return 'normal'
}

// Generate stock data dynamically from LPG_TYPES (excluding 50kg)
const generateStockData = (): StockItem[] => {
  return LPG_TYPES.filter(lpg => lpg.weight !== '50').map(lpg => {
    const quantity = stockQuantities[lpg.weight] || 100
    const minStock = minStockValues[lpg.weight] || 80
    const maxCapacity = maxCapacityValues[lpg.weight] || 500
    const percentage = (quantity / maxCapacity) * 100
    const status = getStatusFromPercentage(percentage)
    
    return {
      id: `lpg-${lpg.weight}kg`,
      name: lpg.label,
      label: lpg.category === 'subsidi' ? 'Subsidi' : 'Non-Subsidi',
      size: `${lpg.weight} Kilogram`,
      quantity,
      minStock,
      maxCapacity,
      unit: 'tabung',
      status,
      icon: 'Cylinder',
      color: status === 'critical' ? 'text-destructive' : 'text-primary',
      bgColor: status === 'critical' ? 'bg-destructive/10' : 'bg-primary/10'
    }
  })
}

const getStatusBadge = (percentage: number) => {
  if (percentage < 25) {
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Menipis</Badge>
  }
  if (percentage < 75) {
    return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Normal</Badge>
  }
  return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Aman</Badge>
}

const getStatusLabel = (percentage: number) => {
  return `${Math.round(percentage)}% kapasitas`
}

const getProgressBarColor = (percentage: number) => {
  if (percentage < 25) return 'bg-destructive'
  if (percentage < 75) return 'bg-primary'
  return 'bg-green-500'
}

export default function StockSummaryCards() {
  const stockData = generateStockData()

 return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stockData.map((item, index) => (
        <Tilt3DCard 
          key={item.id}
          className="animate-fadeInUp"
          style={{ animationDelay: `${0.1 + index * 0.1}s` }}
        >
          <Card 
            className="border-2 shadow-soft hover:shadow-card transition-all duration-300"
          >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
<div className="flex-1">
                <CardTitle className="text-base font-bold">{item.name}</CardTitle>
                <div className="text-muted-foreground text-xs">
                  {item.label}
                </div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bgColor}`}>
                <SafeIcon name={item.icon} className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          </CardHeader>
<CardContent className="space-y-4">
             <div>
               <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold text-foreground">{item.quantity}</span>
                 <span className="text-sm text-muted-foreground">{item.unit}</span>
               </div>
             </div>
             
             {/* Min & Max Capacity Info */}
             <div className="grid grid-cols-2 gap-3 text-xs">
               <div className="bg-secondary rounded-lg p-2">
                 <p className="text-muted-foreground">Min. Stok</p>
                 <p className="font-semibold text-foreground">{item.minStock}</p>
               </div>
               <div className="bg-secondary rounded-lg p-2">
                 <p className="text-muted-foreground">Max Kapasitas</p>
                 <p className="font-semibold text-foreground">{item.maxCapacity}</p>
               </div>
             </div>

             {/* Progress Bar */}
             <div className="space-y-2">
               <div className="flex items-center justify-between text-xs">
                 <span className="text-muted-foreground">Kapasitas</span>
                 <span className="font-semibold text-foreground">
                   {Math.round((item.quantity / item.maxCapacity) * 100)}%
                 </span>
               </div>
               <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor((item.quantity / item.maxCapacity) * 100)}`}
                    style={{ width: `${Math.min((item.quantity / item.maxCapacity) * 100, 100)}%` }}
                  />
                </div>
              </div>

{/* Status Badge */}
<div className="flex justify-between items-center pt-2 border-t">
                 {getStatusBadge((item.quantity / item.maxCapacity) * 100)}
                 <span 
                   id={index === 0 ? 'ij5zvf' : index === 1 ? 'iqc8am' : index === 2 ? 'i0rjz3' : undefined}
                   className="text-xs text-muted-foreground"
                 >
                   {index === 0 ? 'Terjuan: 50' : index === 1 ? 'Terjual: 120' : index === 2 ? 'Terjual: 180' : getStatusLabel((item.quantity / item.maxCapacity) * 100)}
                 </span>
               </div>
</CardContent>
         </Card>
        </Tilt3DCard>
       ))}
     </div>
   )
}
