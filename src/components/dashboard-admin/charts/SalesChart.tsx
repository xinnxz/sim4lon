
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { day: 'Sen', sales: 2400 },
  { day: 'Sel', sales: 1398 },
  { day: 'Rab', sales: 9800 },
  { day: 'Kam', sales: 3908 },
  { day: 'Jum', sales: 4800 },
  { day: 'Sab', sales: 3800 },
  { day: 'Min', sales: 4300 }
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground">{payload[0].payload.day}</p>
        <p className="text-sm text-primary font-bold">Rp {(payload[0].value / 1000000).toFixed(1)}M</p>
      </div>
    )
  }
  return null
}

interface SalesChartProps {
  isVisible?: boolean
}

export default function SalesChart({ isVisible = true }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={data} 
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
          opacity={0.5}
          vertical={false}
        />
        <XAxis 
          dataKey="day" 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          formatter={(value) => `Rp${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, opacity: 0.3 }} />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="hsl(var(--primary))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--primary))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          activeDot={{ r: 7, strokeWidth: 2 }}
          isAnimationActive={isVisible}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-in-out"
          fillOpacity={1}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
