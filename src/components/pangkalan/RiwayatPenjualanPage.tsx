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
    '3kg': '3 kg',
    '5kg': '5.5 kg',
    '12kg': '12 kg',
    '50kg': '50 kg',
}

export default function RiwayatPenjualanPage() {
    const [orders, setOrders] = useState<ConsumerOrder[]>([])
    const [stats, setStats] = useState<ConsumerOrderStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPageLoading, setIsPageLoading] = useState(false) // For pagination
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10) // Page size
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [lpgTypeFilter, setLpgTypeFilter] = useState('')

    // Fetch stats only once on mount
    const fetchStats = async () => {
        try {
            const statsData = await consumerOrdersApi.getStats(true)
            setStats(statsData)
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        }
    }

    // Fetch orders (called on page/limit/filter change)
    const fetchOrders = async (showFullLoading = false) => {
        try {
            if (showFullLoading) {
                setIsLoading(true)
            } else {
                setIsPageLoading(true)
            }
            const ordersResponse = await consumerOrdersApi.getAll(page, limit, {
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            })

            // Client-side filtering for search and LPG type (if API doesn't support)
            let filteredData = ordersResponse.data
            if (debouncedSearch) {
                const search = debouncedSearch.toLowerCase()
                filteredData = filteredData.filter(o =>
                    (o.consumers?.name || o.consumer_name || '').toLowerCase().includes(search) ||
                    o.code.toLowerCase().includes(search)
                )
            }
            if (lpgTypeFilter) {
                filteredData = filteredData.filter(o => o.lpg_type === lpgTypeFilter)
            }

            setOrders(filteredData)
            setTotalPages(ordersResponse.meta.totalPages)
            setTotal(ordersResponse.meta.total)
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            toast.error('Gagal memuat data penjualan')
        } finally {
            setIsLoading(false)
            setIsPageLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchStats()
        fetchOrders(true)
    }, [])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Pagination/filter changes - fast update
    useEffect(() => {
        if (!isLoading) {
            fetchOrders(false)
        }
    }, [page, limit, debouncedSearch, startDate, endDate, lpgTypeFilter])

    // Reset page when filters change
    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, startDate, endDate, lpgTypeFilter])

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
            fetchOrders(false)
            fetchStats()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus transaksi')
        }
    }

    // Generate smart page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (page > 3) pages.push('...')

            const start = Math.max(2, page - 1)
            const end = Math.min(totalPages - 1, page + 1)

            for (let i = start; i <= end; i++) pages.push(i)

            if (page < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }
        return pages
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
            {/* Header - Animated */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fadeInDown">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 via-blue-400 to-emerald-500 animate-lineGrow" />
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Penjualan</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <SafeIcon name="History" className="h-4 w-4 animate-pulse" />
                            Riwayat dan pencatatan penjualan LPG
                        </p>
                    </div>
                </div>
                <Button
                    className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-95"
                    onClick={() => window.location.href = '/pangkalan/penjualan/catat'}
                >
                    <SafeIcon name="Plus" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                    Catat Penjualan
                </Button>
            </div>

            {/* Summary Stats - Staggered Entry */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Total Hari Ini */}
                <div className="animate-slideInBlur stagger-1" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="Banknote" className="h-4 w-4" />
                                </div>
                                Penjualan Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(stats?.total_revenue || 0)}</p>
                            <p className="text-blue-100 text-sm mt-2">{stats?.total_qty || 0} tabung</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Laba Hari Ini */}
                <div className="animate-slideInBlur stagger-2" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="TrendingUp" className="h-4 w-4" />
                                </div>
                                Laba Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(stats?.laba_bersih || 0)}</p>
                            <p className="text-green-100 text-sm mt-2">Profit bersih</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Transaksi Hari Ini */}
                <div className="animate-slideInBlur stagger-3" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="Receipt" className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                Transaksi Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{stats?.total_orders || 0}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Transaksi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Total Semua */}
                <div className="animate-slideInBlur stagger-4" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="Database" className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                Total Record
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{total}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Semua transaksi</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama pelanggan atau kode transaksi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <SafeIcon name="X" className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 whitespace-nowrap">Dari:</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 whitespace-nowrap">Sampai:</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* LPG Type Filter */}
                        <select
                            value={lpgTypeFilter}
                            onChange={(e) => setLpgTypeFilter(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="3kg">3 kg</option>
                            <option value="5kg">5.5 kg</option>
                            <option value="12kg">12 kg</option>
                            <option value="50kg">50 kg</option>
                        </select>

                        {/* Clear Filters */}
                        {(searchQuery || startDate || endDate || lpgTypeFilter) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('')
                                    setStartDate('')
                                    setEndDate('')
                                    setLpgTypeFilter('')
                                }}
                                className="rounded-xl whitespace-nowrap"
                            >
                                <SafeIcon name="X" className="h-4 w-4 mr-1" />
                                Hapus Filter
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>Tampilkan</span>
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value))
                            setPage(1) // Reset to first page
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span>dari {total} data</span>
                </div>

                {/* Page Navigation */}
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isPageLoading}
                            className="rounded-lg h-9 px-3"
                        >
                            <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((pageNum, idx) => (
                                pageNum === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">...</span>
                                ) : (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setPage(pageNum as number)}
                                        disabled={isPageLoading}
                                        className={`w-9 h-9 rounded-lg ${page === pageNum ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-100'}`}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || isPageLoading}
                            className="rounded-lg h-9 px-3"
                        >
                            <SafeIcon name="ChevronRight" className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
