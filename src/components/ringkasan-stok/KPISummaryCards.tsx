'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'

interface KPICard {
  title: string
  value: string
  subtitle: string
  icon: string
  color: string
  delay: number
}

const kpiData: KPICard[] = []

export default function KPISummaryCards() {
return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpiData.map((card) => (
        <Tilt3DCard key={card.title} className="animate-fadeInUp" style={{ animationDelay: `${card.delay}s` }}>
          <Card className="border-2 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        </Tilt3DCard>
      ))}
    </div>
  )
}