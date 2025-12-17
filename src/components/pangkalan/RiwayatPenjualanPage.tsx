/**
 * RiwayatPenjualanPage - Halaman Penjualan (formerly Riwayat Penjualan)
 * 
 * Features:
 * - Sales history table with pagination
 * - Summary stats cards
 * - Filter by date
 * - Consistent styling with Dashboard/Laporan
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { consumerOrdersApi, type ConsumerOrder, type ConsumerOrderStats } from '@/lib/api'
import { toast } from 'sonner'

// LPG type names
const LPG_NAMES: Record<string, string> = {
    'kg3': '3 kg',
    'kg5': '5.5 kg',
    'kg12': '12 kg',
    'kg50': '50 kg',
}

export default function RiwayatPenjualanPage() {
    const [orders, setOrders] = useState<ConsumerOrder[]>([])
    const [stats, setStats] = useState<ConsumerOrderStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [ordersResponse, statsData] = await Promise.all([
                consumerOrdersApi.getAll(page, 10),
                consumerOrdersApi.getStats(true), // Today stats
            ])
            setOrders(ordersResponse.data)
            setTotalPages(ordersResponse.meta.totalPages)
            setTotal(ordersResponse.meta.total)
            setStats(statsData)
        } catch (error) {
            console.error('Failed to fetch data:', error)
            toast.error('Gagal memuat data penjualan')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const handleDelete = async (order: ConsumerOrder) => {
        if (!confirm('Hapus transaksi ini?')) return
        try {
            await consumerOrdersApi.delete(order.id)
            toast.success('Transaksi dihapus')
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus transaksi')
        }
    }

    if (isLoading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SafeIcon name="ShoppingBag" className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 mt-4 font-medium">Memuat data penjualan...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Penjualan</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <SafeIcon name="History" className="h-4 w-4" />
                        Riwayat dan pencatatan penjualan LPG
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

            {/* Summary Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Total Hari Ini */}
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
                        <p className="text-blue-100 text-sm mt-2">{stats?.total_qty || 0} tabung</p>
                    </CardContent>
                </Card>

                {/* Laba Hari Ini */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="TrendingUp" className="h-4 w-4" />
                            Laba Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(stats?.laba_bersih || 0)}</p>
                        <p className="text-green-100 text-sm mt-2">Profit bersih</p>
                    </CardContent>
                </Card>

                {/* Transaksi Hari Ini */}
                <Card className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                <SafeIcon name="Receipt" className="h-4 w-4 text-purple-600" />
                            </div>
                            Transaksi Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold text-slate-900">{stats?.total_orders || 0}</p>
                        <p className="text-slate-500 text-sm mt-2">Transaksi</p>
                    </CardContent>
                </Card>

                {/* Total Semua */}
                <Card className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                <SafeIcon name="Database" className="h-4 w-4 text-amber-600" />
                            </div>
                            Total Record
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold text-slate-900">{total}</p>
                        <p className="text-slate-500 text-sm mt-2">Semua transaksi</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <SafeIcon name="ShoppingBag" className="h-4 w-4 text-blue-600" />
                                </div>
                                Daftar Transaksi
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {total} transaksi tercatat
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {orders.length === 0 ? (
                        <div className="text-center py-16">
                            <SafeIcon name="Inbox" className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Penjualan</h3>
                            <p className="text-slate-400 mb-6">Mulai catat penjualan LPG Anda</p>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => window.location.href = '/pangkalan/penjualan/catat'}
                            >
                                <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
                                Catat Penjualan Pertama
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="hidden lg:grid lg:grid-cols-6 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                                <div>Kode</div>
                                <div>Pelanggan</div>
                                <div className="text-center">Tipe LPG</div>
                                <div className="text-center">Qty</div>
                                <div className="text-right">Total</div>
                                <div className="text-right">Waktu</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-slate-100">
                                {orders.map((order, index) => (
                                    <div
                                        key={order.id}
                                        className={`flex flex-col lg:grid lg:grid-cols-6 gap-2 lg:gap-4 p-4 lg:px-6 lg:py-4 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                    >
                                        {/* Code */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center lg:hidden">
                                                <SafeIcon name="Flame" className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm font-semibold text-slate-700">{order.code}</p>
                                                <p className="text-xs text-slate-400 lg:hidden">{formatDate(order.sale_date)}</p>
                                            </div>
                                        </div>

                                        {/* Customer */}
                                        <div className="flex items-center">
                                            <span className="font-medium text-slate-900">
                                                {order.consumers?.name || order.consumer_name || 'Walk-in'}
                                            </span>
                                        </div>

                                        {/* LPG Type */}
                                        <div className="flex items-center justify-center">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                {LPG_NAMES[order.lpg_type] || order.lpg_type}
                                            </Badge>
                                        </div>

                                        {/* Qty */}
                                        <div className="flex items-center justify-center">
                                            <span className="font-bold text-slate-900">{order.qty}</span>
                                            <span className="text-slate-400 text-sm ml-1">tabung</span>
                                        </div>

                                        {/* Total */}
                                        <div className="flex items-center justify-end">
                                            <span className="font-bold text-slate-900">{formatCurrency(order.total_amount)}</span>
                                        </div>

                                        {/* Time */}
                                        <div className="hidden lg:flex items-center justify-end text-right">
                                            <div>
                                                <p className="text-sm text-slate-700">{formatDate(order.sale_date)}</p>
                                                <p className="text-xs text-slate-400">{formatTime(order.sale_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-xl"
                    >
                        <SafeIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
                        Sebelumnya
                    </Button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1
                            return (
                                <Button
                                    key={pageNum}
                                    variant={page === pageNum ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setPage(pageNum)}
                                    className={`w-10 h-10 rounded-xl ${page === pageNum ? 'bg-blue-600' : ''}`}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}
                        {totalPages > 5 && <span className="text-slate-400">...</span>}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-xl"
                    >
                        Selanjutnya
                        <SafeIcon name="ChevronRight" className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    )
}
