
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface TimelineItem {
  status: string
  label: string
  date: string | null
  completed: boolean
}

interface OrderTimelineStatusProps {
  timeline: TimelineItem[]
}

export default function OrderTimelineStatus({ timeline }: OrderTimelineStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={item.status} className="flex gap-4">
              {/* Timeline Dot & Line */}
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  item.completed 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-muted bg-muted text-muted-foreground'
                }`}>
                  {item.completed ? (
                    <SafeIcon name="Check" className="h-5 w-5" />
                  ) : (
                    <SafeIcon name="Clock" className="h-5 w-5" />
                  )}
                </div>
                {index < timeline.length - 1 && (
                  <div className={`w-0.5 h-12 ${item.completed ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>

              {/* Timeline Content */}
              <div className="flex-1 pt-1">
                <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </p>
                {item.date && (
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
