
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Sen', stock: 2200 },
  { day: 'Sel', stock: 2100 },
  { day: 'Rab', stock: 1900 },
  { day: 'Kam', stock: 1800 },
  { day: 'Jum', stock: 1700 },
  { day: 'Sab', stock: 1600 },
  { day: 'Min', stock: 1500 }
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground">{payload[0].payload.day}</p>
        <p className="text-sm text-accent font-bold">{payload[0].value} Unit</p>
      </div>
    )
  }
  return null
}

interface StockChartProps {
  isVisible?: boolean
}

export default function StockChart({ isVisible = true }: StockChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={data} 
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
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
          formatter={(value) => `${value}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, opacity: 0.3 }} />
        <Line 
          type="monotone" 
          dataKey="stock" 
          stroke="hsl(var(--accent))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--accent))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          activeDot={{ r: 7, strokeWidth: 2 }}
          isAnimationActive={isVisible}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
