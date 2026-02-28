/**
 * KonsumenListPage - Enhanced Konsumen Management Page
 * 
 * Features:
 * - Full CRUD operations
 * - NIK (16 digit) field for subsidy verification
 * - KK (16 digit) field for household identification
 * - Consumer type: RUMAH_TANGGA (person icon) / WARUNG (store icon)
 * - Filter by type
 * - Search functionality
 * - Consistent styling with Dashboard/Laporan
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
import { consumersApi, consumerOrdersApi, type Consumer, type ConsumerType, type ConsumerOrder } from '@/lib/api'
import { toast } from 'sonner'
import PageSkeleton from '@/components/common/PageSkeleton'

// LPG Product Images Mapping
const LPG_IMAGES: Record<string, string> = {
    'kg3': '/images/products/lpg-3kg.png',
    '3kg': '/images/products/lpg-3kg.png',
    'kg5': '/images/products/lpg-5kg.png',
    '5kg': '/images/products/lpg-5kg.png',
    'kg12': '/images/products/lpg-12kg.png',
    '12kg': '/images/products/lpg-12kg.png',
    'kg50': '/images/products/lpg-50kg.png',
    '50kg': '/images/products/lpg-50kg.png',
    'bright_gas': '/images/products/bright-gas.png',
    'brightgas': '/images/products/bright-gas.png',
}

const getLpgImage = (lpgType: string): string => {
    const normalized = lpgType?.toLowerCase().replace(/[^a-z0-9]/g, '')
    return LPG_IMAGES[normalized] || LPG_IMAGES[lpgType?.toLowerCase()] || '/images/products/lpg-3kg.png'
}

export default function KonsumenListPage() {
    const [consumers, setConsumers] = useState<Consumer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingConsumer, setEditingConsumer] = useState<Consumer | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        kk: '',
        consumer_type: 'RUMAH_TANGGA' as ConsumerType,
        phone: '',
        address: '',
        note: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    // State for delete confirmation modal
    const [deleteConfirmConsumer, setDeleteConfirmConsumer] = useState<Consumer | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    // Stats from API - untuk menampilkan jumlah yang benar
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        rumahTangga: 0,
        warung: 0,
        withNik: 0,
    })
    // State for purchase history view
    const [historyConsumer, setHistoryConsumer] = useState<Consumer | null>(null)
    const [historyData, setHistoryData] = useState<ConsumerOrder[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyLoadingMore, setHistoryLoadingMore] = useState(false)
    const [historyStats, setHistoryStats] = useState({ totalQty: 0, totalAmount: 0, totalTransactions: 0 })
    const [historyPage, setHistoryPage] = useState(1)
    const [historyHasMore, setHistoryHasMore] = useState(false)
    const HISTORY_PAGE_SIZE = 20

    // Preserve scroll position when dialog opens/closes
    // Note: modal={false} on Dialog prevents scroll lock, but we keep this as backup
    const scrollPositionRef = useRef<number>(0)

    const handleDialogOpenChange = (open: boolean) => {
        if (open) {
            scrollPositionRef.current = window.scrollY
        }
        setIsDialogOpen(open)
    }

    const fetchConsumers = async (silentRefresh = false) => {
        // Save scroll position before fetch
        const scrollPosition = window.scrollY

        try {
            // Only show loading on initial load, not on refetch
            if (!silentRefresh) {
                setIsLoading(true)
            }
            // Fetch consumers dan stats secara paralel
            const [response, statsData] = await Promise.all([
                consumersApi.getAll(page, 10, search || undefined),
                consumersApi.getStats(),
            ])
            // Filter by type if needed (client-side for current page)
            let filtered = response.data
            if (typeFilter !== 'all') {
                filtered = response.data.filter(c => c.consumer_type === typeFilter)
            }
            setConsumers(filtered)
            setTotalPages(response.meta.totalPages)
            setTotal(response.meta.total)
            // Set stats dari API
            setStats(statsData)

            // Restore scroll position after data update (for silent refresh)
            if (silentRefresh) {
                requestAnimationFrame(() => {
                    window.scrollTo(0, scrollPosition)
                })
            }
        } catch (error) {
            console.error('Failed to fetch consumers:', error)
            toast.error('Gagal memuat data konsumen')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchConsumers()
    }, [page, search, typeFilter])

    const handleOpenDialog = (consumer?: Consumer) => {
        if (consumer) {
            setEditingConsumer(consumer)
            setFormData({
                name: consumer.name,
                nik: consumer.nik || '',
                kk: consumer.kk || '',
                consumer_type: consumer.consumer_type || 'RUMAH_TANGGA',
                phone: consumer.phone || '',
                address: consumer.address || '',
                note: consumer.note || '',
            })
        } else {
            setEditingConsumer(null)
            setFormData({
                name: '',
                nik: '',
                kk: '',
                consumer_type: 'RUMAH_TANGGA',
                phone: '',
                address: '',
                note: '',
            })
        }
        handleDialogOpenChange(true)  // Use handler to save scroll position
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error('Nama konsumen wajib diisi')
            return
        }
        // Validate NIK is required
        if (!formData.nik) {
            toast.error('NIK wajib diisi')
            return
        }
        // Validate KK is required
        if (!formData.kk) {
            toast.error('Nomor KK wajib diisi')
            return
        }
        // Validate NIK/KK if provided
        if (formData.nik && formData.nik.length !== 16) {
            toast.error('NIK harus 16 digit')
            return
        }
        if (formData.kk && formData.kk.length !== 16) {
            toast.error('Nomor KK harus 16 digit')
            return
        }

        try {
            setIsSubmitting(true)
            const payload = {
                name: formData.name,
                nik: formData.nik || undefined,
                kk: formData.kk || undefined,
                consumer_type: formData.consumer_type,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
                note: formData.note || undefined,
            }

            if (editingConsumer) {
                await consumersApi.update(editingConsumer.id, payload)
                toast.success('Konsumen berhasil diperbarui')
            } else {
                await consumersApi.create(payload)
                toast.success('Konsumen berhasil ditambahkan')
            }
            setIsDialogOpen(false)
            // Silent refresh to preserve scroll position
            fetchConsumers(true)
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan konsumen')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteConfirmConsumer) return

        try {
            setIsDeleting(true)
            await consumersApi.delete(deleteConfirmConsumer.id)
            toast.success('Konsumen berhasil dihapus', { duration: 4000 })
            setDeleteConfirmConsumer(null)
            // Silent refresh to preserve scroll position
            fetchConsumers(true)
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus konsumen', { duration: 5000 })
        } finally {
            setIsDeleting(false)
        }
    }

    // Fetch purchase history for a consumer (initial load)
    const fetchConsumerHistory = async (consumer: Consumer) => {
        setHistoryConsumer(consumer)
        setHistoryLoading(true)
        setHistoryData([])
        setHistoryPage(1)
        setHistoryStats({ totalQty: 0, totalAmount: 0, totalTransactions: 0 })

        try {
            // First, get first page of data
            const response = await consumerOrdersApi.getAll(1, HISTORY_PAGE_SIZE, { consumerId: consumer.id })
            const orders = response.data || []
            const meta = response.meta

            setHistoryData(orders)
            setHistoryHasMore(meta.page < meta.totalPages)

            // Set total transactions from meta
            setHistoryStats(prev => ({ ...prev, totalTransactions: meta.total }))

            // Calculate totals from displayed orders (will be updated as more pages load)
            // For accurate totals, we sum from all loaded data
            const totals = orders.reduce((acc, order) => ({
                totalQty: acc.totalQty + order.qty,
                totalAmount: acc.totalAmount + Number(order.total_amount),
                totalTransactions: meta.total  // Use server's total count
            }), { totalQty: 0, totalAmount: 0, totalTransactions: meta.total })

            // If there are more pages, fetch remaining data in background for accurate stats
            if (meta.totalPages > 1) {
                // Fetch all remaining pages for accurate totals
                const allPagesPromises = []
                for (let p = 2; p <= meta.totalPages; p++) {
                    allPagesPromises.push(consumerOrdersApi.getAll(p, HISTORY_PAGE_SIZE, { consumerId: consumer.id }))
                }

                const allPagesResults = await Promise.all(allPagesPromises)
                const allOrders = [...orders]
                allPagesResults.forEach(res => {
                    allOrders.push(...(res.data || []))
                })

                // Calculate complete totals
                const completeTotals = allOrders.reduce((acc, order) => ({
                    totalQty: acc.totalQty + order.qty,
                    totalAmount: acc.totalAmount + Number(order.total_amount),
                    totalTransactions: meta.total
                }), { totalQty: 0, totalAmount: 0, totalTransactions: meta.total })

                setHistoryStats(completeTotals)
            } else {
                setHistoryStats(totals)
            }
        } catch (error: any) {
            toast.error('Gagal memuat riwayat pembelian')
            setHistoryConsumer(null)
        } finally {
            setHistoryLoading(false)
        }
    }

    // Load more history data (pagination)
    const loadMoreHistory = async () => {
        if (!historyConsumer || historyLoadingMore || !historyHasMore) return

        setHistoryLoadingMore(true)
        const nextPage = historyPage + 1

        try {
            const response = await consumerOrdersApi.getAll(nextPage, HISTORY_PAGE_SIZE, { consumerId: historyConsumer.id })
            const newOrders = response.data || []
            const meta = response.meta

            setHistoryData(prev => [...prev, ...newOrders])
            setHistoryPage(nextPage)
            setHistoryHasMore(meta.page < meta.totalPages)
        } catch (error: any) {
            toast.error('Gagal memuat data lebih lanjut')
        } finally {
            setHistoryLoadingMore(false)
        }
    }

    // Stats sekarang diambil dari API (stats state), bukan dari data per halaman

    if (isLoading && consumers.length === 0) {
        return <PageSkeleton variant="cards" statCards={4} rows={6} />
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header - Animated */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fadeInDown">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 animate-lineGrow" />
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Konsumen</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <SafeIcon name="Users" className="h-4 w-4 animate-pulse" />
                            Kelola data pelanggan pangkalan Anda
                        </p>
                    </div>
                </div>
                <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <SheetContent
                        side="right"
                        hideCloseButton
                        className="w-full sm:max-w-[480px] overflow-y-auto p-0 border-l border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            {/* Enhanced Header with Gradient - Fixed height, no shrink */}
                            <div className="relative shrink-0 min-h-[70px] px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white overflow-hidden">
                                {/* Decorative orbs */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                                <div className="relative z-10 flex items-center gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/30">
                                        <SafeIcon name={editingConsumer ? 'UserCog' : 'UserPlus'} className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h2 className="text-base sm:text-lg font-bold tracking-tight leading-tight truncate">
                                            {editingConsumer ? 'Edit Konsumen' : 'Tambah Konsumen'}
                                        </h2>
                                        <p className="text-blue-100 text-xs sm:text-sm leading-tight truncate">
                                            {editingConsumer ? 'Perbarui data konsumen' : 'Isi data konsumen baru'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content with Sections */}
                            <div className="flex-1 px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
                                {/* Jenis Konsumen - Enhanced Cards */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <SafeIcon name="Tag" className="h-4 w-4 text-blue-500" />
                                        Jenis Konsumen
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, consumer_type: 'RUMAH_TANGGA' })}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.consumer_type === 'RUMAH_TANGGA'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.consumer_type === 'RUMAH_TANGGA' ? 'bg-blue-100' : 'bg-slate-100'
                                                }`}>
                                                <SafeIcon name="User" className={`h-5 w-5 ${formData.consumer_type === 'RUMAH_TANGGA' ? 'text-blue-600' : 'text-slate-500'
                                                    }`} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold">Rumah Tangga</p>
                                                <p className="text-xs text-slate-500">Konsumen perorangan</p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, consumer_type: 'WARUNG' })}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.consumer_type === 'WARUNG'
                                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.consumer_type === 'WARUNG' ? 'bg-amber-100' : 'bg-slate-100'
                                                }`}>
                                                <SafeIcon name="Store" className={`h-5 w-5 ${formData.consumer_type === 'WARUNG' ? 'text-amber-600' : 'text-slate-500'
                                                    }`} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold">Warung</p>
                                                <p className="text-xs text-slate-500">Usaha mikro</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Nama */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Konsumen *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Contoh: Bu Tini / Warung Berkah"
                                        required
                                    />
                                </div>

                                {/* NIK & KK - Stacked on mobile, side-by-side on tablet+ */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nik">
                                            NIK (16 digit) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="nik"
                                            value={formData.nik}
                                            onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                            placeholder="3201234567890123"
                                            maxLength={16}
                                        />
                                        <p className="text-xs text-slate-400">{formData.nik.length}/16 digit</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kk">
                                            No. KK (16 digit) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="kk"
                                            value={formData.kk}
                                            onChange={(e) => setFormData({ ...formData, kk: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                            placeholder="3201234567890123"
                                            maxLength={16}
                                        />
                                        <p className="text-xs text-slate-400">{formData.kk.length}/16 digit</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. Telepon (Opsional)</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="08123456789"
                                    />
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="address">Alamat (Opsional)</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Jl. Contoh No. 123, RT 01/02"
                                        rows={2}
                                    />
                                </div>

                                {/* Note */}
                                <div className="space-y-2">
                                    <Label htmlFor="note">Catatan</Label>
                                    <Input
                                        id="note"
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        placeholder="Catatan tambahan..."
                                    />
                                </div>
                            </div>

                            {/* Enhanced Sticky Footer */}
                            <div className="sticky bottom-0 px-4 sm:px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                                    >
                                        <SafeIcon name="X" className="h-4 w-4 mr-2 text-slate-500" />
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        {isSubmitting ? (
                                            <SafeIcon name="Loader2" className="h-5 w-5 mr-2 animate-spin" />
                                        ) : (
                                            <SafeIcon name="Check" className="h-5 w-5 mr-2" />
                                        )}
                                        {editingConsumer ? 'Simpan' : 'Tambah'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </SheetContent>
                </Sheet>
                {/* Add Button - moved outside Sheet */}
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25"
                >
                    <SafeIcon name="UserPlus" className="h-4 w-4 mr-2" />
                    Tambah Konsumen
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Total Konsumen */}
                <div className="animate-slideInBlur stagger-1" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="Users" className="h-4 w-4" />
                                </div>
                                Total Konsumen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-3xl font-bold tracking-tight">{total}</p>
                            <p className="text-blue-100 text-sm mt-2">Pelanggan terdaftar</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Rumah Tangga */}
                <div className="animate-slideInBlur stagger-2" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="User" className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                Rumah Tangga
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.rumahTangga}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Konsumen RT</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Warung */}
                <div className="animate-slideInBlur stagger-3" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="Store" className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                Warung
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.warung}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Usaha mikro</p>
                        </CardContent>
                    </Card>
                </div>

                {/* With NIK */}
                <div className="animate-slideInBlur stagger-4" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="CreditCard" className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                Terverifikasi NIK
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.withNik}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sudah input NIK</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Cari nama, NIK, atau telepon..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="pl-10 rounded-xl"
                    />
                </div>
                <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[180px] rounded-xl">
                        <SelectValue placeholder="Filter Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Jenis</SelectItem>
                        <SelectItem value="RUMAH_TANGGA">Rumah Tangga</SelectItem>
                        <SelectItem value="WARUNG">Warung</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Consumers List */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <SafeIcon name="Users" className="h-4 w-4 text-blue-600" />
                        </div>
                        Daftar Konsumen
                    </CardTitle>
                    <CardDescription>{consumers.length} konsumen ditampilkan</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {consumers.length === 0 ? (
                        <div className="text-center py-16">
                            <SafeIcon name="UserX" className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Konsumen</h3>
                            <p className="text-slate-400 mb-6">Tambahkan konsumen untuk mulai mencatat penjualan</p>
                            <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
                                <SafeIcon name="UserPlus" className="h-4 w-4 mr-2" />
                                Tambah Konsumen Pertama
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {consumers.map((consumer, index) => (
                                <div
                                    key={consumer.id}
                                    onClick={() => fetchConsumerHistory(consumer)}
                                    className={`p-3 sm:p-4 hover:bg-blue-50/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                >
                                    {/* Mobile-first: Stack vertically on small screens */}
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center ${consumer.consumer_type === 'WARUNG'
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                            : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                            }`}>
                                            <SafeIcon
                                                name={consumer.consumer_type === 'WARUNG' ? 'Store' : 'User'}
                                                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            {/* Name + Badge row */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-slate-900 text-sm sm:text-base truncate max-w-[140px] sm:max-w-none">{consumer.name}</p>
                                                <Badge variant="outline" className={`text-[10px] sm:text-xs shrink-0 ${consumer.consumer_type === 'WARUNG'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {consumer.consumer_type === 'WARUNG' ? 'Warung' : 'RT'}
                                                </Badge>
                                            </div>

                                            {/* Contact info - column layout on mobile */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 text-xs sm:text-sm text-slate-500 mt-1">
                                                {consumer.phone && (
                                                    <span className="flex items-center gap-1 truncate">
                                                        <SafeIcon name="Phone" className="h-3 w-3 shrink-0" />
                                                        <span className="truncate">{consumer.phone}</span>
                                                    </span>
                                                )}
                                                {consumer.nik && (
                                                    <span className="flex items-center gap-1">
                                                        <SafeIcon name="CreditCard" className="h-3 w-3 shrink-0" />
                                                        NIK: ***{consumer.nik.slice(-4)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Address */}
                                            {consumer.address && (
                                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
                                                    <SafeIcon name="MapPin" className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{consumer.address.substring(0, 40)}{consumer.address.length > 40 ? '...' : ''}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions - always visible on right */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            {consumer._count?.consumer_orders && consumer._count.consumer_orders > 0 && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] sm:text-xs px-1.5 sm:px-2">
                                                    {consumer._count.consumer_orders}
                                                    <span className="hidden sm:inline ml-1">order</span>
                                                </Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleOpenDialog(consumer); }}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                            >
                                                <SafeIcon name="Pencil" className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirmConsumer(consumer); }}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                            >
                                                <SafeIcon name="Trash2" className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    <span className="text-sm text-slate-500">
                        Halaman {page} dari {totalPages}
                    </span>
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

            {/* Purchase History Sheet */}
            <Sheet open={!!historyConsumer} onOpenChange={(open) => !open && setHistoryConsumer(null)}>
                <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto p-0">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <SafeIcon name="History" className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Riwayat Pembelian</h2>
                                <p className="text-green-100 text-sm">{historyConsumer?.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-xs text-slate-500 uppercase font-medium">Total Volume</p>
                                <p className="text-2xl font-bold text-green-600">{historyStats.totalQty.toLocaleString('id-ID')}</p>
                                <p className="text-xs text-slate-400">tabung</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-xs text-slate-500 uppercase font-medium">Total Pembelian</p>
                                <p className="text-xl font-bold text-slate-900">
                                    Rp {historyStats.totalAmount.toLocaleString('id-ID')}
                                </p>
                                <p className="text-xs text-slate-400">{historyStats.totalTransactions.toLocaleString('id-ID')} transaksi</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction List */}
                    <div className="px-6 py-4">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <SafeIcon name="Receipt" className="h-4 w-4" />
                            Daftar Transaksi
                        </h3>

                        {historyLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-green-500" />
                            </div>
                        ) : historyData.length === 0 ? (
                            <div className="text-center py-12">
                                <SafeIcon name="ShoppingBag" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">Belum ada riwayat pembelian</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {historyData.map((order) => (
                                    <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-3">
                                            {/* Product Image */}
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 p-1 flex-shrink-0 border border-slate-200">
                                                <img
                                                    src={getLpgImage(order.lpg_type || '')}
                                                    alt={order.lpg_type || 'LPG'}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => { e.currentTarget.src = '/images/products/lpg-3kg.png' }}
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <Badge className="bg-green-100 text-green-700 text-xs mb-1">
                                                            {order.lpg_type?.toUpperCase() || 'LPG'}
                                                        </Badge>
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {order.qty} tabung × Rp {Number(order.price_per_unit).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                    <p className="text-lg font-bold text-green-600 whitespace-nowrap">
                                                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                                                    <span className="flex items-center gap-1">
                                                        <SafeIcon name="Calendar" className="h-3 w-3" />
                                                        {new Date(order.sale_date).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <Badge variant="outline" className={`text-[10px] ${order.payment_status === 'LUNAS'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                        }`}>
                                                        {order.payment_status}
                                                    </Badge>
                                                </div>
                                                {order.note && (
                                                    <p className="text-xs text-slate-400 mt-2 italic">"{order.note}"</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Load More Button */}
                        {historyHasMore && !historyLoading && (
                            <div className="pt-4">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl"
                                    onClick={loadMoreHistory}
                                    disabled={historyLoadingMore}
                                >
                                    {historyLoadingMore ? (
                                        <>
                                            <SafeIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                                            Memuat...
                                        </>
                                    ) : (
                                        <>
                                            <SafeIcon name="ChevronDown" className="h-4 w-4 mr-2" />
                                            Muat Lebih Banyak ({historyStats.totalTransactions - historyData.length} lagi)
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Showing count */}
                        {historyData.length > 0 && (
                            <p className="text-xs text-center text-slate-400 pt-4">
                                Menampilkan {historyData.length} dari {historyStats.totalTransactions} transaksi
                            </p>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={!!deleteConfirmConsumer} onOpenChange={(open) => !open && setDeleteConfirmConsumer(null)}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <SafeIcon name="AlertTriangle" className="h-6 w-6 text-red-600" />
                            </div>
                            <AlertDialogTitle className="text-lg font-semibold">
                                Hapus Konsumen?
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-slate-600">
                            Apakah Anda yakin ingin menghapus konsumen <strong className="text-slate-900">{deleteConfirmConsumer?.name}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="rounded-xl"
                        >
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <SafeIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <SafeIcon name="Trash2" className="h-4 w-4 mr-2" />
                                    Hapus
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
