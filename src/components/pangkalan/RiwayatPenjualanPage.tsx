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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import SafeIcon from '@/components/common/SafeIcon'
import { consumerOrdersApi, type ConsumerOrder, type ConsumerOrderStats } from '@/lib/api'
import { LPG_CONFIG, LPG_IMAGES, normalizeType, getLpgName, getLpgColor } from '@/lib/lpg-config'
import { formatCurrency, formatDate, formatTime } from '@/lib/format'
import { toast } from 'sonner'
import PageSkeleton from '@/components/common/PageSkeleton'
import ErrorState from '@/components/common/ErrorState'
import NotaDigital from '@/components/pangkalan/NotaDigital'

// LPG_CONFIG, LPG_IMAGES, getLpgName, getLpgColor imported from @/lib/lpg-config

export default function RiwayatPenjualanPage() {
    const [orders, setOrders] = useState<ConsumerOrder[]>([])
    const [stats, setStats] = useState<ConsumerOrderStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPageLoading, setIsPageLoading] = useState(false) // For pagination
    const [fetchError, setFetchError] = useState<string | null>(null)
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

    // Edit modal state
    const [editingOrder, setEditingOrder] = useState<ConsumerOrder | null>(null)
    const [editForm, setEditForm] = useState({ qty: 1, pricePerUnit: 0, note: '' })
    const [isUpdating, setIsUpdating] = useState(false)

    // Delete confirmation state
    const [deletingOrder, setDeletingOrder] = useState<ConsumerOrder | null>(null)

    // Nota digital state for receipt reprint
    const [notaOrder, setNotaOrder] = useState<ConsumerOrder | null>(null)

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
                // Gunakan normalizeType untuk matching cross-format
                const normalizedFilter = normalizeType(lpgTypeFilter)
                filteredData = filteredData.filter(o =>
                    normalizeType(o.lpg_type || '') === normalizedFilter
                )
            }

            setOrders(filteredData)
            setTotalPages(ordersResponse.meta.totalPages)
            setTotal(ordersResponse.meta.total)
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            setFetchError('Gagal memuat data penjualan')
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

    // formatCurrency, formatDate, formatTime imported from @/lib/format

    const handleDelete = (order: ConsumerOrder) => {
        setDeletingOrder(order)
    }

    const confirmDelete = async () => {
        if (!deletingOrder) return

        // Save scroll position
        const scrollPosition = window.scrollY

        try {
            const result = await consumerOrdersApi.delete(deletingOrder.id)
            // Show custom message if returned by backend (e.g. "stok dikembalikan")
            toast.success(result.message || 'Transaksi dihapus', { duration: 4000 })
            setDeletingOrder(null)
            await fetchOrders(false)
            fetchStats()

            // Restore scroll position
            requestAnimationFrame(() => {
                window.scrollTo(0, scrollPosition)
            })
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus transaksi', { duration: 5000 })
        }
    }

    // Open edit modal with order data
    const openEditModal = (order: ConsumerOrder) => {
        setEditingOrder(order)
        setEditForm({
            qty: order.qty,
            pricePerUnit: Number(order.price_per_unit),
            note: order.note || ''
        })
    }

    // Handle update order
    const handleUpdateOrder = async () => {
        if (!editingOrder) return
        if (editForm.qty < 1) {
            toast.error('Jumlah minimal 1 tabung')
            return
        }

        const scrollPosition = window.scrollY
        setIsUpdating(true)

        try {
            await consumerOrdersApi.update(editingOrder.id, {
                qty: editForm.qty,
                price_per_unit: editForm.pricePerUnit,
                note: editForm.note || undefined
            })

            const qtyDelta = editForm.qty - editingOrder.qty
            const stockMsg = qtyDelta !== 0
                ? ` (Stok ${qtyDelta > 0 ? 'dikurangi' : 'ditambah'} ${Math.abs(qtyDelta)} tabung)`
                : ''

            toast.success(`Transaksi berhasil diupdate${stockMsg}`, { duration: 4000 })
            setEditingOrder(null)
            await fetchOrders(false)
            fetchStats()

            requestAnimationFrame(() => {
                window.scrollTo(0, scrollPosition)
            })
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengupdate transaksi', { duration: 5000 })
        } finally {
            setIsUpdating(false)
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
        return <PageSkeleton variant="table" statCards={4} rows={6} />
    }

    if (fetchError && orders.length === 0) {
        return <ErrorState message={fetchError} onRetry={() => { setFetchError(null); fetchOrders(true) }} />
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
                            <option value="kg3">3 kg</option>
                            <option value="kg5">5.5 kg</option>
                            <option value="kg12">12 kg</option>
                            <option value="kg50">50 kg</option>
                            <option value="gr220">Bright Gas 220gr</option>
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
                            <img
                                src="/images/illustrations/empty-sales.png"
                                alt="Belum ada penjualan"
                                className="w-48 h-48 object-contain mx-auto mb-4 opacity-80"
                            />
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
                            {/* Table Header - Desktop only */}
                            <div className="hidden lg:grid lg:grid-cols-6 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                                <div>Kode</div>
                                <div>Pelanggan</div>
                                <div className="text-center">Tipe LPG</div>
                                <div className="text-center">Qty</div>
                                <div className="text-right">Total</div>
                                <div className="text-right">Waktu</div>
                            </div>

                            {/* Table Body - Responsive cards */}
                            <div className="divide-y divide-slate-100">
                                {orders.map((order, index) => (
                                    <div
                                        key={order.id}
                                        className={`p-3 sm:p-4 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                    >
                                        {/* Mobile Layout */}
                                        <div className="lg:hidden">
                                            <div className="flex items-start gap-3">
                                                {/* Icon - Product Image */}
                                                <div
                                                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center overflow-hidden"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${getLpgColor(order.lpg_type)}20, ${getLpgColor(order.lpg_type)}10)`
                                                    }}
                                                >
                                                    {LPG_IMAGES[order.lpg_type] ? (
                                                        <img
                                                            src={LPG_IMAGES[order.lpg_type]}
                                                            alt={getLpgName(order.lpg_type)}
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                    ) : (
                                                        <SafeIcon name="Cylinder" className="h-5 w-5" style={{ color: getLpgColor(order.lpg_type) }} />
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    {/* Code & Date */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="font-mono text-xs sm:text-sm font-semibold text-slate-700 truncate">{order.code}</p>
                                                        <span className="text-[10px] sm:text-xs text-slate-400 shrink-0">{formatDate(order.sale_date)}</span>
                                                    </div>

                                                    {/* Customer name */}
                                                    <p className="font-medium text-sm text-slate-900 mt-1 truncate">
                                                        {order.consumers?.name || order.consumer_name || 'Walk-in'}
                                                    </p>

                                                    {/* LPG Type, Qty, Total - in a row */}
                                                    <div className="flex items-center justify-between mt-2 gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs px-1.5 py-0.5">
                                                                {getLpgName(order.lpg_type)}
                                                            </Badge>
                                                            <span className="text-xs sm:text-sm text-slate-600">
                                                                <span className="font-bold">{order.qty}</span> tabung
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm sm:text-base text-blue-600">{formatCurrency(order.total_amount)}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEditModal(order)}
                                                                className="h-7 w-7 p-0 hover:bg-blue-100 rounded-lg"
                                                            >
                                                                <SafeIcon name="Pencil" className="h-3.5 w-3.5 text-blue-600" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setNotaOrder(order)}
                                                                className="h-7 w-7 p-0 hover:bg-blue-100 rounded-lg"
                                                            >
                                                                <SafeIcon name="Receipt" className="h-3.5 w-3.5 text-blue-600" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(order)}
                                                                className="h-7 w-7 p-0 hover:bg-red-100 rounded-lg"
                                                            >
                                                                <SafeIcon name="Trash" className="h-3.5 w-3.5 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Layout - Grid */}
                                        <div className="hidden lg:grid lg:grid-cols-6 gap-4 items-center">
                                            {/* Code */}
                                            <div>
                                                <p className="font-mono text-sm font-semibold text-slate-700">{order.code}</p>
                                            </div>

                                            {/* Customer */}
                                            <div>
                                                <span className="font-medium text-slate-900">
                                                    {order.consumers?.name || order.consumer_name || 'Walk-in'}
                                                </span>
                                            </div>

                                            {/* LPG Type - With Image */}
                                            <div className="flex justify-center">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${getLpgColor(order.lpg_type)}20, ${getLpgColor(order.lpg_type)}10)`
                                                        }}
                                                    >
                                                        {LPG_IMAGES[order.lpg_type] ? (
                                                            <img
                                                                src={LPG_IMAGES[order.lpg_type]}
                                                                alt={getLpgName(order.lpg_type)}
                                                                className="w-7 h-7 object-contain"
                                                            />
                                                        ) : (
                                                            <SafeIcon name="Cylinder" className="h-4 w-4" style={{ color: getLpgColor(order.lpg_type) }} />
                                                        )}
                                                    </div>
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                        {getLpgName(order.lpg_type)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Qty */}
                                            <div className="text-center">
                                                <span className="font-bold text-slate-900">{order.qty}</span>
                                                <span className="text-slate-400 text-sm ml-1">tabung</span>
                                            </div>

                                            {/* Total */}
                                            <div className="text-right">
                                                <span className="font-bold text-slate-900">{formatCurrency(order.total_amount)}</span>
                                            </div>

                                            {/* Time + Actions */}
                                            <div className="text-right flex items-center justify-end gap-2">
                                                <div>
                                                    <p className="text-sm text-slate-700">{formatDate(order.sale_date)}</p>
                                                    <p className="text-xs text-slate-400">{formatTime(order.sale_date)}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditModal(order)}
                                                    className="h-8 w-8 p-0 hover:bg-blue-100 rounded-lg"
                                                >
                                                    <SafeIcon name="Pencil" className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setNotaOrder(order)}
                                                    className="h-8 w-8 p-0 hover:bg-emerald-100 rounded-lg"
                                                >
                                                    <SafeIcon name="Receipt" className="h-4 w-4 text-emerald-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(order)}
                                                    className="h-8 w-8 p-0 hover:bg-red-100 rounded-lg"
                                                >
                                                    <SafeIcon name="Trash" className="h-4 w-4 text-red-600" />
                                                </Button>
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
            {/* Pagination end */}


            {/* Edit Modal */}
            <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
                <DialogContent className="max-w-md rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <SafeIcon name="Pencil" className="h-5 w-5 text-blue-600" />
                            </div>
                            Edit Transaksi
                        </DialogTitle>
                        <DialogDescription>
                            {editingOrder?.code} • {editingOrder && getLpgName(editingOrder.lpg_type)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Customer Info */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <p className="text-sm text-slate-500">Pelanggan</p>
                            <p className="font-semibold text-slate-900">
                                {editingOrder?.consumers?.name || editingOrder?.consumer_name || 'Walk-in'}
                            </p>
                        </div>

                        {/* Qty Input */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-qty" className="text-sm font-medium">
                                Jumlah (tabung)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 w-10 rounded-xl"
                                    onClick={() => setEditForm(prev => ({ ...prev, qty: Math.max(1, prev.qty - 1) }))}
                                    disabled={editForm.qty <= 1}
                                >
                                    −
                                </Button>
                                <Input
                                    id="edit-qty"
                                    type="number"
                                    min={1}
                                    value={editForm.qty}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, qty: Math.max(1, parseInt(e.target.value) || 1) }))}
                                    className="h-10 text-center font-bold text-lg rounded-xl flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 w-10 rounded-xl"
                                    onClick={() => setEditForm(prev => ({ ...prev, qty: prev.qty + 1 }))}
                                >
                                    +
                                </Button>
                            </div>
                            {/* Stock adjustment warning */}
                            {editingOrder && editForm.qty !== editingOrder.qty && (
                                <div className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${editForm.qty > editingOrder.qty
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-green-50 text-green-700 border border-green-200'
                                    }`}>
                                    <SafeIcon name={editForm.qty > editingOrder.qty ? 'ArrowDown' : 'ArrowUp'} className="h-3.5 w-3.5" />
                                    Stok akan {editForm.qty > editingOrder.qty ? 'dikurangi' : 'ditambah'} {Math.abs(editForm.qty - editingOrder.qty)} tabung
                                </div>
                            )}
                        </div>

                        {/* Price Input */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-price" className="text-sm font-medium">
                                Harga per Unit (Rp)
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">Rp</span>
                                <Input
                                    id="edit-price"
                                    type="text"
                                    inputMode="numeric"
                                    value={editForm.pricePerUnit.toLocaleString('id-ID')}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '')
                                        setEditForm(prev => ({ ...prev, pricePerUnit: parseInt(val) || 0 }))
                                    }}
                                    className="h-10 pl-10 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Note Input */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-note" className="text-sm font-medium">
                                Catatan (Opsional)
                            </Label>
                            <Input
                                id="edit-note"
                                value={editForm.note}
                                onChange={(e) => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                                placeholder="Tambahkan catatan..."
                                className="h-10 rounded-xl"
                            />
                        </div>

                        {/* Preview Total */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <p className="text-blue-100 text-xs font-medium">Total Baru</p>
                            <p className="text-2xl font-bold">
                                {formatCurrency(editForm.qty * editForm.pricePerUnit)}
                            </p>
                            <p className="text-blue-200 text-xs mt-1">
                                {editForm.qty} × {formatCurrency(editForm.pricePerUnit)}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditingOrder(null)}
                            disabled={isUpdating}
                            className="rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleUpdateOrder}
                            disabled={isUpdating}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700"
                        >
                            {isUpdating ? (
                                <><SafeIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>
                            ) : (
                                <><SafeIcon name="Save" className="h-4 w-4 mr-2" /> Simpan Perubahan</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={!!deletingOrder} onOpenChange={(open) => !open && setDeletingOrder(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <SafeIcon name="AlertTriangle" className="h-5 w-5" />
                            Hapus Transaksi?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus transaksi <strong>{deletingOrder?.code}</strong>?
                            <br /><br />
                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-orange-800 text-sm flex items-start gap-2">
                                <SafeIcon name="Info" className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>
                                    Tindakan ini tidak dapat dibatalkan. Stok tabung sejumlah <strong>{deletingOrder?.qty} tabung</strong> akan dikembalikan ke stok pangkalan.
                                </span>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                        >
                            Hapus & Kembalikan Stok
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Nota Digital Dialog - for reprinting receipts */}
            {notaOrder && (
                <NotaDigital
                    order={notaOrder}
                    open={!!notaOrder}
                    onClose={() => setNotaOrder(null)}
                />
            )}
        </div>
    )
}
