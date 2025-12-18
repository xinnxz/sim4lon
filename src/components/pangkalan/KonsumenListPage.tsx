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

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import { consumersApi, type Consumer, type ConsumerType } from '@/lib/api'
import { toast } from 'sonner'

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
    // Stats from API - untuk menampilkan jumlah yang benar
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        rumahTangga: 0,
        warung: 0,
        withNik: 0,
    })

    const fetchConsumers = async () => {
        try {
            setIsLoading(true)
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
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error('Nama konsumen wajib diisi')
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
            fetchConsumers()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan konsumen')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (consumer: Consumer) => {
        if (!confirm(`Hapus konsumen "${consumer.name}"?`)) return

        try {
            await consumersApi.delete(consumer.id)
            toast.success('Konsumen berhasil dihapus')
            fetchConsumers()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus konsumen')
        }
    }

    // Stats sekarang diambil dari API (stats state), bukan dari data per halaman

    if (isLoading && consumers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SafeIcon name="Users" className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 mt-4 font-medium">Memuat data konsumen...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Konsumen</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <SafeIcon name="Users" className="h-4 w-4" />
                        Kelola data pelanggan pangkalan Anda
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25"
                        >
                            <SafeIcon name="UserPlus" className="h-4 w-4 mr-2" />
                            Tambah Konsumen
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <SafeIcon name={editingConsumer ? 'UserCog' : 'UserPlus'} className="h-5 w-5 text-blue-600" />
                                    </div>
                                    {editingConsumer ? 'Edit Konsumen' : 'Tambah Konsumen Baru'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingConsumer ? 'Perbarui data konsumen' : 'Isi data konsumen baru untuk pangkalan Anda'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Jenis Konsumen */}
                                <div className="space-y-2">
                                    <Label>Jenis Konsumen *</Label>
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

                                {/* NIK & KK */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nik">NIK (16 digit) (Opsional)</Label>
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
                                        <Label htmlFor="kk">No. KK (16 digit) (Opsional)</Label>
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
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                                    {isSubmitting ? (
                                        <SafeIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <SafeIcon name="Check" className="h-4 w-4 mr-2" />
                                    )}
                                    {editingConsumer ? 'Simpan Perubahan' : 'Tambah Konsumen'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Total Konsumen */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="Users" className="h-4 w-4" />
                            Total Konsumen
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-3xl font-bold tracking-tight">{total}</p>
                        <p className="text-blue-100 text-sm mt-2">Pelanggan terdaftar</p>
                    </CardContent>
                </Card>

                {/* Rumah Tangga */}
                <Card className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                                <SafeIcon name="User" className="h-4 w-4 text-green-600" />
                            </div>
                            Rumah Tangga
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-3xl font-bold text-slate-900">{stats.rumahTangga}</p>
                        <p className="text-slate-500 text-sm mt-2">Konsumen RT</p>
                    </CardContent>
                </Card>

                {/* Warung */}
                <Card className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                <SafeIcon name="Store" className="h-4 w-4 text-amber-600" />
                            </div>
                            Warung
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-3xl font-bold text-slate-900">{stats.warung}</p>
                        <p className="text-slate-500 text-sm mt-2">Usaha mikro</p>
                    </CardContent>
                </Card>

                {/* With NIK */}
                <Card className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                <SafeIcon name="CreditCard" className="h-4 w-4 text-purple-600" />
                            </div>
                            Terverifikasi NIK
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-3xl font-bold text-slate-900">{stats.withNik}</p>
                        <p className="text-slate-500 text-sm mt-2">Sudah input NIK</p>
                    </CardContent>
                </Card>
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
                                    className={`flex items-center justify-between p-4 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${consumer.consumer_type === 'WARUNG'
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                            : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                            }`}>
                                            <SafeIcon
                                                name={consumer.consumer_type === 'WARUNG' ? 'Store' : 'User'}
                                                className="h-6 w-6 text-white"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-900">{consumer.name}</p>
                                                <Badge variant="outline" className={
                                                    consumer.consumer_type === 'WARUNG'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }>
                                                    {consumer.consumer_type === 'WARUNG' ? 'Warung' : 'RT'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                {consumer.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <SafeIcon name="Phone" className="h-3 w-3" />
                                                        {consumer.phone}
                                                    </span>
                                                )}
                                                {consumer.nik && (
                                                    <span className="flex items-center gap-1">
                                                        <SafeIcon name="CreditCard" className="h-3 w-3" />
                                                        NIK: ***{consumer.nik.slice(-4)}
                                                    </span>
                                                )}
                                            </div>
                                            {consumer.address && (
                                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                    <SafeIcon name="MapPin" className="h-3 w-3" />
                                                    {consumer.address.substring(0, 50)}{consumer.address.length > 50 ? '...' : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {consumer._count?.consumer_orders && consumer._count.consumer_orders > 0 && (
                                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                {consumer._count.consumer_orders} order
                                            </Badge>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenDialog(consumer)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            <SafeIcon name="Pencil" className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(consumer)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <SafeIcon name="Trash2" className="h-4 w-4" />
                                        </Button>
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
        </div>
    )
}
