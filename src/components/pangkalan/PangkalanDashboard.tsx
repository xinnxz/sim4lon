/**
 * PangkalanDashboard - Dashboard Core untuk Pangkalan
 * 
 * FOKUS: Penjualan + Laba + Stok
 * 
 * Layout:
 * - 4 Stats Cards
 * - Line Chart (Trend) + Pie Chart (Stok)
 * - Target vs Realisasi + Recent Sales
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi, consumerOrdersApi, type UserProfile, type ConsumerOrder, type ConsumerOrderStats } from '@/lib/api'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'

// Mock chart data - Trend 7 hari (will be updated with API data)
const salesChartData = [
    { day: 'Sen', penjualan: 3042000, modal: 2704000, pengeluaran: 50000, laba: 288000 },
    { day: 'Sel', penjualan: 2844000, modal: 2528000, pengeluaran: 45000, laba: 271000 },
    { day: 'Rab', penjualan: 3456000, modal: 3072000, pengeluaran: 60000, laba: 324000 },
    { day: 'Kam', penjualan: 2160000, modal: 1920000, pengeluaran: 30000, laba: 210000 },
    { day: 'Jum', penjualan: 3780000, modal: 3360000, pengeluaran: 55000, laba: 365000 },
    { day: 'Sab', penjualan: 4500000, modal: 4000000, pengeluaran: 70000, laba: 430000 },
    { day: 'Min', penjualan: 2700000, modal: 2400000, pengeluaran: 40000, laba: 260000 },
]

// Stok per LPG
const stockData = [
    { name: '3 kg', value: 150, color: '#22C55E' },
    { name: '5.5 kg', value: 30, color: '#06B6D4' },
    { name: '12 kg', value: 45, color: '#3B82F6' },
    { name: '50 kg', value: 12, color: '#F59E0B' },
]

const totalStock = stockData.reduce((sum, item) => sum + item.value, 0)

export default function PangkalanDashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState<ConsumerOrderStats | null>(null)
    const [recentSales, setRecentSales] = useState<ConsumerOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Now using API data for all stats - dynamic prices!
    const todayQty = stats?.total_qty || 0
    const todayTransaksi = stats?.total_orders || 0
    const todayPenjualan = stats?.total_revenue || 0
    const todayLabaBersih = stats?.laba_bersih || 0

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const profileData = await authApi.getProfile()
                setProfile(profileData)

                const [statsData, recentData] = await Promise.all([
                    consumerOrdersApi.getStats(true),
                    consumerOrdersApi.getRecent(5),
                ])
                setStats(statsData)
                setRecentSales(recentData)
            } catch (error) {
                console.error('Failed to fetch data:', error)
                setStats({
                    total_orders: 0,
                    total_qty: 0,
                    total_revenue: 0,
                    total_modal: 0,
                    margin_kotor: 0,
                    total_pengeluaran: 0,
                    laba_bersih: 0,
                    unpaid_count: 0,
                    unpaid_total: 0
                })
                setRecentSales([])
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <SafeIcon name="Loader2" className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-500">Memuat dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500">Selamat datang, {profile?.name?.split(' ')[0]}</p>
                </div>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                    <a href="/pangkalan/penjualan/catat">
                        <SafeIcon name="Plus" className="mr-2 h-5 w-5" />
                        Catat Penjualan
                    </a>
                </Button>
            </div>

            {/* Core Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="TrendingUp" className="h-4 w-4" />
                            Penjualan Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(todayPenjualan)}</div>
                        <p className="text-blue-100 text-sm mt-1">{todayQty} tabung terjual</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="BadgeDollarSign" className="h-4 w-4" />
                            Laba Bersih Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(todayLabaBersih)}</div>
                        <p className="text-green-100 text-sm mt-1">Setelah pengeluaran</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <SafeIcon name="Receipt" className="h-4 w-4" />
                            Total Transaksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{todayTransaksi}</div>
                        <p className="text-slate-500 text-sm mt-1">Transaksi hari ini</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <SafeIcon name="Package" className="h-4 w-4" />
                            Total Stok
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-cyan-600">{totalStock} <span className="text-lg font-normal">tabung</span></div>
                        <p className="text-slate-500 text-sm mt-1">4 tipe LPG</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1: Trend + Stok */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle>Trend Penjualan, Modal, Pengeluaran & Laba</CardTitle>
                        <CardDescription>7 hari terakhir • Laba Bersih = (Penjualan - Modal) - Pengeluaran</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                                    <YAxis stroke="#64748B" fontSize={12} tickFormatter={formatCurrencyShort} />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0]?.payload as any
                                                const marginKotor = (data?.penjualan || 0) - (data?.modal || 0)
                                                return (
                                                    <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-700 min-w-[200px]">
                                                        <p className="font-bold text-sm mb-2 border-b border-slate-600 pb-1">{label}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-blue-300">💰 Penjualan:</span>
                                                                <span className="font-medium text-blue-400">{formatCurrency(data?.penjualan || 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-orange-300">🏷️ Modal:</span>
                                                                <span className="font-medium text-orange-400">{formatCurrency(data?.modal || 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-300">📊 Margin Kotor:</span>
                                                                <span className="font-medium">{formatCurrency(marginKotor)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-red-300">💸 Pengeluaran:</span>
                                                                <span className="font-medium text-red-400">{formatCurrency(data?.pengeluaran || 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between pt-1 border-t border-slate-600">
                                                                <span className="text-green-300">✨ Laba Bersih:</span>
                                                                <span className="font-bold text-green-400">{formatCurrency(data?.laba || 0)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Line type="monotone" dataKey="penjualan" name="Penjualan" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="modal" name="Modal" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
                                    <Line type="monotone" dataKey="laba" name="Laba Bersih" stroke="#22C55E" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-3 mt-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-sm text-slate-600">Penjualan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <span className="text-sm text-slate-600">Modal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-sm text-slate-600">Pengeluaran</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-slate-600">Laba Bersih</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle>Stok per Tipe</CardTitle>
                        <CardDescription>Total: {totalStock} tabung</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[160px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stockData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                                        {stockData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`${value} tabung`, 'Stok']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {stockData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2: Target vs Realisasi + Recent Sales */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Target vs Realisasi */}
                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle>Target vs Realisasi</CardTitle>
                        <CardDescription>Pencapaian bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Target Penjualan */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600">Target Penjualan</span>
                                <span className="font-semibold">15.8jt / 25jt</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                                    style={{ width: '63%' }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">63% tercapai</p>
                        </div>

                        {/* Target Laba */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600">Target Laba</span>
                                <span className="font-semibold text-green-600">1.76jt / 2.5jt</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                                    style={{ width: '70%' }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">70% tercapai</p>
                        </div>

                        {/* Target Tabung */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600">Target Tabung</span>
                                <span className="font-semibold">880 / 1.200</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all"
                                    style={{ width: '73%' }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">73% tercapai • sisa 17 hari</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Sales */}
                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Penjualan Terbaru</CardTitle>
                            <CardDescription>5 transaksi terakhir</CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <a href="/pangkalan/penjualan">Semua</a>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentSales.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                <SafeIcon name="ShoppingCart" className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <p>Belum ada penjualan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentSales.slice(0, 5).map((sale) => (
                                    <div key={sale.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <SafeIcon name="User" className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                    {sale.consumers?.name || sale.consumer_name || 'Walk-in'}
                                                </p>
                                                <p className="text-xs text-slate-500">{sale.qty} tabung</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">+{formatCurrency(Number(sale.total_amount))}</p>
                                            <p className="text-xs text-slate-500">penjualan</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
