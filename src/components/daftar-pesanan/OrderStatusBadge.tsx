
import { Badge } from '@/components/ui/badge'

interface OrderStatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
pending: {
      label: 'Belum Dibayar',
      variant: 'outline' as const,
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
    },
    processing: {
      label: 'Diproses',
      variant: 'outline' as const,
      className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
    },
    completed: {
      label: 'Selesai',
      variant: 'outline' as const,
      className: 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
    },
    cancelled: {
      label: 'Dibatalkan',
      variant: 'outline' as const,
      className: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
    }
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
