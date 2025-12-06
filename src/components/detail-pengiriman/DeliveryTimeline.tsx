
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface TimelineEvent {
  status: string
  timestamp: string
  notes: string
}

interface DeliveryTimelineProps {
  timeline: TimelineEvent[]
}

export default function DeliveryTimeline({ timeline }: DeliveryTimelineProps) {
  return (
    <Card className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SafeIcon name="Clock" className="h-5 w-5 text-primary" />
          Timeline Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={index} className="flex gap-4">
              {/* Timeline Dot */}
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                {index < timeline.length - 1 && (
                  <div className="mt-2 h-8 w-0.5 bg-border" />
                )}
              </div>

              {/* Timeline Content */}
              <div className="flex-1 pb-4">
                <p className="text-sm font-semibold text-foreground">
                  {event.status}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.timestamp}
                </p>
                {event.notes && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {event.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
