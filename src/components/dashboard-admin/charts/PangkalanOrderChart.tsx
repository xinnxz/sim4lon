import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, ResponsiveContainer as RC } from 'recharts'

const baseData = [
  { name: 'Pangkalan Maju Jaya Abadi', value: 45 },
  { name: 'Pangkalan Berkah Sejahtera', value: 28 },
  { name: 'Pangkalan Sumber Rezeki', value: 18 },
  { name: 'Pangkalan Bersama', value: 9 },
].sort((a, b) => b.value - a.value).slice(0, 5)

const totalValue = baseData.reduce((sum, item) => sum + item.value, 0)
const data = baseData.map(item => ({
  ...item,
  percentage: ((item.value / totalValue) * 100).toFixed(1)
}))

const COLORS = [
  '#009B4C',        // Primary green (darker)
  '#FFD447',        // Gold/Accent
  '#20B551',        // Light green
  '#7FD8B4',        // Mint green
  '#E8F5E9',        // Very light green
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-xs font-semibold text-foreground max-w-xs truncate">{data.name}</p>
        <p className="text-sm font-bold text-primary">{data.value} pesanan</p>
        <p className="text-xs text-muted-foreground">{data.percentage}%</p>
      </div>
    )
  }
  return null
}

interface PangkalanOrderChartProps {
  isVisible?: boolean
}

export default function PangkalanOrderChart({ isVisible = true }: PangkalanOrderChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
        <Pie
          data={data}
          cx="40%"
          cy="45%"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={8}
          dataKey="value"
          labelLine={false}
          label={({ percentage }) => `${percentage}%`}
          isAnimationActive={isVisible}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={30}
          layout="vertical"
          align="right"
          formatter={(value, entry) => (
            <span className="text-xs text-foreground truncate max-w-xs">
              {entry.payload.name}
            </span>
          )}
          wrapperStyle={{ paddingTop: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}