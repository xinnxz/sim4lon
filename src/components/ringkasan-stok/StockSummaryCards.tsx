
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'

interface StockItem {
  id: string
  name: string
  type: string
  quantity: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
  minStock: number
  icon: string
  color: string
}

const mockStockData: StockItem[] = [
  {
    id: 'lpg-3kg',
    name: 'LPG 3kg',
    type: 'Tabung Kecil',
    quantity: 450,
    unit: 'tabung',
    status: 'normal',
    minStock: 100,
    icon: 'Package',
    color: 'bg-blue-100'
  },
  {
    id: 'lpg-12kg',
    name: 'LPG 12kg',
    type: 'Tabung Sedang',
    quantity: 280,
    unit: 'tabung',
    status: 'normal',
    minStock: 80,
    icon: 'Package',
    color: 'bg-green-100'
  },
  {
    id: 'lpg-50kg',
    name: 'LPG 50kg',
    type: 'Tabung Besar',
    quantity: 45,
    unit: 'tabung',
    status: 'warning',
    minStock: 50,
    icon: 'Package',
    color: 'bg-amber-100'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'normal':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Normal</Badge>
    case 'warning':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Menipis</Badge>
    case 'critical':
      return <Badge variant="destructive">Kritis</Badge>
    default:
      return null
  }
}

export default function StockSummaryCards() {
return (
    <div className="grid gap-4 md:grid-cols-3" style={{ margin: '15px 0px 15px 0px' }}>
      {mockStockData.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-card transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="text-xs">{item.type}</CardDescription>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                <SafeIcon name={item.icon} className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quantity Display */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-primary">{item.quantity}</span>
                <span className="text-sm text-muted-foreground">{item.unit}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Min. Stok: {item.minStock}</span>
                <span>Sisa: {item.quantity - item.minStock}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between pt-2 border-t">
              {getStatusBadge(item.status)}
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round((item.quantity / (item.minStock * 3)) * 100)}% kapasitas
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
