
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface DeliveryInfoCardProps {
  title: string
  icon: string
  data: Array<{
    label: string
    value: string
  }>
}

export default function DeliveryInfoCard({ title, icon, data }: DeliveryInfoCardProps) {
  return (
    <Card className="animate-scaleIn">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SafeIcon name={icon} className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {item.label}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
