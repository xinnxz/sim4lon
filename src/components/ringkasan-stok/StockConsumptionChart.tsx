
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const chartData = [
  { day: 'Senin', lpg3kg: 35, lpg12kg: 28, lpg50kg: 42 },
  { day: 'Selasa', lpg3kg: 42, lpg12kg: 32, lpg50kg: 38 },
  { day: 'Rabu', lpg3kg: 38, lpg12kg: 35, lpg50kg: 45 },
  { day: 'Kamis', lpg3kg: 45, lpg12kg: 38, lpg50kg: 40 },
  { day: 'Jumat', lpg3kg: 52, lpg12kg: 42, lpg50kg: 48 },
  { day: 'Sabtu', lpg3kg: 48, lpg12kg: 45, lpg50kg: 52 },
  { day: 'Minggu', lpg3kg: 40, lpg12kg: 35, lpg50kg: 38 }
]

export default function StockConsumptionChart() {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-card)'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value) => [`${value} tabung`, '']}
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
            stroke="hsl(var(--chart-4))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
            activeDot={{ r: 6 }}
            name="LPG 50kg"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
