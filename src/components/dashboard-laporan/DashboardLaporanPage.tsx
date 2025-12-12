import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SafeIcon from '@/components/common/SafeIcon'
import KPICard from './KPICard'
import ReportChart from './ReportChart'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data for KPIs
const mockKPIs = [
  {
    title: 'Total Penjualan',
    value: 'Rp 125.500.000',
    change: '+12.5%',
    trend: 'up',
    icon: 'TrendingUp'
  },
  {
    title: 'Total Pesanan',
    value: '1.245',
    change: '+8.3%',
    trend: 'up',
    icon: 'ShoppingCart'
  },
  {
    title: 'Total Pembayaran',
    value: 'Rp 98.750.000',
    change: '+5.2%',
    trend: 'up',
    icon: 'DollarSign'
  },
  {
    title: 'Stok Terjual',
    value: '3.850 Tabung',
    change: '+15.8%',
    trend: 'up',
    icon: 'Package'
  }
]

// Mock data for Tren Penjualan
const generateMockSalesData = (from: Date, to: Date) => {
  const data = []
  const current = new Date(from)

  while (current <= to) {
    const day = current.getDate()
    const month = current.getMonth() + 1
    const year = current.getFullYear()

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

// Mock data for Status Pembayaran
const mockPaymentData = {
  summary: {
    totalOrders: 1245,
    paidAmount: 98750000,
    unpaidAmount: 18500000,
    paidPercentage: 84,
    unpaidPercentage: 16
  },
  details: [
    { id: 'ORD-001', pangkalan: 'Pangkalan Merdeka', amount: 5325000, status: 'Lunas', date: '2025-12-01', dueDate: '2025-12-15' },
    { id: 'ORD-002', pangkalan: 'Pangkalan Jaya', amount: 900000, status: 'Belum Dibayar', date: '2025-12-03', dueDate: '2025-12-10' },
    { id: 'ORD-003', pangkalan: 'Pangkalan Sentosa', amount: 6000000, status: 'Lunas', date: '2025-12-03', dueDate: '2025-12-20' },
    { id: 'ORD-005', pangkalan: 'Pangkalan Pusat', amount: 4200000, status: 'Lunas', date: '2025-12-04', dueDate: '2025-12-18' },
  ]
}

// Mock data for Pemakaian Stok
const getMockStockData = (period: string) => {
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
  ]

  if (period === '7') {
    return baseData.slice(-7)
  } else if (period === '14') {
    return baseData.slice(-14)
  } else if (period === '30') {
    return baseData
  }
  return baseData
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.fullDate || payload[0].payload.date}</p>
        <p className="text-sm text-primary font-semibold">
          {payload[0].name}: Rp {(payload[0].value / 1000000).toFixed(1)}M
        </p>
        {payload[1] && (
          <p className="text-sm text-accent-foreground font-semibold">
            {payload[1].name}: Rp {(payload[1].value / 1000000).toFixed(1)}M
          </p>
        )}
      </div>
    )
  }
  return null
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Lunas':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <SafeIcon name="CheckCircle" className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    case 'Belum Dibayar':
      return <Badge variant="destructive">
        <SafeIcon name="AlertCircle" className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function DashboardLaporanPage() {
  const [period, setPeriod] = useState('bulan')
  const [paymentPeriod, setPaymentPeriod] = useState('bulan')
  const [stockPeriod, setStockPeriod] = useState('30')
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  })

  const chartData = generateMockSalesData(dateRange.from, dateRange.to)
  const stockData = getMockStockData(stockPeriod)

  const formatYAxis = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(0)}M`
  }


  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-b from-background to-background/50">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Laporan</h1>
          <p className="text-muted-foreground mt-1">
            Ringkasan visual metrik operasional dan keuangan
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href="./export-laporan.html">
              <SafeIcon name="Download" className="mr-2 h-4 w-4" />
              Export
            </a>
          </Button>
        </div>
      </div>

      {/* Tabbed Reports Section */}
      <Card className="border-0">
        <Tabs defaultValue="tren-penjualan" className="w-full">
          <div id="id30sk" className="border-b-2 border-border px-6 pt-6">
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-4">
              <TabsTrigger
                value="tren-penjualan"
                className="relative bg-transparent px-0 py-3 font-semibold text-foreground/70 data-[state=active]:text-primary data-[state=active]:bg-transparent border-b-2 border-b-transparent data-[state=active]:border-b-primary rounded-none"
              >
                Penjualan
              </TabsTrigger>
              <TabsTrigger
                value="status-pembayaran"
                className="relative bg-transparent px-0 py-3 font-semibold text-foreground/70 data-[state=active]:text-primary data-[state=active]:bg-transparent border-b-2 border-b-transparent data-[state=active]:border-b-primary rounded-none"
              >
                Pembayaran
              </TabsTrigger>
              <TabsTrigger
                value="pemakaian-stok"
                className="relative bg-transparent px-0 py-3 font-semibold text-foreground/70 data-[state=active]:text-primary data-[state=active]:bg-transparent border-b-2 border-b-transparent data-[state=active]:border-b-primary rounded-none"
              >
                Pemakaian Stok
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tren Penjualan Tab */}
          <TabsContent value="tren-penjualan" className="mt-0">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 id="ibydml" className="text-lg font-semibold text-foreground mb-2">Penjualan</h3>
                  <p className="text-sm text-muted-foreground">Analisis tren penjualan mingguan dan historis</p>
                </div>

                {/* Period Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Filter Periode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Periode</label>
                        <Select value={period} onValueChange={setPeriod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih periode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bulan">Bulan Ini</SelectItem>
                            <SelectItem value="bulan-lalu">Bulan Lalu</SelectItem>
                            <SelectItem value="3-bulan">3 Bulan Terakhir</SelectItem>
                            <SelectItem value="6-bulan">6 Bulan Terakhir</SelectItem>
                            <SelectItem value="12-bulan">12 Bulan Terakhir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full sm:w-auto">
                        <SafeIcon name="RefreshCw" className="mr-2 h-4 w-4" />
                        Perbarui
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Tilt3DCard id="ivcrvq" className="animate-fadeInUp">
                    <Card>
                      <CardHeader id="icgna6" className="pb-3">
                        <p className="text-sm font-semibold text-foreground/70">Total Penjualan</p>
                      </CardHeader>
                      <CardContent id="iu4gts">
                        <p className="text-2xl font-bold text-primary">Rp 982.5M</p>
                        <p className="text-xs text-foreground/60 mt-1">Dalam periode</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>
                  <Tilt3DCard id="ikzitr" className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <Card>
                      <CardHeader className="pb-3">
                        <p className="text-sm font-semibold text-foreground/70">Total Pesanan</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">485</p>
                        <p className="text-xs text-foreground/60 mt-1">Pesanan dalam periode</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>
                  <Tilt3DCard id="i5nq8k" className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <Card style={{ borderTopRightRadius: '0px' }}>
                      <CardHeader className="pb-3">
                        <p className="text-sm font-semibold text-foreground/70">Rata-rata Harian</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">Rp 32.75M</p>
                        <p className="text-xs text-foreground/60 mt-1">Dari 30 hari terakhir</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>
                  <Tilt3DCard id="iax1tl" className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <Card id="i0i41n" style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
                      <CardHeader className="pb-3">
                        <p className="text-sm font-semibold text-foreground/70">Pertumbuhan</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">+18.5%</p>
                        <p className="text-xs text-foreground/60 mt-1">Vs periode sebelumnya</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>
                </div>

                {/* Sales Chart */}
                <Card className="animate-fadeInUp">
                  <CardHeader>
                    <CardTitle>Tren Penjualan (Grafik Garis)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-80">
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
                          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
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
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="animate-fadeInUp">
                  <CardHeader>
                    <CardTitle>Perbandingan Penjualan vs Target (Grafik Batang)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-80">
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
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
                  </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="animate-fadeInUp">
                  <CardHeader>
                    <CardTitle>Riwayat Penjualan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 bg-secondary/50">
                            <th className="text-left px-4 py-3 font-semibold">Tanggal</th>
                            <th className="text-right px-4 py-3 font-semibold">Penjualan</th>
                            <th className="text-right px-4 py-3 font-semibold">Target</th>
                            <th className="text-right px-4 py-3 font-semibold">Pencapaian</th>
                            <th className="text-right px-4 py-3 font-semibold">Pesanan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.slice(-7).reverse().map((item, index) => {
                            const achievement = ((item.penjualan / item.target) * 100).toFixed(1)
                            const isAboveTarget = item.penjualan >= item.target

                            return (
                              <tr key={index} className="border-b-2 hover:bg-secondary/30">
                                <td className="px-4 py-3">{item.fullDate}</td>
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
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </TabsContent>

          {/* Status Pembayaran Tab */}
          <TabsContent value="status-pembayaran" className="mt-0">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Status Pembayaran</h3>
                  <p className="text-sm text-muted-foreground">Ringkasan status pembayaran pesanan dan analisis keuangan</p>
                </div>

                {/* Period Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Filter Periode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Periode</label>
                        <Select value={paymentPeriod} onValueChange={setPaymentPeriod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih periode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bulan">Bulan Ini</SelectItem>
                            <SelectItem value="bulan-lalu">Bulan Lalu</SelectItem>
                            <SelectItem value="3-bulan">3 Bulan Terakhir</SelectItem>
                            <SelectItem value="6-bulan">6 Bulan Terakhir</SelectItem>
                            <SelectItem value="12-bulan">12 Bulan Terakhir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full sm:w-auto">
                        <SafeIcon name="RefreshCw" className="mr-2 h-4 w-4" />
                        Perbarui
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Tilt3DCard className="animate-fadeInUp">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-foreground/70">Total Pesanan</CardTitle>
                        <div className="p-2 rounded-lg bg-blue-50">
                          <SafeIcon name="ShoppingCart" className="h-4 w-4 text-blue-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">{mockPaymentData.summary.totalOrders}</div>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>

                  <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-foreground/70">Sudah Dibayar</CardTitle>
                        <div className="p-2 rounded-lg bg-green-50">
                          <SafeIcon name="CheckCircle" className="h-4 w-4 text-green-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">{formatCurrency(mockPaymentData.summary.paidAmount)}</div>
                        <p className="text-xs text-foreground/60 mt-1">{mockPaymentData.summary.paidPercentage}% dari total</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>

                  <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-foreground/70">Belum Dibayar</CardTitle>
                        <div className="p-2 rounded-lg bg-red-50">
                          <SafeIcon name="AlertCircle" className="h-4 w-4 text-red-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-destructive">{formatCurrency(mockPaymentData.summary.unpaidAmount)}</div>
                        <p className="text-xs text-foreground/60 mt-1">{mockPaymentData.summary.unpaidPercentage}% dari total</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>
                </div>

                {/* Pie Chart */}
                <Card className="animate-fadeInUp">
                  <CardHeader>
                    <CardTitle>Distribusi Status Pembayaran</CardTitle>
                    <CardDescription>Persentase pesanan berdasarkan status pembayaran</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Lunas', value: mockPaymentData.summary.paidPercentage, fill: '#009B4C' },
                              { name: 'Belum Dibayar', value: mockPaymentData.summary.unpaidPercentage, fill: '#EF4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[
                              { fill: '#009B4C' },
                              { fill: '#EF4444' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Details Table */}
                <Card className="animate-fadeInUp">
                  <CardHeader>
                    <CardTitle>Detail Pembayaran</CardTitle>
                    <CardDescription>Daftar lengkap status pembayaran untuk setiap pesanan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>ID Pesanan</TableHead>
                            <TableHead>Pangkalan</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Pesanan</TableHead>
                            <TableHead>Jatuh Tempo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPaymentData.details.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.pangkalan}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(item.amount)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(item.status)}
                              </TableCell>
                              <TableCell>{formatDate(item.date)}</TableCell>
                              <TableCell>{formatDate(item.dueDate)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </TabsContent>

          {/* Pemakaian Stok Tab */}
          <TabsContent value="pemakaian-stok" className="mt-0">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pemakaian Stok LPG</h3>
                  <p className="text-sm text-muted-foreground">Analisis pemakaian stok LPG berdasarkan periode waktu</p>
                </div>

                {/* Period Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Filter Periode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Periode</label>
                        <Select value={stockPeriod} onValueChange={setStockPeriod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih periode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 Hari Terakhir</SelectItem>
                            <SelectItem value="14">14 Hari Terakhir</SelectItem>
                            <SelectItem value="30">30 Hari Terakhir</SelectItem>
                            <SelectItem value="90">90 Hari Terakhir</SelectItem>
                            <SelectItem value="365">1 Tahun Terakhir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full sm:w-auto">
                        <SafeIcon name="RefreshCw" className="mr-2 h-4 w-4" />
                        Perbarui
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-foreground/70">Total Pemakaian</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">2,450</div>
                        <p className="text-xs text-foreground/60 mt-1">Tabung dalam periode ini</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>

                  <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-foreground/70">Rata-rata Harian</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">81.7</div>
                        <p className="text-xs text-foreground/60 mt-1">Tabung per hari</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>

                  <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-foreground/70">Pemakaian Tertinggi</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">156</div>
                        <p className="text-xs text-foreground/60 mt-1">Pada 15 Januari 2025</p>
                      </CardContent>
                    </Card>
                  </Tilt3DCard>
                </div>

                {/* Main Chart */}
                <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  <CardHeader>
                    <CardTitle>Grafik Pemakaian Stok LPG</CardTitle>
                    <CardDescription>
                      Tren pemakaian stok berdasarkan jenis LPG dalam periode {stockPeriod} hari
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stockData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
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
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown by Type */}
                <Card className="animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                  <CardHeader>
                    <CardTitle>Pemakaian Berdasarkan Jenis LPG</CardTitle>
                    <CardDescription>
                      Distribusi pemakaian untuk setiap jenis tabung
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">LPG 3kg</span>
                          <span className="text-sm font-bold">1,200 tabung (49%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '49%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">LPG 12kg</span>
                          <span className="text-sm font-bold">900 tabung (37%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{ width: '37%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">LPG 50kg</span>
                          <span className="text-sm font-bold">350 tabung (14%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-chart-3 h-2 rounded-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
