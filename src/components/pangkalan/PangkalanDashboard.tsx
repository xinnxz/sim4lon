/**
 * PangkalanDashboard - Enhanced Dashboard with Consistent Laporan-style UI
 * 
 * Features:
 * - Gradient cards with shadows and hover effects
 * - Area chart for trend visualization
 * - Pie chart for stock breakdown
 * - Recent sales list with clean styling
 * - Responsive grid layout
 * - Custom tooltips
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi, consumerOrdersApi, pangkalanStockApi, type UserProfile, type ConsumerOrder, type ConsumerOrderStats, type ChartDataPoint } from '@/lib/api'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts'

// LPG type config
const lpgTypeConfig: Record<string, { name: string; color: string }> = {
    'kg3': { name: '3 kg', color: '#22C55E' },
    'kg5': { name: '5.5 kg', color: '#06B6D4' },
    'kg12': { name: '12 kg', color: '#3B82F6' },
    'kg50': { name: '50 kg', color: '#F59E0B' },
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
                <p className="text-white font-semibold text-sm mb-2">{label}</p>
                {payload.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300">{item.name}:</span>
                        <span className="text-white font-medium">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.value)}
                        </span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export default function PangkalanDashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState<ConsumerOrderStats | null>(null)
    const [recentSales, setRecentSales] = useState<ConsumerOrder[]>([])
    const [chartData, setChartData] = useState<ChartDataPoint[]>([])
    const [stockData, setStockData] = useState<Array<{ name: string; value: number; color: string }>>([])
    const [totalStock, setTotalStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const profileData = await authApi.getProfile()
                setProfile(profileData)

                const [statsData, recentData, chartDataFromApi, stockResponse] = await Promise.all([
                    consumerOrdersApi.getStats(true),
                    consumerOrdersApi.getRecent(5),
                    consumerOrdersApi.getChartData(),
                    pangkalanStockApi.getStockLevels(),
                ])

                setStats(statsData)
                setRecentSales(recentData)
                if (chartDataFromApi && chartDataFromApi.length > 0) {
                    setChartData(chartDataFromApi)
                }

                // Convert stock API response to pie chart format
                if (stockResponse && stockResponse.stocks) {
                    const pieData = stockResponse.stocks.map(stock => ({
                        name: lpgTypeConfig[stock.lpg_type]?.name || stock.lpg_type,
                        value: stock.qty,
                        color: lpgTypeConfig[stock.lpg_type]?.color || '#94A3B8',
                    }))
                    setStockData(pieData)
                    setTotalStock(stockResponse.summary.total)
                }
            } catch (err: any) {
                console.error('Failed to fetch dashboard data:', err)
                setError(err?.message || 'Failed to load data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatCurrencyShort = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`
        if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`
        return value.toString()
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }

    // Prepare chart data with formatted dates
    const enhancedChartData = chartData.map(day => ({
        ...day,
        name: formatDate(day.date),
    }))

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SafeIcon name="LayoutDashboard" className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 mt-4 font-medium">Memuat dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SafeIcon name="AlertTriangle" className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Gagal Memuat Data</h3>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                        <SafeIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                        Coba Lagi
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <SafeIcon name="Sparkles" className="h-4 w-4 text-amber-500" />
                        Selamat datang, {profile?.name?.split(' ')[0] || 'Pak'}
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                    onClick={() => window.location.href = '/pangkalan/penjualan/catat'}
                >
                    <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
                    Catat Penjualan
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Penjualan Hari Ini */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="Banknote" className="h-4 w-4" />
                            Penjualan Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(stats?.total_revenue || 0)}</p>
                        <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                            <SafeIcon name="Flame" className="h-3.5 w-3.5" />
                            {stats?.total_qty || 0} tabung terjual
                        </p>
                    </CardContent>
                </Card>

                {/* Laba Bersih */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="BadgeDollarSign" className="h-4 w-4" />
                            Laba Bersih (Profit)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(stats?.laba_bersih || 0)}</p>
                        <p className="text-green-100 text-sm mt-2">Hari ini</p>
                    </CardContent>
                </Card>

                {/* Total Transaksi */}
                <Card className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                <SafeIcon name="Receipt" className="h-4 w-4 text-purple-600" />
                            </div>
                            Total Transaksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold text-slate-900">{stats?.total_orders || 0}</p>
                        <p className="text-slate-500 text-sm mt-2">Transaksi hari ini</p>
                    </CardContent>
                </Card>

                {/* Total Stok */}
                <Card className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                <SafeIcon name="Package" className="h-4 w-4 text-amber-600" />
                            </div>
                            Total Stok
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold text-slate-900">{totalStock} <span className="text-lg font-normal text-slate-500">tabung</span></p>
                        <p className="text-slate-500 text-sm mt-2">{stockData.length} tipe LPG</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Area Chart - Trend 7 Hari */}
                <Card className="lg:col-span-2 bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <SafeIcon name="TrendingUp" className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Trend Penjualan, Modal, Pengeluaran & Laba
                                </CardTitle>
                                <CardDescription className="mt-1">7 hari terakhir • Laba Bersih = (Penjualan - Modal) - Pengeluaran</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={enhancedChartData}>
                                    <defs>
                                        <linearGradient id="penjualanGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="labaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748B" fontSize={12} tickFormatter={formatCurrencyShort} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="penjualan"
                                        name="Penjualan"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        fill="url(#penjualanGradient)"
                                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="modal"
                                        name="Modal"
                                        stroke="#F97316"
                                        strokeWidth={2}
                                        fill="transparent"
                                        dot={{ r: 3, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pengeluaran"
                                        name="Pengeluaran"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fill="transparent"
                                        dot={{ r: 3, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="laba"
                                        name="Laba Bersih"
                                        stroke="#22C55E"
                                        strokeWidth={3}
                                        fill="url(#labaGradient)"
                                        dot={{ r: 5, fill: '#22C55E', strokeWidth: 3, stroke: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-sm text-slate-600">Penjualan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <span className="text-sm text-slate-600">Modal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-red-500" style={{ borderTop: '2px dashed #EF4444' }} />
                                <span className="text-sm text-slate-600">Pengeluaran</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-slate-600">Laba Bersih</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart - Stok per Tipe */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <SafeIcon name="PieChart" className="h-4 w-4 text-emerald-600" />
                            </div>
                            Stok per Tipe
                        </CardTitle>
                        <CardDescription>Total: {totalStock} tabung</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stockData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        dataKey="value"
                                        strokeWidth={3}
                                        stroke="#fff"
                                    >
                                        {stockData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [`${value} tabung`, 'Stok']}
                                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Stock items */}
                        <div className="space-y-2 mt-4">
                            {stockData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="font-medium text-slate-700">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Sales */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <SafeIcon name="Clock" className="h-4 w-4 text-amber-600" />
                                </div>
                                Penjualan Terakhir
                            </CardTitle>
                            <CardDescription className="mt-1">5 transaksi terbaru hari ini</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                            <a href="/pangkalan/penjualan">Lihat Semua →</a>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {recentSales.length === 0 ? (
                        <div className="text-center py-12">
                            <SafeIcon name="Inbox" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-400">Belum ada penjualan hari ini</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => window.location.href = '/pangkalan/penjualan/catat'}
                            >
                                <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
                                Catat Penjualan Pertama
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentSales.map((sale, index) => (
                                <div key={sale.id} className={`flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                                            <SafeIcon name="Flame" className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {sale.consumers?.name || sale.consumer_name || 'Walk-in Customer'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {sale.qty} × {lpgTypeConfig[sale.lpg_type]?.name || sale.lpg_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{formatCurrency(sale.total_amount)}</p>
                                        <p className="text-xs text-slate-400">{formatTime(sale.sale_date)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
