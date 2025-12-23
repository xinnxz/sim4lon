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
import { authApi, consumerOrdersApi, pangkalanStockApi, expensesApi, lpgPricesApi, type UserProfile, type ConsumerOrder, type ConsumerOrderStats, type ChartDataPoint, type Expense, type ExpenseCategory, type PangkalanLpgPrice } from '@/lib/api'
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

// LPG type config - support both formats (3kg from new standard, kg3 from legacy)
const lpgTypeConfig: Record<string, { name: string; color: string }> = {
    // Bright Gas 220gr
    'gr220': { name: 'Bright Gas 220gr', color: '#FFA500' },
    '220gr': { name: 'Bright Gas 220gr', color: '#FFA500' },
    // Standard formats
    '3kg': { name: '3 kg', color: '#22C55E' },
    '5kg': { name: '5.5 kg', color: '#ff82c5ff' },
    '12kg': { name: '12 kg', color: '#3B82F6' },
    '50kg': { name: '50 kg', color: '#ef0e0eff' },
    // Legacy format support
    'kg3': { name: '3 kg', color: '#22C55E' },
    'kg5': { name: '5.5 kg', color: '#ff82c5ff' },
    'kg12': { name: '12 kg', color: '#3B82F6' },
    'kg50': { name: '50 kg', color: '#ef0e0eff' },
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

// Custom pie chart tooltip - with core stock info
const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0]
        const total = payload[0]?.payload?.total || 0
        const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0'

        // Determine stock status
        const qty = data.value
        let status = { text: 'Aman', color: 'text-green-600', bg: 'bg-green-100' }
        if (qty <= 10) {
            status = { text: 'Kritis!', color: 'text-red-600', bg: 'bg-red-100' }
        } else if (qty <= 30) {
            status = { text: 'Menipis', color: 'text-orange-600', bg: 'bg-orange-100' }
        }

        return (
            <div className="bg-white px-4 py-3 rounded-xl shadow-2xl border border-slate-200 min-w-[160px]">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.payload.color }} />
                    <span className="font-semibold text-slate-900">{data.payload.name}</span>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-800">{data.value} tabung</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Proporsi:</span>
                        <span className="font-semibold text-slate-700">{percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-2">
                        <span className="text-slate-500 text-sm">Status:</span>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                            {status.text}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

// Expense categories config
const EXPENSE_CATEGORIES: Record<string, { label: string; color: string }> = {
    'OPERASIONAL': { label: 'Operasional', color: '#64748B' },
    'TRANSPORT': { label: 'Transport', color: '#F97316' },
    'SEWA': { label: 'Sewa', color: '#A855F7' },
    'LISTRIK': { label: 'Listrik/Air', color: '#EAB308' },
    'GAJI': { label: 'Gaji', color: '#3B82F6' },
    'LAINNYA': { label: 'Lainnya', color: '#6B7280' },
}

export default function PangkalanDashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState<ConsumerOrderStats | null>(null)
    const [recentSales, setRecentSales] = useState<ConsumerOrder[]>([])
    const [chartData, setChartData] = useState<ChartDataPoint[]>([])
    const [stockData, setStockData] = useState<Array<{ name: string; value: number; color: string }>>([])
    const [totalStock, setTotalStock] = useState(0)
    const [expenseSummary, setExpenseSummary] = useState<{ total: number; byCategory: Array<{ name: string; value: number; color: string }> }>({ total: 0, byCategory: [] })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Hide footer during loading
    useEffect(() => {
        const footer = document.getElementById('app-footer')
        if (footer) {
            footer.style.display = isLoading ? 'none' : ''
        }
        return () => {
            if (footer) footer.style.display = ''
        }
    }, [isLoading])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const profileData = await authApi.getProfile()
                setProfile(profileData)

                // Get current month date range for expenses
                const now = new Date()
                const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
                const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

                const [statsData, recentData, chartDataFromApi, stockResponse, expenseData, pricesData] = await Promise.all([
                    consumerOrdersApi.getStats(true),
                    consumerOrdersApi.getRecent(5),
                    consumerOrdersApi.getChartData(),
                    pangkalanStockApi.getStockLevels(),
                    expensesApi.getAll(startDate, endDate),
                    lpgPricesApi.getAll(), // Fetch prices to filter by active
                ])

                setStats(statsData)
                setRecentSales(recentData)
                if (chartDataFromApi && chartDataFromApi.length > 0) {
                    setChartData(chartDataFromApi)
                }

                // Convert stock API response to pie chart format - filter by active prices only
                if (stockResponse && stockResponse.stocks) {
                    // Normalize lpg_type format: kg3 <-> 3kg
                    const normalizeType = (type: string) => {
                        // Convert both kg3->3kg and 3kg->kg3 to a common format (kg3)
                        if (type.startsWith('kg')) return type; // already kg3 format
                        // Convert 3kg -> kg3, 12kg -> kg12, etc.
                        const match = type.match(/^(\d+\.?\d*)kg$/);
                        if (match) return `kg${match[1]}`;
                        // Handle gram formats like 220gr, gr220
                        if (type.match(/g?r?220g?r?/i)) return 'gr220';
                        return type;
                    };

                    // Get active lpg_types from prices (normalized)
                    const activeLpgTypes = pricesData
                        .filter((p: PangkalanLpgPrice) => p.is_active)
                        .map((p: PangkalanLpgPrice) => normalizeType(p.lpg_type))

                    // Filter stocks to only include active products (comparing normalized types)
                    const activeStocks = stockResponse.stocks.filter(stock =>
                        activeLpgTypes.includes(normalizeType(stock.lpg_type))
                    )

                    const total = activeStocks.reduce((sum, s) => sum + s.qty, 0)
                    const pieData = activeStocks.map(stock => ({
                        name: lpgTypeConfig[stock.lpg_type]?.name || stock.lpg_type,
                        value: stock.qty,
                        color: lpgTypeConfig[stock.lpg_type]?.color || '#94A3B8',
                        total: total, // Include total for percentage calculation
                    }))
                    setStockData(pieData)
                    setTotalStock(total)
                }

                // Process expense data for pie chart
                if (expenseData && expenseData.length > 0) {
                    const total = expenseData.reduce((sum, e) => sum + Number(e.amount), 0)
                    const byCategory: Record<string, number> = {}
                    expenseData.forEach(e => {
                        byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount)
                    })
                    const pieData = Object.entries(byCategory).map(([cat, amount]) => ({
                        name: EXPENSE_CATEGORIES[cat]?.label || cat,
                        value: amount,
                        color: EXPENSE_CATEGORIES[cat]?.color || '#6B7280',
                    }))
                    setExpenseSummary({ total, byCategory: pieData })
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
                                    <Tooltip content={<PieTooltip />} />
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

            {/* Pengeluaran Summary Card */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pengeluaran Breakdown */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                        <SafeIcon name="Wallet" className="h-4 w-4 text-red-600" />
                                    </div>
                                    Pengeluaran Bulan Ini
                                </CardTitle>
                                <CardDescription className="mt-1">Total: {formatCurrency(expenseSummary.total)}</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" asChild>
                                <a href="/pangkalan/pengeluaran">Kelola →</a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {expenseSummary.byCategory.length === 0 ? (
                            <div className="text-center py-8">
                                <SafeIcon name="Wallet" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400">Belum ada pengeluaran bulan ini</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <div className="h-[150px] w-[150px] flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expenseSummary.byCategory}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={65}
                                                dataKey="value"
                                                strokeWidth={2}
                                                stroke="#fff"
                                            >
                                                {expenseSummary.byCategory.map((entry, index) => (
                                                    <Cell key={`expense-cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<PieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {expenseSummary.byCategory.slice(0, 4).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm text-slate-700">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{formatCurrency(item.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Stats Summary */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <SafeIcon name="TrendingUp" className="h-4 w-4 text-purple-600" />
                            </div>
                            Ringkasan Bulan Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <SafeIcon name="ArrowUpRight" className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-slate-700">Total Penjualan</span>
                            </div>
                            <span className="text-xl font-bold text-blue-600">{formatCurrency(stats?.total_revenue || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                    <SafeIcon name="ArrowDownRight" className="h-5 w-5 text-red-600" />
                                </div>
                                <span className="text-slate-700">Total Pengeluaran</span>
                            </div>
                            <span className="text-xl font-bold text-red-600">-{formatCurrency(expenseSummary.total)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <SafeIcon name="Banknote" className="h-5 w-5 text-green-600" />
                                </div>
                                <span className="font-medium text-green-700">Laba Bersih</span>
                            </div>
                            <span className="text-xl font-bold text-green-600">{formatCurrency((stats?.laba_bersih || 0) - expenseSummary.total)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Sales - Now at the bottom */}
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
