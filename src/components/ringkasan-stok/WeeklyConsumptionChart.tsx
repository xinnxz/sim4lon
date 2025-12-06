
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartDataPoint {
  day: string
  lpg3kg: number
  lpg12kg: number
  lpg50kg: number
}

const mockChartData: ChartDataPoint[] = [
  { day: 'Senin', lpg3kg: 45, lpg12kg: 32, lpg50kg: 8 },
  { day: 'Selasa', lpg3kg: 52, lpg12kg: 38, lpg50kg: 10 },
  { day: 'Rabu', lpg3kg: 48, lpg12kg: 35, lpg50kg: 9 },
  { day: 'Kamis', lpg3kg: 61, lpg12kg: 42, lpg50kg: 12 },
  { day: 'Jumat', lpg3kg: 55, lpg12kg: 40, lpg50kg: 11 },
  { day: 'Sabtu', lpg3kg: 67, lpg12kg: 48, lpg50kg: 14 },
  { day: 'Minggu', lpg3kg: 58, lpg12kg: 44, lpg50kg: 13 }
]

export default function WeeklyConsumptionChart() {
  return (
    <Card style={{ margin: '0 0 20px 0' }}>
      <CardHeader>
        <CardTitle>Grafik Pemakaian Mingguan</CardTitle>
        <CardDescription>
          Tren pemakaian stok LPG selama 7 hari terakhir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="lpg3kg" 
                stroke="hsl(var(--chart-1))" 
                name="LPG 3kg"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="lpg12kg" 
                stroke="hsl(var(--chart-2))" 
                name="LPG 12kg"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="lpg50kg" 
                stroke="hsl(var(--chart-4))" 
                name="LPG 50kg"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
