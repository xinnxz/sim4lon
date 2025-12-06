
'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface PaymentSummary {
  paidPercentage: number
  unpaidPercentage: number
  pendingPercentage: number
}

interface StatusPembayaranChartProps {
  data: PaymentSummary
}

export default function StatusPembayaranChart({ data }: StatusPembayaranChartProps) {
  const chartData = [
    {
      name: 'Lunas',
      value: data.paidPercentage,
      color: '#009B4C',
    },
    {
      name: 'Belum Dibayar',
      value: data.unpaidPercentage,
      color: '#FF6B6B',
    },
    {
      name: 'Tertunda',
      value: data.pendingPercentage,
      color: '#FFD447',
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-sm font-bold text-foreground">{payload[0].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm text-foreground">
                {entry.payload.name}: {entry.payload.value}%
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
