
import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface SalesChartProps {
  dateRange: {
    from: Date
    to: Date
  }
}

// Mock data generator
const generateMockSalesData = (from: Date, to: Date) => {
  const data = []
  const current = new Date(from)
  
  while (current <= to) {
    const day = current.getDate()
    const month = current.getMonth() + 1
    const year = current.getFullYear()
    
    // Generate realistic sales data
    const baseAmount = 30000000 + Math.random() * 20000000
    const variance = Math.sin(day / 7) * 10000000
    const randomFactor = (Math.random() - 0.5) * 5000000
    
    data.push({
      date: `${day}/${month}`,
      fullDate: current.toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      penjualan: Math.max(15000000, baseAmount + variance + randomFactor),
      target: 35000000,
      pesanan: Math.floor(Math.random() * 50) + 20,
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return data
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.fullDate}</p>
        <p className="text-sm text-primary font-semibold">
          Penjualan: Rp {(payload[0].value / 1000000).toFixed(1)}M
        </p>
        {payload[1] && (
          <p className="text-sm text-accent-foreground font-semibold">
            Target: Rp {(payload[1].value / 1000000).toFixed(1)}M
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Pesanan: {payload[0].payload.pesanan}
        </p>
      </div>
    )
  }
  return null
}

export default function SalesChart({ dateRange }: SalesChartProps) {
  const chartData = useMemo(() => {
    return generateMockSalesData(dateRange.from, dateRange.to)
  }, [dateRange])

  // Format Y-axis labels
  const formatYAxis = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(0)}M`
  }

  return (
    <div className="w-full space-y-6">
      {/* Line Chart - Sales Trend */}
      <div className="w-full h-80 bg-gradient-to-br from-background to-secondary/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Tren Penjualan (Grafik Garis)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={formatYAxis}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="penjualan" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Penjualan Aktual"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--accent))', r: 3 }}
              name="Target Penjualan"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Sales by Day */}
      <div className="w-full h-80 bg-gradient-to-br from-background to-secondary/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Perbandingan Penjualan vs Target (Grafik Batang)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={formatYAxis}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="penjualan" 
              fill="hsl(var(--primary))" 
              name="Penjualan Aktual"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="target" 
              fill="hsl(var(--accent))" 
              name="Target Penjualan"
              radius={[8, 8, 0, 0]}
              opacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table Summary */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Tanggal</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Penjualan</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Target</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Pencapaian</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Pesanan</th>
            </tr>
          </thead>
          <tbody>
            {chartData.slice(-7).reverse().map((item, index) => {
              const achievement = ((item.penjualan / item.target) * 100).toFixed(1)
              const isAboveTarget = item.penjualan >= item.target
              
              return (
                <tr key={index} className="border-b hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{item.fullDate}</td>
                  <td className="text-right px-4 py-3 font-semibold text-primary">
                    Rp {(item.penjualan / 1000000).toFixed(1)}M
                  </td>
                  <td className="text-right px-4 py-3 text-muted-foreground">
                    Rp {(item.target / 1000000).toFixed(1)}M
                  </td>
                  <td className={`text-right px-4 py-3 font-semibold ${isAboveTarget ? 'text-primary' : 'text-destructive'}`}>
                    {achievement}%
                  </td>
                  <td className="text-right px-4 py-3 text-muted-foreground">
                    {item.pesanan}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
