/**
 * LaporanPangkalanPage - Enhanced Laporan UI/UX with Best Practices
 * 
 * Features:
 * - Professional gradient cards with hover effects
 * - Enhanced charts with better tooltips and animations
 * - Clean table design with alternating rows
 * - Responsive grid layout
 * - Smooth transitions and micro-animations
 * - Color-coded financial indicators
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import {
    authApi,
    consumerOrdersApi,
    type UserProfile,
    type ConsumerOrder,
    type ChartDataPoint,
} from '@/lib/api'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Area,
    AreaChart,
    ComposedChart,
} from 'recharts'

// Fixed prices for calculation
const HARGA_MODAL = 16000
const HARGA_JUAL = 18000
const MARGIN_PER_UNIT = HARGA_JUAL - HARGA_MODAL

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

export default function LaporanPangkalanPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [chartData, setChartData] = useState<ChartDataPoint[]>([])
    const [recentSales, setRecentSales] = useState<ConsumerOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState('7hari')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const profileData = await authApi.getProfile()
                setProfile(profileData)

                const [chartDataResult, recentResult] = await Promise.all([
                    consumerOrdersApi.getChartData(),
                    consumerOrdersApi.getRecent(50),
                ])

                setChartData(chartDataResult || [])
                setRecentSales(recentResult || [])
            } catch (err: any) {
                console.error('❌ [Laporan] Error:', err)
                setError(`Gagal memuat data: ${err?.message || 'Unknown error'}`)
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
        const date = new Date(dateStr)
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }

    // Calculate totals
    const totals = chartData.reduce((acc, day) => ({
        qty: acc.qty + Math.round(day.penjualan / HARGA_JUAL),
        penjualan: acc.penjualan + day.penjualan,
        modal: acc.modal + day.modal,
        pengeluaran: acc.pengeluaran + day.pengeluaran,
        laba: acc.laba + day.laba,
    }), { qty: 0, penjualan: 0, modal: 0, pengeluaran: 0, laba: 0 })

    const marginKotor = totals.penjualan - totals.modal
    const marginPercentage = totals.penjualan > 0 ? ((totals.laba / totals.penjualan) * 100).toFixed(1) : '0'

    // Prepare chart data
    const enhancedChartData = chartData.map(day => ({
        name: formatDate(day.date),
        fullDate: day.date,
        penjualan: day.penjualan,
        modal: day.modal,
        margin: day.penjualan - day.modal,
        pengeluaran: day.pengeluaran,
        laba: day.laba,
    }))

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SafeIcon name="BarChart3" className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 mt-4 font-medium">Memuat data laporan...</p>
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
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Laporan Penjualan</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <SafeIcon name="Calculator" className="h-4 w-4" />
                        Perhitungan: Qty × (Harga Jual - Modal)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-slate-300"
                    >
                        <option value="7hari">7 Hari Terakhir</option>
                        <option value="bulan">Bulan Ini</option>
                        <option value="minggu">Minggu Ini</option>
                    </select>
                    <Button variant="outline" size="default" className="rounded-xl shadow-sm hover:shadow-md transition-all">
                        <SafeIcon name="Download" className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Price Info Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex flex-wrap items-center gap-6 lg:gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <SafeIcon name="Package" className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Harga Modal</p>
                            <p className="text-lg font-bold text-slate-900">Rp 16.000<span className="text-sm font-normal text-slate-500">/tabung</span></p>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-slate-200 hidden lg:block" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <SafeIcon name="Tag" className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Harga Jual</p>
                            <p className="text-lg font-bold text-blue-600">Rp 18.000<span className="text-sm font-normal text-slate-500">/tabung</span></p>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-slate-200 hidden lg:block" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <SafeIcon name="TrendingUp" className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Margin/Unit</p>
                            <p className="text-lg font-bold text-green-600">Rp 2.000<span className="text-sm font-normal text-slate-500">/tabung</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                {/* Total Penjualan */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="Banknote" className="h-4 w-4" />
                            Total Penjualan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(totals.penjualan)}</p>
                        <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                            <SafeIcon name="Flame" className="h-3.5 w-3.5" />
                            {totals.qty} tabung terjual
                        </p>
                    </CardContent>
                </Card>

                {/* Total Modal */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="Wallet" className="h-4 w-4" />
                            Total Modal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(totals.modal)}</p>
                        <p className="text-slate-300 text-sm mt-2">Biaya pembelian LPG</p>
                    </CardContent>
                </Card>

                {/* Margin Kotor */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="ArrowUpRight" className="h-4 w-4" />
                            Margin Kotor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(marginKotor)}</p>
                        <p className="text-cyan-100 text-sm mt-2">Sebelum pengeluaran</p>
                    </CardContent>
                </Card>

                {/* Pengeluaran */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="MinusCircle" className="h-4 w-4" />
                            Pengeluaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(totals.pengeluaran)}</p>
                        <p className="text-orange-100 text-sm mt-2">Biaya operasional</p>
                    </CardContent>
                </Card>

                {/* Laba Bersih */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="BadgeDollarSign" className="h-4 w-4" />
                            Laba Bersih
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(totals.laba)}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs">
                                {marginPercentage}% margin
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Penjualan vs Modal Bar Chart */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <SafeIcon name="BarChart3" className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Penjualan vs Modal
                                </CardTitle>
                                <CardDescription className="mt-1">Perbandingan harian selama 7 hari</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={enhancedChartData} barGap={4} barCategoryGap="25%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748B" fontSize={12} tickFormatter={formatCurrencyShort} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="penjualan" name="Penjualan" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="modal" name="Modal" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-sm text-slate-600">Penjualan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <span className="text-sm text-slate-600">Modal</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Trend Laba Bersih Area Chart */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <SafeIcon name="TrendingUp" className="h-4 w-4 text-green-600" />
                                    </div>
                                    Trend Laba Bersih
                                </CardTitle>
                                <CardDescription className="mt-1">Perkembangan profit harian</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={enhancedChartData}>
                                    <defs>
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
                                        dataKey="laba"
                                        name="Laba Bersih"
                                        stroke="#22C55E"
                                        strokeWidth={3}
                                        fill="url(#labaGradient)"
                                        dot={{ r: 5, fill: '#22C55E', strokeWidth: 3, stroke: '#fff' }}
                                        activeDot={{ r: 7, stroke: '#22C55E', strokeWidth: 3, fill: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Summary Table */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <SafeIcon name="Calendar" className="h-4 w-4 text-purple-600" />
                                </div>
                                Ringkasan Per Tanggal
                            </CardTitle>
                            <CardDescription className="mt-1">Perhitungan laba harian</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Tanggal</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Qty</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Modal</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Penjualan</th>
                                    <th className="text-right py-4 px-6 font-semibold text-cyan-600">Margin Kotor</th>
                                    <th className="text-right py-4 px-6 font-semibold text-orange-600">Pengeluaran</th>
                                    <th className="text-right py-4 px-6 font-semibold text-green-600">Laba Bersih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.map((day, index) => {
                                    const qty = Math.round(day.penjualan / HARGA_JUAL)
                                    const margin = day.penjualan - day.modal
                                    return (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 text-slate-900 font-medium">{formatDate(day.date)}</td>
                                            <td className="text-right py-4 px-6 text-slate-700">{qty}</td>
                                            <td className="text-right py-4 px-6 text-slate-700">{formatCurrency(day.modal)}</td>
                                            <td className="text-right py-4 px-6 text-slate-900 font-medium">{formatCurrency(day.penjualan)}</td>
                                            <td className="text-right py-4 px-6 text-cyan-600 font-medium">{formatCurrency(margin)}</td>
                                            <td className="text-right py-4 px-6 text-orange-600">{formatCurrency(day.pengeluaran)}</td>
                                            <td className="text-right py-4 px-6">
                                                <span className={`font-bold ${day.laba >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(day.laba)}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 font-semibold">
                                    <td className="py-4 px-6 text-slate-900">TOTAL</td>
                                    <td className="text-right py-4 px-6 text-slate-900">{totals.qty}</td>
                                    <td className="text-right py-4 px-6 text-slate-900">{formatCurrency(totals.modal)}</td>
                                    <td className="text-right py-4 px-6 text-blue-600 font-bold">{formatCurrency(totals.penjualan)}</td>
                                    <td className="text-right py-4 px-6 text-cyan-600 font-bold">{formatCurrency(marginKotor)}</td>
                                    <td className="text-right py-4 px-6 text-orange-600 font-bold">{formatCurrency(totals.pengeluaran)}</td>
                                    <td className="text-right py-4 px-6 text-green-600 font-bold text-lg">{formatCurrency(totals.laba)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Detail Table */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <SafeIcon name="Receipt" className="h-4 w-4 text-amber-600" />
                                </div>
                                Detail Transaksi
                            </CardTitle>
                            <CardDescription className="mt-1">Rincian penjualan per pelanggan</CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {recentSales.length} transaksi
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto max-h-[450px]">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white shadow-sm z-10">
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Tanggal</th>
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Pelanggan</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Qty</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Modal (×Rp 16.000)</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Total</th>
                                    <th className="text-right py-4 px-6 font-semibold text-green-600">Margin (×Rp 2.000)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
                                            <SafeIcon name="Inbox" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-400">Belum ada transaksi</p>
                                        </td>
                                    </tr>
                                ) : (
                                    recentSales.map((sale, index) => {
                                        const modalAmount = sale.qty * HARGA_MODAL
                                        const marginAmount = sale.qty * MARGIN_PER_UNIT
                                        return (
                                            <tr key={sale.id} className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                                <td className="py-4 px-6 text-slate-600">
                                                    {new Date(sale.sale_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold text-slate-900 uppercase">
                                                        {sale.consumers?.name || sale.consumer_name || 'Walk-in'}
                                                    </span>
                                                </td>
                                                <td className="text-right py-4 px-6 text-slate-700 font-medium">{sale.qty}</td>
                                                <td className="text-right py-4 px-6 text-slate-600">{formatCurrency(modalAmount)}</td>
                                                <td className="text-right py-4 px-6 text-slate-900 font-medium">{formatCurrency(sale.total_amount)}</td>
                                                <td className="text-right py-4 px-6">
                                                    <span className="font-bold text-green-600">{formatCurrency(marginAmount)}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
