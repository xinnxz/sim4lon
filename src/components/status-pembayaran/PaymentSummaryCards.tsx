
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface PaymentSummary {
  totalOrders: number
  paidAmount: number
  unpaidAmount: number
  pendingAmount: number
  paidPercentage: number
  unpaidPercentage: number
  pendingPercentage: number
}

interface PaymentSummaryCardsProps {
  data: PaymentSummary
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function PaymentSummaryCards({ data }: PaymentSummaryCardsProps) {
  const cards = [
    {
      title: 'Total Pesanan',
      value: data.totalOrders.toString(),
      icon: 'ShoppingCart',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      delay: '0s',
    },
    {
      title: 'Sudah Dibayar',
      value: formatCurrency(data.paidAmount),
      subtitle: `${data.paidPercentage}% dari total`,
      icon: 'CheckCircle',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      delay: '0.1s',
    },
    {
      title: 'Belum Dibayar',
      value: formatCurrency(data.unpaidAmount),
      subtitle: `${data.unpaidPercentage}% dari total`,
      icon: 'AlertCircle',
      color: 'bg-red-50',
      iconColor: 'text-red-600',
      delay: '0.2s',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="animate-fadeInUp"
          style={{ animationDelay: card.delay }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.color}`}>
              <SafeIcon name={card.icon} className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
