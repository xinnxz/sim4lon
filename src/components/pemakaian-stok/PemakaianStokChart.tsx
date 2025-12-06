
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PemakaianStokChartProps {
  period: string
}

// Mock data for different periods
const getMockData = (period: string) => {
  const baseData = [
    { date: '1 Jan', lpg3kg: 45, lpg12kg: 32, lpg50kg: 8, total: 85 },
    { date: '2 Jan', lpg3kg: 52, lpg12kg: 38, lpg50kg: 10, total: 100 },
    { date: '3 Jan', lpg3kg: 48, lpg12kg: 35, lpg50kg: 9, total: 92 },
    { date: '4 Jan', lpg3kg: 61, lpg12kg: 42, lpg50kg: 12, total: 115 },
    { date: '5 Jan', lpg3kg: 55, lpg12kg: 40, lpg50kg: 11, total: 106 },
    { date: '6 Jan', lpg3kg: 58, lpg12kg: 44, lpg50kg: 13, total: 115 },
    { date: '7 Jan', lpg3kg: 50, lpg12kg: 36, lpg50kg: 9, total: 95 },
    { date: '8 Jan', lpg3kg: 63, lpg12kg: 45, lpg50kg: 14, total: 122 },
    { date: '9 Jan', lpg3kg: 57, lpg12kg: 41, lpg50kg: 11, total: 109 },
    { date: '10 Jan', lpg3kg: 52, lpg12kg: 38, lpg50kg: 10, total: 100 },
    { date: '11 Jan', lpg3kg: 59, lpg12kg: 43, lpg50kg: 12, total: 114 },
    { date: '12 Jan', lpg3kg: 54, lpg12kg: 39, lpg50kg: 10, total: 103 },
    { date: '13 Jan', lpg3kg: 60, lpg12kg: 44, lpg50kg: 13, total: 117 },
    { date: '14 Jan', lpg3kg: 56, lpg12kg: 41, lpg50kg: 11, total: 108 },
    { date: '15 Jan', lpg3kg: 68, lpg12kg: 52, lpg50kg: 15, total: 135 },
  ]

  if (period === '7') {
    return baseData.slice(-7)
  } else if (period === '14') {
    return baseData.slice(-14)
  } else if (period === '30') {
    return baseData
  } else if (period === '90') {
    // Simulate 90 days of data
    const extended = [...baseData]
    for (let i = 16; i <= 90; i++) {
      extended.push({
        date: `${i} Jan`,
        lpg3kg: Math.floor(Math.random() * 30 + 40),
        lpg12kg: Math.floor(Math.random() * 25 + 30),
        lpg50kg: Math.floor(Math.random() * 8 + 8),
        total: Math.floor(Math.random() * 40 + 80),
      })
    }
    return extended
  } else if (period === '365') {
    // Simulate 12 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((month, idx) => ({
      date: month,
      lpg3kg: Math.floor(Math.random() * 300 + 1200),
      lpg12kg: Math.floor(Math.random() * 250 + 900),
      lpg50kg: Math.floor(Math.random() * 80 + 300),
      total: Math.floor(Math.random() * 600 + 2400),
    }))
  }

  return baseData
}

export default function PemakaianStokChart({ period }: PemakaianStokChartProps) {
  const data = getMockData(period)

  return (
    <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
      <CardHeader>
        <CardTitle>Grafik Pemakaian Stok LPG</CardTitle>
        <CardDescription>
          Tren pemakaian stok berdasarkan jenis LPG dalam periode {period} hari
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
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
                  borderRadius: '8px',
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
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
                name="LPG 3kg"
              />
              <Line 
                type="monotone" 
                dataKey="lpg12kg" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                activeDot={{ r: 6 }}
                name="LPG 12kg"
              />
              <Line 
                type="monotone" 
                dataKey="lpg50kg" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
                activeDot={{ r: 6 }}
                name="LPG 50kg"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
