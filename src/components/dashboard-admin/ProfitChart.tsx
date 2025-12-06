
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Senin', revenue: 4000, cost: 2400 },
  { day: 'Selasa', revenue: 3000, cost: 1398 },
  { day: 'Rabu', revenue: 2000, cost: 9800 },
  { day: 'Kamis', revenue: 2780, cost: 3908 },
  { day: 'Jumat', revenue: 1890, cost: 4800 },
  { day: 'Sabtu', revenue: 2390, cost: 3800 },
  { day: 'Minggu', revenue: 3490, cost: 4300 },
]

export default function ProfitChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        <Bar dataKey="cost" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
