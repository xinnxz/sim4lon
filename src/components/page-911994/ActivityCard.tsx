
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import type { CSSProperties } from 'react'

interface Activity {
  id: string
  type: 'payment' | 'completed' | 'new' | 'shipped'
  title: string
  orderNumber: string
  customerName: string
  timestamp: string
  amount?: string
  quantity?: string
  status: 'completed' | 'pending' | 'processing'
  icon: string
}

interface ActivityCardProps {
  activity: Activity
  style?: CSSProperties
}

export default function ActivityCard({ activity, style }: ActivityCardProps) {
  const handleCardClick = () => {
    window.location.href = `./detail-pesanan.html?id=${encodeURIComponent(activity.orderNumber)}`
  }
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'processing':
        return 'outline'
      default:
        return 'default'
    }
  }

const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'pending':
        return activity.type === 'new' ? 'Belum Dibayar' : 'Menunggu'
      case 'processing':
        return 'Diproses'
      default:
        return status
    }
  }

const getIconColor = (type: string) => {
     switch (type) {
       case 'payment':
         return 'text-green-600'
       case 'completed':
         return 'text-blue-600'
       case 'new':
         return 'text-orange-600'
       case 'delivery':
         return 'text-purple-600'
       default:
         return 'text-primary'
     }
   }

   const getBackgroundColor = (type: string) => {
     return 'bg-secondary'
   }

return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer"
    >
<Card 
         className={`p-4 transition-all hover:shadow-md hover:scale-[1.01] ${getBackgroundColor(activity.type)}`}
         style={style}
       >
      <div className="flex items-start gap-4">
{/* Icon */}
         <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${getBackgroundColor(activity.type)}`}>
           <SafeIcon 
             name={activity.icon} 
             className={`h-6 w-6 ${getIconColor(activity.type)}`}
           />
         </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">
                {activity.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activity.orderNumber}
              </p>
            </div>
            <Badge variant={getStatusBadgeVariant(activity.status)} className="shrink-0">
              {getStatusLabel(activity.status)}
            </Badge>
          </div>

          {/* Details Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SafeIcon name="User" className="h-4 w-4" />
              <span className="truncate">{activity.customerName}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <SafeIcon name="Clock" className="h-4 w-4" />
              <span className="whitespace-nowrap">{activity.timestamp}</span>
            </div>

{/* Amount or Quantity */}
            {activity.amount && (
              <div className="flex items-center gap-2 font-semibold text-primary">
                <span>{activity.amount}</span>
              </div>
            )}

            {activity.quantity && (
              <div className="flex items-center gap-2 font-semibold text-primary">
                <SafeIcon name="Package" className="h-4 w-4" />
                <span>{activity.quantity}</span>
              </div>
            )}
</div>
         </div>
       </div>
      </Card>
    </div>
   )
 }
